const API_BASE_URL = "https://caphesaigon-backend-api.onrender.com";
const API_URL = `${API_BASE_URL}/api/courses`;

document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    loadCoursesAdmin();

    // Xử lý sự kiện Submit Form
    document.getElementById('courseForm').addEventListener('submit', handleFormSubmit);
});

// 0. Kiểm tra đăng nhập
function checkLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập trang này.');
        window.location.href = 'index.html'; // Chuyển về trang chủ để đăng nhập
    }
}

// 1. Tải danh sách món ăn
async function loadCoursesAdmin() {
    const tableBody = document.getElementById('courseTableBody');
    tableBody.innerHTML = '<tr><td colspan="4">Đang tải...</td></tr>';

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.success) {
            tableBody.innerHTML = '';
            data.data.forEach(item => {
                const tr = document.createElement('tr');
                const price = new Intl.NumberFormat('vi-VN').format(item.price);
                
                tr.innerHTML = `
                    <td>
                        <strong>${item.name}</strong><br>
                        <small>${item.image ? '(Có ảnh)' : '(Chưa có ảnh)'}</small>
                    </td>
                    <td>${price} đ</td>
                    <td>${item.description || ''}</td>
                    <td>
                        <button class="btn btn-edit" onclick="startEdit('${item._id}')">Sửa</button>
                        <button class="btn btn-delete" onclick="deleteCourse('${item._id}')">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error("Lỗi tải data:", error);
    }
}

// 2. Xử lý Thêm hoặc Sửa
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('courseId').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('imageFile').files[0];
    const token = localStorage.getItem('token');

    // Sử dụng FormData để gửi cả file ảnh
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        let res;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token lên
            },
            credentials: 'include'
        };

        if (id) {
            // PUT
            res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                body: formData,
                ...options
            });
        } else {
            // POST
            res = await fetch(API_URL, {
                method: 'POST',
                body: formData,
                ...options
            });
        }

        const result = await res.json();

        if (result.success) {
            alert(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            resetForm();
            loadCoursesAdmin(); // Load lại bảng
        } else {
            alert('Lỗi: ' + result.message);
        }

    } catch (error) {
        console.error("Lỗi submit:", error);
        alert('Có lỗi xảy ra khi gửi dữ liệu.');
    }
}

// 3. Chuẩn bị dữ liệu để Sửa
async function startEdit(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();

        if (data.success) {
            const item = data.data;
            // Fill data vào form
            document.getElementById('courseId').value = item._id;
            document.getElementById('name').value = item.name;
            document.getElementById('price').value = item.price;
            document.getElementById('description').value = item.description || '';
            
            document.getElementById('formTitle').innerText = `Sửa Món: ${item.name}`;
            document.getElementById('btnSubmit').innerText = 'Cập Nhật';
            
            // Scroll lên form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error(error);
    }
}

// 4. Xóa món
async function deleteCourse(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa món này không?')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        const result = await res.json();

        if (result.success) {
            alert('Đã xóa thành công!');
            loadCoursesAdmin();
        } else {
            alert('Lỗi xóa: ' + result.message);
        }
    } catch (error) {
        alert('Lỗi kết nối Server khi xóa.');
    }
}

// 5. Reset Form
function resetForm() {
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';
    document.getElementById('formTitle').innerText = 'Thêm Món Mới';
    document.getElementById('btnSubmit').innerText = 'Lưu Món';
}
