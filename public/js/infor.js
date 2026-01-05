document.addEventListener('DOMContentLoaded', () => {
    loadCoursesAdmin();

    // Xử lý sự kiện Submit Form
    document.getElementById('courseForm').addEventListener('submit', handleFormSubmit);
});

const API_URL = '/api/courses';

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
        if (id) {
            // ĐANG Ở CHẾ ĐỘ SỬA (PUT) - Cần Token Admin thực tế
            // Tạm thời giả định backend đang bypass hoặc đã có cookie
            res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                body: formData
                // headers: { 'Authorization': 'Bearer <TOKEN>' } // Cần thêm token nếu có auth
            });
        } else {
            // ĐANG Ở CHẾ ĐỘ THÊM (POST)
            res = await fetch(API_URL, {
                method: 'POST',
                body: formData
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

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
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
