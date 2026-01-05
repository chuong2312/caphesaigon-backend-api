const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// --- IMPORT CÁC MIDDLEWARE ---
// protect: Yêu cầu đăng nhập (kiểm tra Token)
// admin: Yêu cầu quyền admin
const { protect, admin } = require('../middleware/authMiddleware');

const logRequest = require('../middleware/logMiddleware'); // Ghi log
const validateCourseData = require('../middleware/validationMiddleware'); // Kiểm tra dữ liệu đầu vào
const upload = require('../middleware/uploadMiddleware'); // Xử lý file ảnh

// ============================================
// ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN (ROUTES) API
// ============================================

// --- 1. LẤY DANH SÁCH MÓN ĂN (GET /) ---
// Quyền: Public (Ai cũng xem được)
router.get('/', courseController.getAllCourses);

// --- 2. LẤY CHI TIẾT 1 MÓN (GET /:id) ---
// Quyền: Public
router.get('/:id', courseController.getCourseById);

// --- 3. THÊM MÓN ĂN MỚI (POST /) ---
// Quyền: Admin (Phải đăng nhập + là Admin)
// Luồng xử lý: Log -> Check Login & Admin -> Upload Ảnh -> Validate -> Controller tạo món
router.post(
    '/',
    logRequest,              // Ghi log
    protect, admin,          // Bảo vệ: Chỉ Admin mới được thêm
    upload.single('image'),  // Upload 1 file ảnh (theo key 'image')
    validateCourseData,      // Kiểm tra tên, giá...
    courseController.createCourse
);

// --- 4. CẬP NHẬT MÓN ĂN (PUT /:id) ---
// Quyền: Admin
router.put(
    '/:id', 
    protect, admin, 
    upload.single('image'),  // Cho phép update ảnh mới nếu muốn
    courseController.updateCourse
);

// --- 5. XÓA MÓN ĂN (DELETE /:id) ---
// Quyền: Admin
router.delete('/:id', protect, admin, courseController.deleteCourse);

module.exports = router;