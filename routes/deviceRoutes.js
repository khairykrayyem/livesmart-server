const express = require('express');
const router = express.Router();
const { getDevices, createDevice } = require('../controllers/deviceController');

router.get('/', getDevices);
router.post('/', createDevice);

module.exports = router;
