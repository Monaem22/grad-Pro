const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  // create transporter
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: "outlook",
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });
  // setup email data with unicode symbols

  const mailOpts = {
    from: "graduation_Project App <manemosama@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.text,
  };
  console.log(mailOpts);
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
