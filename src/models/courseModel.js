const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Vui lòng nhập tên Tên đồ ăn/uống'],
        minlength: [5, 'Tên đồ ăn/uống phải dài hơn 5 ký tự']
    },
    price: { 
        type: Number, 
        required: [true, 'Vui lòng nhập giá tiền'] 
    },
    description: {
        type: String,
        default: 'Chưa có mô tả'
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300?text=Mon+An',
        required: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Course', courseSchema);