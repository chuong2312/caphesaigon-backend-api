const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;

// --- 1. KẾT NỐI DATABASE ---
const connectDB = require('./src/config/db');
connectDB();

const Customer = require('./src/models/customerModel');

// --- 2. IMPORT ROUTES ---
const courseRoutes = require('./src/routes/courseRoutes');
const customerRoutes = require('./src/routes/customerRoutes');

const logRequest = require('./src/middleware/logMiddleware');

// --- 3. CẤU HÌNH MIDDLEWARE ---
app.use(express.json()); // Cho phép đọc JSON từ body request
// Cập nhật cấu hình CORS để cho phép Frontend trên Cloudflare và Local gọi API
app.use(cors({
    origin: [
        'https://caphesaigon.pages.dev', // Domain chính thức
        'http://localhost:5500',         // Localhost
        'http://127.0.0.1:5500',
        /^https:\/\/.*\.caphesaigon\.pages\.dev$/ // <--- DÒNG QUAN TRỌNG: Chấp nhận mọi link Preview
    ],
    credentials: true // Cho phép gửi Cookie
})); // Cho phép gọi API từ tên miền khác (Cross-Origin)
app.use(cookieParser()); // Cho phép đọc Cookie

// Áp dụng Logger cho TOÀN BỘ hệ thống để theo dõi request
app.use(logRequest);

// Cấu hình thư mục chứa file tĩnh (HTML, CSS, JS, Ảnh)
// Khi truy cập http://localhost:5000/ sẽ vào thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- 4. ĐỊNH NGHĨA ROUTES API ---
app.use('/api/courses', courseRoutes);
app.use('/api/customers', customerRoutes);


// --- 5. HÀM TẠO ADMIN MẶC ĐỊNH ---
const createDefaultAdmin = async () => {
    try {
        const adminEmail = "admin@mail.com";
        // Kiểm tra xem admin đã có chưa
        const adminExist = await Customer.findOne({ email: adminEmail });

        if (!adminExist) {
            // Nếu chưa có thì tạo mới
            await Customer.create({
                name: "Admin1",
                email: "admin@mail.com",
                password: "12345678", // Mật khẩu mặc định
                phone: "0123456789",
                role: "admin"
            });
            console.log("✅ Đã khởi tạo tài khoản ADMIN mặc định.");
        } else {
            // Nếu đã có thì KHÔNG làm gì cả để tránh reset mất mật khẩu của họ
            // Chỉ log ra để biết là Admin đã tồn tại
            console.log("ℹ️ Tài khoản ADMIN đã tồn tại (Không reset).");
        }
    } catch (error) {
        console.error("❌ Lỗi khi kiểm tra/tạo Admin:", error.message);
    }
};

// --- 6. KHỞI ĐỘNG SERVER ---
app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
    createDefaultAdmin(); // Kiểm tra tạo admin ngay khi server chạy
});