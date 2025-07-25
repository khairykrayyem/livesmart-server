const express = require('express');
const router = express.Router();
const { login, register, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', protect, adminOnly, register); // admin only/הגדרתי ש רק ADMIIN יכול לעדכן 
router.delete('/:id', protect, adminOnly, deleteUser);  // admin only/ רק ADMIN יכול למחוק משתמש בבית

module.exports = router;

