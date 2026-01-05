const mongoose = require('mongoose');

// --- SCHEMA ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU MÓN ĂN/KHÓA HỌC ---
const courseSchema = new mongoose.Schema({
    // Tên món ăn/đồ uống
    name: { 
        type: String, 
        required: [true, 'Vui lòng nhập tên Tên đồ ăn/uống'], // Bắt buộc nhập
        minlength: [5, 'Tên đồ ăn/uống phải dài hơn 5 ký tự'] // Độ dài tối thiểu
    },
    // Giá tiền
    price: { 
        type: Number, 
        required: [true, 'Vui lòng nhập giá tiền'] // Bắt buộc nhập
    },
    // Mô tả chi tiết
    description: {
        type: String,
        default: 'Chưa có mô tả' // Giá trị mặc định nếu không nhập
    },
    // Đường dẫn ảnh (URL hoặc path local)
    image: {
        type: String,
        default: 'https://via.placeholder.com/300?text=Mon+An', // Ảnh mặc định nếu không upload
        required: false // Không bắt buộc
    },
    // Ngày tạo (Tự động lấy thời gian hiện tại)
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Export Model 'Course' dựa trên schema trên để sử dụng ở Controller
module.exports = mongoose.model('Course', courseSchema);