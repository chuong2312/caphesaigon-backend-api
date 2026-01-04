const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Import các middleware
const { protect, admin } = require('../middleware/authMiddleware'); // Cửa kiểm tra Token + Admin
const logRequest = require('../middleware/logMiddleware'); // Cửa ghi Log
const validateCourseData = require('../middleware/validationMiddleware'); // Cửa kiểm tra dữ liệu

// --- CÁC ROUTE ---

// Ai cũng xem được danh sách khóa học
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// --- CHAINING MIDDLEWARE ---
// Thứ tự chạy: logRequest -> protect -> validateCourseData -> createCourse
router.post(
    '/',
    logRequest, // 1. Ghi log trước
    protect, // 2. Kiểm tra đăng nhập
    validateCourseData, // 3. Kiểm tra dữ liệu input (User gửi lên)
    courseController.createCourse // 4. Nếu qua hết 3 cửa trên mới được vào Controller xử lý
);

router.put('/:id', protect, admin, courseController.updateCourse);

router.delete('/:id', protect, admin, courseController.deleteCourse);

module.exports = router;