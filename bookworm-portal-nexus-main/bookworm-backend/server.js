// Backend server code (e.g., in a file named server.js)
// To run this, you need to install Express, Nodemailer, and CORS.
// In your backend directory, run:
// npm install express nodemailer cors

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3001; // Choose a port different from your React app

// --- Configuration ---
// Enable JSON body parsing and CORS (Cross-Origin Resource Sharing)
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080' // Allow requests from your React app
}));

// --- Nodemailer Setup ---
// This is where you configure your email sending service.
// For this example, we'll use Gmail. You MUST use an "App Password" for Gmail
// if you have 2-Factor Authentication enabled.
// See: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service like 'hotmail', 'yahoo'
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-gmail-app-password'   // Your Gmail App Password
    }
});

// --- In-Memory Storage (for demonstration) ---
// In a real application, you would use a database (like MongoDB, PostgreSQL, etc.)
// to store users and password reset tokens.
const passwordResetTokens = new Map(); // Stores token -> { email, expiresAt }


// --- API Endpoints ---

/**
 * @route   POST /api/forgot-password
 * @desc    Receives an email, generates a reset token, and sends a reset email.
 */
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // --- Database Logic (Mocked) ---
    // In a real app, you would check if the user exists in your database here.
    console.log(`Received password reset request for: ${email}`);
    
    // Generate a unique token (simple version for demo)
    const token = Math.random().toString(36).substring(2, 15);
    const expiresAt = Date.now() + 3600000; // Token expires in 1 hour

    // Store the token (in-memory for this demo)
    passwordResetTokens.set(token, { email, expiresAt });

    // --- Email Sending ---
    const resetLink = `http://localhost:8080/reset-password?token=${token}`;

    const mailOptions = {
        from: '"Your Library App" <your-email@gmail.com>',
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>Hello,</p>
            <p>You requested a password reset for your library account.</p>
            <p>Please click the link below to set a new password. This link will expire in one hour.</p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    });
});


/**
 * @route   POST /api/reset-password
 * @desc    Resets the user's password using a valid token.
 */
app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    const tokenData = passwordResetTokens.get(token);

    if (!tokenData || Date.now() > tokenData.expiresAt) {
        return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }

    // --- Database Logic (Mocked) ---
    // In a real app, you would find the user by `tokenData.email`,
    // hash the `newPassword`, and update the user's record in your database.
    console.log(`Password for ${tokenData.email} has been reset to: ${newPassword}`);
    
    // Invalidate the token after use
    passwordResetTokens.delete(token);

    res.status(200).json({ message: 'Password has been reset successfully.' });
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
