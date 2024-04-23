import nodemailer from "nodemailer";

// async .. wait is not allowed in global scope , must use a wrapper
const sendEmail = async function (email, subject, message) {
  // create usable transport object using the default SMTP  transport and a Gmail account
  let transporter = nodemailer.createTransport({
    host: "",
    port: "",
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
  });

  await transporter.sendMail({
    from: '"Fred Foo" <foo@example.com>', // sender address  apna email id set kro
    to: email, //user email   kiso bhejna hai
    subject: subject, //subject line
    html: message, // html body
  });
};


export default sendEmail;
