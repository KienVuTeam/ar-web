const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "email-smtp.ap-southeast-2.amazonaws.com",
  //   port: 587, //- Nếu dùng cổng 587 → secure: false + requireTLS: true
  // secure: false,
  port: 465,
  secure: true,
  requireTLS: true,
  logger: true,
  auth: {
    user: process.env.AWS_MAIL_USER,
    pass: process.env.AWS_MAIL_PASSWORD,
  },
});

module.exports = transporter;
