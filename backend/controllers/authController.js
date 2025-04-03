const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateRegisterInput, validateLoginInput } = require('../utils/validation');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Handle user registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    const { errors, isValid } = validateRegisterInput(username, email, password);
    if (!isValid) {
      // If there's a profile image uploaded, remove it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors });
    }
    
    // Check if user already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      // Remove uploaded file if any
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      // Remove uploaded file if any
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }
    
    // Process profile image
    let profileImage = null;
    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }
    
    // Create new user
    const userId = await User.create({
      username,
      email,
      password,
      profileImage
    });
    
    if(userId){
      console.log("userId :", userId);
      console.log("User :", req.body);
    }
    // Generate JWT token
    const payload = {
      user: {
        id: userId
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: 'User registered successfully',
          token
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    const { errors, isValid } = validateLoginInput(email, password);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login successful',
          token
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile image
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      // Remove uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove old profile image if exists
    if (user.profile_image) {
      const oldImagePath = path.join(__dirname, '..', user.profile_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Update with new image
    const profileImage = `/uploads/${req.file.filename}`;
    await User.updateProfileImage(req.user.id, profileImage);
    
    res.json({
      message: 'Profile image updated successfully',
      profileImage
    });
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};