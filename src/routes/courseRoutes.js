const express = require('express');
const router = express.Router(); // Tạo đối tượng router của Express
const courseController = require('../controllers/courseController'); // Import controller xử lý logic

// --- IMPORT MIDDLEWARE ---
const { protect, admin } = require('../middleware/authMiddleware'); // Middleware xác thực (Token) và phân quyền (Admin)
const logRequest = require('../middleware/logMiddleware'); // Middleware ghi log request
const validateCourseData = require('../middleware/validationMiddleware'); // Middleware validate dữ liệu đầu vào
const upload = require('../middleware/uploadMiddleware'); // Middleware xử lý upload file (Multer)

// --- ĐỊNH NGHĨA CÁC ROUTE (ĐƯỜNG DẪN) ---

// 1. Lấy danh sách tất cả món ăn (Public - Ai cũng xem được)
// GET /api/courses
router.get('/', courseController.getAllCourses);

// 2. Lấy chi tiết 1 món ăn theo ID (Public)
// GET /api/courses/:id
router.get('/:id', courseController.getCourseById);

// 3. Thêm món ăn mới (Protected - Cần đăng nhập)
// POST /api/courses
// Quy trình xử lý (Middleware Chain):
// logRequest -> protect -> upload.single -> validateCourseData -> controller
router.post(
    '/',
    logRequest,           // 1. Ghi log request
    protect,              // 2. Kiểm tra đăng nhập (JWT)
    upload.single('image'), // 3. Xử lý upload ảnh (field name: 'image')
    validateCourseData,   // 4. Validate dữ liệu body (tên, giá...)
    courseController.createCourse // 5. Logic lưu vào DB
);

// 4. Cập nhật món ăn (Protected + Admin - Chỉ Admin mới được sửa)
// PUT /api/courses/:id
router.put(
    '/:id', 
    protect, 
    admin,                // Cần quyền Admin
    upload.single('image'), // Cho phép update ảnh mới
    courseController.updateCourse // Logic update DB
);

// 5. Xóa món ăn (Protected + Admin)
// DELETE /api/courses/:id
router.delete('/:id', protect, admin, courseController.deleteCourse);

module.exports = router;