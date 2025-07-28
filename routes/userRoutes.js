const express = require('express');
const router = express.Router();

const { login, register, getAllUsers , deleteUser } = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// התחברות - פתוח לכולם
router.post('/login', login);

router.get('/', verifyToken, requireAdmin, getAllUsers); 


// יצירת משתמש - רק ע"י ADMIN
router.post('/register', verifyToken, requireAdmin ,register);

// מחיקת משתמש - רק ע"י ADMIN
router.delete('/:id', verifyToken, requireAdmin, deleteUser);

module.exports = router;
