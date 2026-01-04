const logRequest = (req, res, next) => {
    const method = req.method; // GET, POST, DELETE...
    const url = req.originalUrl; // /api/courses
    const time = new Date().toISOString();
    console.log(`[${time}] ${method} ${url}`);
    
    // QUAN TRỌNG: Phải gọi next() để chuyển quả bóng sang middleware tiếp theo
    next();
};

module.exports = logRequest;
