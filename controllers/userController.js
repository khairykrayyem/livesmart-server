const User = require('../models/userModel');

//// login smarthome app
const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await user.matchPassword(password)) {
    res.json({ _id: user._id, username: user.username, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

/// הוספת משתמש – רק אם היוזר הנוכחי הוא admin
const register = async (req, res) => {
  const { username, password, role, currentUserRole } = req.body;

  if (currentUserRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ username, password, role });
  await user.save();
  res.status(201).json({ message: 'User created successfully' });
};

// מחיקת משתמש – רק admin
const deleteUser = async (req, res) => {
  const { currentUserRole } = req.body;
  if (currentUserRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { login, register, deleteUser };
