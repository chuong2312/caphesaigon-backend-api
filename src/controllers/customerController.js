const Customer = require('../models/customerModel'); // Import Model Khách hàng
const jwt = require('jsonwebtoken'); // Import thư viện tạo Token xác thực

// Hàm tạo Token (Giấy phép truy cập tạm thời)
const generateToken = (id) => {
    // Tạo token chứa ID của user, ký bằng mã bí mật (JWT_SECRET), hết hạn sau 30 ngày
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// 1. Chức năng ĐĂNG KÝ
exports.register = async (req, res) => {
    try {
        // Lấy thông tin từ client gửi lên (Body)
        const { name, email, phone, password } = req.body;

        // Kiểm tra xem email đã tồn tại trong hệ thống chưa
        const customerExists = await Customer.findOne({ email });
        if (customerExists) {
            return res.status(400).json({ success: false, message: 'Email này đã được dùng!' });
        }

        // Tạo khách hàng mới vào Database (Mật khẩu sẽ tự động mã hóa nhờ Model)
        const newCustomer = await Customer.create({ name, email, phone, password });

        if (newCustomer) {
            // Nếu tạo thành công, cấp luôn Token cho user
            const token = generateToken(newCustomer._id);

            // Lưu token vào Cookie của trình duyệt (để tự động gửi kèm các request sau)
            res.cookie('jwt_token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

            // Trả về kết quả thành công cho Client
            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công!',
                token: token,
                data: { id: newCustomer._id, name: newCustomer.name, email: newCustomer.email, role: newCustomer.role, phone: newCustomer.phone }
            });
        }
    } catch (error) {
        // Bắt lỗi nếu server gặp sự cố
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// 2. Chức năng ĐĂNG NHẬP
exports.login = async (req, res) => {
    const { email, password } = req.body; // Lấy email va password từ client

    try {
        // Tìm user trong Database theo email
        const customer = await Customer.findOne({ email });

        // Kiểm tra xem user có tồn tại VÀ mật khẩu có đúng không (dùng hàm matchPassword viết trong Model)
        if (customer && (await customer.matchPassword(password))) {
            const token = generateToken(customer._id); // Tạo Token mới

            // Lưu token vào Cookie
            res.cookie('jwt_token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

            // Trả về thành công
            res.json({
                success: true,
                message: 'Đăng nhập thành công!',
                token: token,
                data: { id: customer._id, name: customer.name, email: customer.email, role: customer.role, phone: customer.phone }
            });
        } else {
            // Nếu sai email hoặc mật khẩu
            res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
    }
};
// 3. Lấy danh sách tất cả khách hàng (Cho Admin check)
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ success: true, count: customers.length, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
