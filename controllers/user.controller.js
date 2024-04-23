import { User } from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from "fs";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { userInfo } from "os";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //   7 days in milliseconds
  httpOnly: true, //client cannot access this property
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All Fields are required", 400)); //  if any field is missing send a bad request error
  }

  const userExit = await User.findOne({ email }); // Finds a user document in the database based on the provided email address
  // const exit= await User.findOne({ email: email })    ///  for  testing

  if (userExit) {
    return next(new AppError("User Exit with same E-mail id ", 400)); //  400 is a bad request status code
  }
  // Two step to save user
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      publicId: email,
      secure_url: "https://example.com/img1.jpg", /// it will be replaced by image url when app goes live
    },
  });

  if (!user) {
    return next(new AppError("Server Error", 500)); // internal server error status code
  }
  //TODO : File Upload
  if (req.file) {
    console.log(req.file); //   For Testing Purpose
    console.log("FIle COmes");
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });
      if (result) {
        user.avatar.secure_url = result.secure_url;

        //remove file from server
        // fs.rm(`uploads/${req.file.filename}`);
        fs.rm(
          `uploads/${req.file.filename}`,
          { recursive: true, force: true },
          (error) => {
            //you can handle the error here
            console.log(error);
            //console.log(error.message);
          }
        );
      }
    } catch (error) {
      return next(new AppError("Problem With Image Uploading ", 400));
    }
  }

  await user.save(); //   saves the new user in database

  user.password = undefined; //   remove password field before sending response

  const token = await user.getSignedJwtToken(); //     create JWT token getSignedJwtToken
  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    status: "success",
    message: "User Created",
    data: {
      userInfo: user,
    },
  });
};

const login = async (req, res, next) => {
  // const { email, password } = req.body; //   get email and password from body of request
  // Get user from collection

  try {
    const { email, password } = req.body;
    if (!username || !email) {
      return next(new AppError("Please provide email and password", 400));
    }

    // find the user  by his/her email or username ;
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      return next(
        new AppError("User not exit or find based on email or username", 400)
      );
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return next(new AppError("Password is not correct", 400));
    }

    const token = await user.getSignedJwtToken(); //create jwt token for authentication
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    return next(
      new AppError("User not exit or find based on email or username", 400)
    );
  }
};

const logout = (req, res) => {
  res.cookie("token", "none", { ...cookieOptions, maxAge: 1 }).send({
    status: "success",
    message: "Logged out",
  });

  /* res.cookie('token',null,{        // sir wala code hai ye
    secure:true,
    maxAge:0,
    httpOnly:true
  })
  res.status(200).json({
    sucess:true,
    message:"Logeed Out"
  })*/
};

const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "No User Found" });
    } else {
      res.status(200).json({ status: "succes", data: user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  console.log("Reser Start");
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res
      .status(400)
      .json({ status: "fail", message: "Please provide an email " });
  }
  const user = User.findOne({ email: email });
  //console.log(user);
 // console.log(typeof user.generateResetToken());

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "The user with the provided email is not found!",
    });
  }

  console.log("reset"); //  test

  const resetToken = await  user.generateResetToken(); //generateResetToken
  console.log(resetToken);
  const url = `http://localhost:3000/resetpassword?token=${resetToken}`;

  await user.save();
  const reserPassworedURL = `http://localhost:3001/reset-password/${resetToken}`;

  const message = `${reserPassworedURL}`;
  const subject = "Reset Password";

  try {
    await sendEmail(email, subject, message);
    //console.log(url);
    res.status(200).json({
      status: "success",
      message: `A link to reset your password has been sent to your ${email}.`,
    });
  } catch (error) {
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    //await user.save();

    res.status(400).json({
      status: false,
      message: `Something Wrong...`,
    });
  }
};
const resetPassword = async (req, res) => {};

export { register, login, logout, profile, forgotPassword, resetPassword };
