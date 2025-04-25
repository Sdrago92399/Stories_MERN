const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require('dotenv');
const Gmail = require("../utils/emailService");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup: Creates a new user with hashed password
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send confirmation email
    const confirmationLink = `${process.env.BACKEND_URL}/api/auth/confirm-email?token=${token}`;
    await Gmail.sendMail({
      from: process.env.SENDER_GMAIL_MAIL,
      to: email,
      subject: "Email Confirmation",
      html: `<p>Hi ${username},</p>
             <p>Please confirm your email by clicking the link below:</p>
             <a href="${confirmationLink}">Confirm Email</a>
             <p>This link will expire in 1 hour.</p>`,
    });

    res.status(201).json({ message: "User registered. Please confirm your email"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("yee")
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailConfirmed) {
      return res.status(400).json({ message: "Email already confirmed." });
    }

    user.isEmailConfirmed = true;
    await user.save();

    res.status(200).json({ message: "Email confirmed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};


// Login: Authenticates user and returns a JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.isEmailConfirmed) return res.status(401).json({ error: "Confirm your email" });

    if (!user.isActive) return res.status(403).json({ error: "Account is inactive. Contact support for assistance." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    user.lastLoginTime = new Date();
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        email: user.email, 
        isAdmin: user.isAdmin, 
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin, 
        role: user.role
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginWithToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user?.id });

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        email: user.email, 
        isAdmin: user.isAdmin, 
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin, 
        role: user.role
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
