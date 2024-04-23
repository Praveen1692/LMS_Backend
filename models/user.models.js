import mongoose from "mongoose";
import bcrypt from "bcrypt"; //   used for hashing passwords.
import jwt from "jsonwebtoken"; //   Used to create signed JSON Web Tokens.
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // creating a schema for the users

    fullName: {
      type: String,
      required: [true, "Please provide your Full Name"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Please provide your Email"],
      trim: true,

      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide your Password"],
      select: false, //  this will hide the password field while fetching data from database
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    avatar: {
      publicId: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

//  this middleware function ensures that the password field of a user document is hashed before saving it to the database, but only if the password has been modified.
userSchema.pre("save", async function (next) {
  //  middleware function
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/*userSchema.method = {
  getSignedJwtToken: async function () {
    return await jwt.sign({
      id: this._id, //  _id is a property of mongoose model and it contains the unique identifier for each document in the id: this._id }
      email: this.email, //  payload
      subscription: this.subscription, //    user's plan
      role: this.role, //     user's role
    });
    process.env.JWT_SECRET, //  Secret key to sign token
    {
      expiresIn: process.env.JWT_EXPIRE, //   Sign for {}  days
    }
  },
};*/

/*

userSchema.methods.getSignedJwtToken = async function () {
    return await jwt.sign({
      id: this._id, //  _id is a property of mongoose model and it contains the unique identifier for each document in the id: this._id }
      email: this.email, //  payload
      subscription: this.subscription, //    user's plan
      role: this.role, //     user's role
    });
    process.env.JWT_SECRET, //  Secret key to sign token
    {
      expiresIn: process.env.JWT_EXPIRE, //   Sign for {}  days
    }
  },
*/

userSchema.methods.getSignedJwtToken = async function () {
  return jwt.sign(
    {
      id: this._id, //  _id is a property of mongoose model and it contains the unique identifier for each document in the id: this._id }
      email: this.email, //  payload
      subscription: this.subscription, //    user's plan
      role: this.role, //     user's role
    },
    "thisissecretekey", //  Secret key to sign token
    {
      expiresIn: "1d", //   Sign for {}  days
    }
  );
};


// Define the generateResetToken method
userSchema.methods={
  generateResetToken: async function(){
    return "hi"
  }
}








/* generateResetToken   */
/*userSchema.methods = {
  generateResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    (this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"));
      (this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000);
    return resetToken;
  },
};

userSchema.methods = {
  generateResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};
*/

userSchema.method.isPasswordCorrect = async function (password) {
  //   password is from the input field of login form  is same as in password is save in db
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema); //creating a model of the schema which is to be used in our application
 
