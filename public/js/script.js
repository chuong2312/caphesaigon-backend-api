document.addEventListener('DOMContentLoaded', () => {
    // 1. Định nghĩa lại API Base URL (nếu chưa có ở đầu file)
    if (typeof API_BASE_URL === 'undefined') {
        var API_BASE_URL = "https://caphesaigon-backend-api.onrender.com";
    }

    // Gọi hàm loadMenuPublic khi trang web tải xong
    if (typeof loadMenuPublic === 'function') {
        loadMenuPublic();
    }

    // 2. Xử lý Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                // [SỬA QUAN TRỌNG]: Dùng API_BASE_URL để gọi sang Render
                const res = await fetch(`${API_BASE_URL}/api/customers/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // Quan trọng để nhận Cookie
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                
                if (data.success) {
                    alert('Đăng nhập thành công! 👋');
                    
                    // [SỬA QUAN TRỌNG]: Phải lưu Token riêng để infor.js dùng
                    localStorage.setItem('token', data.token); 
                    localStorage.setItem('user', JSON.stringify(data.data));
                    
                    // Reload lại trang để cập nhật giao diện
                    window.location.reload();
                } else {
                    alert('Lỗi: ' + (data.message || 'Đăng nhập thất bại'));
                }
            } catch (error) {
                console.error('Lỗi login:', error);
                alert('Không thể kết nối đến server Backend!');
            }
        });
    }
});

// Hàm lấy dữ liệu món ăn từ Server và hiển thị
async function loadMenuPublic() {
    const menuGrid = document.getElementById('menuGrid');
    
    try {
        // Fetch API lấy data (GET /api/courses)
        const response = await fetch('/api/courses');
        const data = await response.json();

        // Kiểm tra kết quả trả về
        if (data.success) {
            // Xóa nội dung "Đang tải..." cũ
            menuGrid.innerHTML = '';

            // Duyệt qua từng món ăn và tạo HTML
            if (data.data.length === 0) {
                menuGrid.innerHTML = '<p>Chưa có món ăn nào trong thực đơn.</p>';
                return;
            }

            data.data.forEach(item => {
                // Xử lý đường dẫn ảnh: Nếu có thì dùng, ko thì dùng ảnh mặc định
                const imageUrl = item.image ? item.image : 'https://via.placeholder.com/300?text=No+Image';

                // Format giá tiền thành VND (ví dụ: 25.000 đ)
                const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);

                // Tạo thẻ Card HTML
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${item.name}">
                    <div class="card-content">
                        <h3>${item.name}</h3>
                        <p class="price">${priceFormatted}</p>
                        <p class="desc">${item.description || 'Không có mô tả'}</p>
                        <button class="btn add-to-cart" onclick="addToCart('${item._id}')">Thêm vào giỏ</button>
                    </div>
                `;

                // Thêm vào Grid
                menuGrid.appendChild(card);
            });
        } else {
            menuGrid.innerHTML = '<p>Lỗi không tải được thực đơn.</p>';
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
        menuGrid.innerHTML = '<p>Lỗi kết nối Server.</p>';
    }
}

// Hàm giả lập thêm vào giỏ hàng
function addToCart(id) {
    alert(`Đã thêm món có ID: ${id} vào giỏ hàng! (Chức năng này đang phát triển)`);
}
