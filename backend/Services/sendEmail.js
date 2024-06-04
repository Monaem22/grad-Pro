const nodemailer = require("nodemailer");

async function sendEmail(options) {
    if (!options || !options.email || !options.subject || !options.text) {
        throw new Error("Missing required email options");
    }
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            ciphers: "SSLv3",
        },
    });
    const mailOptions = {
        from: `" GP-support " <manemosama@gmail.com>`,
        to: options.email,
        // to: "manemosama@gmail.com",
        subject: options.subject,
        text: options.text,
        // html: "<b>Hello world? </b>",
    };
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully!", info.messageId);
    } catch (error) {
        console.error("Error when sending email:", error);
        // throw Error(`Error sending email:${error} `)
    }
}

module.exports = sendEmail;


