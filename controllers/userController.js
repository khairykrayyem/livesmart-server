const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// התחברות
const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await user.matchPassword(password)) {
    const token = generateToken(user);
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// יצירת משתמש חדש – רק ע"י ADMIN
const register = async (req, res) => {
  const { username, password, role } = req.body;

  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ username, password, role });
  await user.save();
  res.status(201).json({ message: 'User created successfully' });
};

// שליפת כל המשתמשים – רק ל-ADMIN
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // אל תחזיר סיסמאות
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// מחיקת משתמש – רק ע"י ADMIN
const deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { login, register, getAllUsers , deleteUser };
