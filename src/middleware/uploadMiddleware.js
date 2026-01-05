const multer = require('multer');
const path = require('path');

// --- CẤU HÌNH LƯU TRỮ FILE (STORAGE) ---
// Sử dụng diskStorage để lưu file vào ổ đĩa của server
const storage = multer.diskStorage({
    // Cấu hình thư mục lưu trữ: public/uploads/
    destination: function (req, file, cb) {
        // cb(error, destination_path)
        cb(null, 'public/uploads/');
    },
    // Cấu hình tên file được lưu
    filename: function (req, file, cb) {
        // Đặt tên file = timestamp hiện tại + đuôi file gốc
        // Ví dụ: file gốc 'anh.jpg' -> '1709999999999.jpg'
        // Việc này giúp tránh trùng tên file
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// --- BỘ LỌC FILE (FILTER) ---
// Chỉ cho phép upload các file là hình ảnh
const fileFilter = (req, file, cb) => {
    // Kiểm tra mimetype của file (vd: image/jpeg, image/png)
    if (file.mimetype.startsWith('image/')) {
        // Nếu là ảnh -> Chấp nhận (true)
        cb(null, true);
    } else {
        // Nếu không phải ảnh -> Từ chối và báo lỗi
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

// Khởi tạo middleware upload với cấu hình storage và filter đã định nghĩa ở trên
module.exports = multer({ storage: storage, fileFilter: fileFilter });
