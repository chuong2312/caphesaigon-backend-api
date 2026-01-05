const Course = require('../models/courseModel');

// --- 1. LẤY TẤT CẢ KHÓA HỌC/MÓN ĂN (GET /) ---
exports.getAllCourses = async (req, res) => {
    try {
        // Tìm toàn bộ dữ liệu trong Database
        const courses = await Course.find();
        
        // Trả về kết quả thành công
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        // Xử lý lỗi hệ thống
        console.error("Lỗi lấy danh sách món:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server: " + error.message });
    }
};

// --- 2. LẤY CHI TIẾT 1 MÓN ĂN THEO ID (GET /:id) ---
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn này' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        console.error("Lỗi lấy món theo ID:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

// --- 3. TẠO MÓN ĂN MỚI (POST /) ---
exports.createCourse = async (req, res) => {
    try {
        // Xử lý đường dẫn ảnh nếu có upload
        if (req.file) {
            req.body.image = '/uploads/' + req.file.filename;
        }

        // Tạo bản ghi mới
        const newCourse = await Course.create(req.body);

        res.status(201).json({
            success: true,
            message: "Thêm món thành công!",
            data: newCourse
        });
    } catch (error) {
        console.error("Lỗi tạo món:", error.message);
        res.status(400).json({ success: false, message: "Lỗi dữ liệu: " + error.message });
    }
};

// --- 4. CẬP NHẬT MÓN ĂN (PUT /:id) ---
exports.updateCourse = async (req, res) => {
    try {
        // Nếu có upload ảnh mới thì cập nhật lại path ảnh
        if (req.file) {
            req.body.image = '/uploads/' + req.file.filename;
        }

        // Tìm và cập nhật
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Trả về data mới sau khi update
            runValidators: true // Kiểm tra lại tính hợp lệ của dữ liệu
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy món để sửa' });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật thành công!",
            data: course
        });
    } catch (error) {
        console.error("Lỗi cập nhật:", error.message);
        res.status(400).json({ success: false, message: "Lỗi cập nhật: " + error.message });
    }
};

// --- 5. XÓA MÓN ĂN (DELETE /:id) ---
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy món để xóa' });
        }

        res.status(200).json({
            success: true,
            message: 'Đã xóa món ăn thành công'
        });
    } catch (error) {
        console.error("Lỗi xóa món:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};
