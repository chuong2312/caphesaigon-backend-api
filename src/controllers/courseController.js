const Course = require('../models/courseModel');

// --- 1. LẤY TẤT CẢ KHÓA HỌC (GET /) ---
exports.getAllCourses = async (req, res) => {
    try {
        // Tìm tất cả bản ghi trong Collection 'Courses'
        const courses = await Course.find(); 
        // Trả về response JSON: success=true, số lượng, và data
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        // Báo lỗi Server 500 nếu có exception
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 2. LẤY 1 KHÓA HỌC THEO ID (GET /:id) ---
exports.getCourseById = async (req, res) => {
    try {
        // Tìm theo ID được truyền trên URL (req.params.id)
        const course = await Course.findById(req.params.id);
        
        // Nếu không tìm thấy (null) -> Báo lỗi 404 Not Found
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đồ ăn/uống' });
        }
        
        // Tìm thấy -> Trả về data
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 3. TẠO KHÓA HỌC MỚI (POST /) ---
exports.createCourse = async (req, res) => {
    try {
        // Kiểm tra nếu có file ảnh được upload (từ middleware multer)
        if (req.file) {
            // Gán đường dẫn ảnh vào field 'image' trong body
            // Đường dẫn này sẽ được lưu vào DB
            req.body.image = '/uploads/' + req.file.filename;
        }

        // Tạo bản ghi mới trong DB với data từ req.body
        const newCourse = await Course.create(req.body); 
        
        // Trả về 201 Created và data vừa tạo
        res.status(201).json({ success: true, data: newCourse });
    } catch (error) {
        // Lỗi 400 Bad Request (thường do validate sai)
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- 4. CẬP NHẬT KHÓA HỌC (PUT /:id) ---
exports.updateCourse = async (req, res) => {
    try {
        // Kiểm tra nếu có upload ảnh mới -> Cập nhật đường dẫn ảnh
        if (req.file) {
            req.body.image = '/uploads/' + req.file.filename;
        }

        // Tìm theo ID và cập nhật nội dung
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // true: Trả về dữ liệu SAU khi sửa (mặc định là trước khi sửa)
            runValidators: true // true: Chạy lại validate (ví dụ check độ dài tên, bắt buộc nhập...)
        });

        // Nếu ID không tồn tại
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy để sửa' });
        }
        
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- 5. XÓA KHÓA HỌC (DELETE /:id) ---
exports.deleteCourse = async (req, res) => {
    try {
        // Tìm và xóa theo ID
        const course = await Course.findByIdAndDelete(req.params.id);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy để xóa' });
        }
        
        res.status(200).json({ success: true, message: 'Đã xóa thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
