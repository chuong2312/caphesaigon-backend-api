const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Course = require('./models/courseModel');

const importData = async () => {
  try {
    // 1. Kết nối MongoDB
    await connectDB();

    // 2. Xóa sạch dữ liệu cũ
    await Course.deleteMany();
    console.log('Đã xóa dữ liệu cũ (Course)...');

    // 3. Danh sách món ăn mẫu
    const sampleData = [
      {
        name: "Cà Phê Đen Đá",
        price: 25000,
        description: "Hương vị truyền thống, đậm đà.",
        image: "images/menu-1.jpg" 
      },
      {
        name: "Cà Phê Sữa Đá",
        price: 30000,
        description: "Ngọt ngào hương vị phố thị.",
        image: "images/menu-2.jpg"
      },
      {
        name: "Bạc Xỉu",
        price: 35000,
        description: "Vị sữa béo ngậy.",
        image: "images/menu-3.jpg"
      },
      {
        name: "Trà Đào Cam Sả",
        price: 40000,
        description: "Thanh mát giải nhiệt.",
        image: "images/menu-4.jpg"
      }
    ];

    // 4. Thêm dữ liệu mới
    await Course.insertMany(sampleData);
    console.log('✅ Data Imported!');

    // 5. Thoát process
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
