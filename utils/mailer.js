
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (email, username) => {

    const mailOptions = {
        from: `"Wanderlust" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to Wanderlust!",
        html: `
            <h2>Welcome to Wanderlust, ${username}!</h2>
            <p>Your account has been successfully created.</p>
            <p>Explore amazing destinations with us.</p>
            <h3>Happy Travelling! 🌍</h3>
            <p>Team Wanderlust</p>
        `
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
};

const sendLoginEmail = async (email, username) => {

    const mailOptions = {
        from: `"Wanderlust" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "New Login Detected - Wanderlust",

        html: `
            <h2>Hello ${username}!</h2>

            <p>Your Wanderlust account was
            successfully logged in.</p>

            <p><b>Login Activity:</b> Successful</p>

            <p>If this was you, no action is needed.</p>

            <p>If you don't recognize this activity,
            please secure your account.</p>

            <h3>Team Wanderlust 🌍</h3>
        `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Login notification sent:", info.messageId);

    return info;
};
module.exports = {
    sendWelcomeEmail,
    sendLoginEmail
};
