const express = require("express");
const User = require("./model/User");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin:['https://frameboxdadar.com','https://frameboxdadar.in','http://localhost:3000'],
  methods: ['GET', 'POST'], 
};

app.use(cors(corsOptions));
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI).then((res) => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const sendEmailMailer = async ({ name, email, phone, message, course }) => {
  try {
    const transporter = await nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "sharangventures@gmail.com",
      subject: "FrameBox Lead",
      html: `FullName : ${name}, Number : ${phone}, Course : ${course}, Email : ${email}, Message : ${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail has been sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

app.post('/submit-form', async (req, res) => {
  const { name, email, phone, message, course } = req.body;
  try {
    const newUser = new User({
      name,
      email,
      phone,
      message,
      course
    });

    await newUser.save();
    await sendEmailMailer({ name, email, phone, message, course });
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log("Server started on port", port);
});
