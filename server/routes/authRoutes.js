import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/register.js'; // Adjust path to your User model file

const router = express.Router();

// -----------------------------------------------------------------------------
// CONTROLLER LOGIC: Handle User Registration
// -----------------------------------------------------------------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Check if all required fields are provided
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, phone',
      });
    }

    // 2. Check if user already exists with this email or phone
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Phone number';
      return res.status(400).json({
        success: false,
        message: `${field} is already registered. Please login instead.`,
      });
    }

    // 3. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save the new user
    // Note: Schema-level validation (Regex checks for email, password, phone) runs automatically on .create()
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    // 5. Generate JWT Token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'fallback_secret_key_change_in_prod',
      { expiresIn: '7d' }
    );

    // 6. Return response (excluding hashed password)
    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });

  } catch (error) {
    // Catch Mongoose Schema validation error messages (e.g., regex checks)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error',
      });
    }

    console.error('Register Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

// -----------------------------------------------------------------------------
// ROUTE DEFINITION
// -----------------------------------------------------------------------------
router.post('/register', registerUser);

export default router;