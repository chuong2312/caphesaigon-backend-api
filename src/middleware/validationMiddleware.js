const validateCourseData = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || name.length < 5) {
        return res.status(400).json({ message: "Tên đồ ăn/uống phải dài hơn 5 ký tự" });
    }
    if (!price || isNaN(price) || Number(price) < 0) {
        return res.status(400).json({ message: "Giá tiền không hợp lệ" });
    }
    next();
};

module.exports = validateCourseData;