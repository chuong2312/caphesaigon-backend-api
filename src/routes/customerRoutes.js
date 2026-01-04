const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', customerController.register);
router.post('/login', customerController.login);
router.get('/', protect, admin, customerController.getAllCustomers); // Xem danh sách user

module.exports = router;