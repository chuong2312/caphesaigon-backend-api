const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');

const protect = async (req, res, next) => {
    let token;

    // 1. Lấy token từ Header hoặc Cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
        } catch (error) {
            console.error("Lỗi header:", error);
        }
    } else if (req.cookies && req.cookies.jwt_token) {
        token = req.cookies.jwt_token;
    }

    // 2. Không có token -> Chặn
    if (!token) {
        return res.status(401).json({ success: false, message: 'Chưa đăng nhập!' });
    }

    try {
        // 3. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await Customer.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại.' });
        }

        next(); // Cho phép đi tiếp

    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Token không hợp lệ!' });
    }
};
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Nếu là admin thì cho đi tiếp
    } else {
        res.status(403).json({
            success: false,
            message: 'Chỉ Admin mới có quyền thực hiện thao tác này!'
        });
    }
};

module.exports = { protect, admin };