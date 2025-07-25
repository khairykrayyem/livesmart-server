const express = require('express');
const router = express.Router();
const { getDevices, createDevice,getDevicesByRoom } = require('../controllers/deviceController');

router.get('/', getDevices);
router.post('/', createDevice);
router.get('/room/:roomId', getDevicesByRoom); 


module.exports = router;

