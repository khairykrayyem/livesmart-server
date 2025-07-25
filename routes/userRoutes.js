const express = require('express');
const router = express.Router();
const { login, register, deleteUser } = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register); // admin only/הגדרתי ש רק ADMIIN יכול לעדכן 
router.delete('/:id', deleteUser);  // admin only/ רק ADMIN יכול למחוק משתמש בבית

module.exports = router;
