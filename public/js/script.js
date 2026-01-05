document.addEventListener('DOMContentLoaded', () => {
    // Gọi hàm loadMenuPublic khi trang web tải xong
    loadMenuPublic();
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
