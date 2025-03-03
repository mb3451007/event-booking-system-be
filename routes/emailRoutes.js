const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS   
    }
});

router.post('/send', (req, res) => {
    const { to, subject, html } = req.body;
    const mailOptions = {
        from: process.env.EMAIL_USER,  
        to,
        subject,
        // text,
        html
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).json({ error: 'Error occurred', details: err });
        }
        res.status(200).json({ message: 'Email sent', response: info.response });
    });
});

module.exports = router;
