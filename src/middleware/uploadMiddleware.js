const multer = require('multer');
const path = require('path');

// Cấu hình storage lưu vào public/uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        // Đặt tên file = timestamp + đuôi file gốc (vd: 17099999.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter chỉ nhận file ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter });
