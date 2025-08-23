const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({

  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  // logger: true,
  debug: true,
  tls: {
    rejectUnauthorized: true
  },
  secureConnection: false,
  auth: {
    user: process.env.SECRET_MAIL_USER,
    pass: process.env.SECRET_MAIL_PASSWORD
  },
});

module.exports = transporter;
