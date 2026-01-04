const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;

// Kết nối Database
const connectDB = require('./src/config/db');
connectDB();

const Customer = require('./src/models/customerModel');

// Gọi Routes
const courseRoutes = require('./src/routes/courseRoutes');
const customerRoutes = require('./src/routes/customerRoutes');

const logRequest = require('./src/middleware/logMiddleware');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Áp dụng Logger cho TOÀN BỘ hệ thống
app.use(logRequest);

app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng Routes API
app.use('/api/courses', courseRoutes);
app.use('/api/customers', customerRoutes);

// Thêm đoạn này vào để chỉ định rõ: Vào trang chủ là mở file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
                password: "12345678",
                phone: "0123456789",
                role: "admin"
            });
            console.log("✅ Đã khởi tạo ADMIN.");
        } else {
            // Nếu đã có thì cập nhật lại quyền Admin (đề phòng trường hợp bị tạo nhầm là User hoặc đổi tên)
            adminExist.role = "admin";
            adminExist.name = "Admin1";
            adminExist.password = "12345678"; // Reset pass nếu cần
            await adminExist.save();
            console.log("ℹ️ Đã cập nhật lại quyền Admin.");
        }
    } catch (error) {
        console.error("❌ Lỗi khi tạo Admin:", error.message);
    }
};

app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
    createDefaultAdmin();
});