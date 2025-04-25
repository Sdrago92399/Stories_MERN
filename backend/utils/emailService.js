const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SENDER_GMAIL_MAIL,
    pass: process.env.SENDER_GMAIL_PASS,   
  },
});

module.exports = transporter;
