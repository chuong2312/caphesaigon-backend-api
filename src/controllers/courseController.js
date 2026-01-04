const Course = require('../models/courseModel');

// Lấy tất cả khóa học
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find(); // Lấy từ MongoDB
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy 1 khóa học theo ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Tạo khóa học mới
exports.createCourse = async (req, res) => {
    try {
        const newCourse = await Course.create(req.body); // Lưu thẳng vào MongoDB
        res.status(201).json({ success: true, data: newCourse });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Cập nhật khóa học
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Trả về dữ liệu mới sau khi sửa
            runValidators: true // Chạy lại validate (check độ dài tên, v.v.)
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy để sửa' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Xóa khóa học
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy để xóa' });
        }
        res.status(200).json({ success: true, message: 'Đã xóa thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
