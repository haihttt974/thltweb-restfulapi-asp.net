let selectedProductId = null;
const apiUrl = 'https://localhost:7188/api/products'; // Đảm bảo đúng route

document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
    document.getElementById('btnAdd').addEventListener('click', addProduct);
    document.getElementById('btnUpdate').addEventListener('click', updateProduct);
    document.getElementById('btnReset').addEventListener('click', resetForm);
});

function fetchProducts() {
    fetch(apiUrl)
        .then(handleResponse)
        .then(data => displayProducts(data))
        .catch(error => console.error('Fetch error:', error.message));
}

function handleResponse(response) {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
}

function displayProducts(products) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    products.forEach(product => {
        bookList.innerHTML += createProductRow(product);
    });

    document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id))
    );
    document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', () => fillFormForEdit(btn.dataset.id))
    );
    document.querySelectorAll('.view-btn').forEach(btn =>
        btn.addEventListener('click', () => viewProduct(btn.dataset.id))
    );
}

function createProductRow(product) {
    return `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}">Delete</button>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${product.id}">Edit</button>
                <button class="btn btn-primary btn-sm view-btn" data-id="${product.id}">View</button>
            </td>
        </tr>
    `;
}

function addProduct() {
    const productData = getFormData();
    if (!productData) return;

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    })
        .then(handleResponse)
        .then(data => {
            alert("Đã thêm thành công!");
            resetForm();
            fetchProducts();
        })
        .catch(error => console.error('Error:', error));
}

function updateProduct() {
    if (!selectedProductId) {
        alert("Vui lòng chọn sản phẩm để cập nhật.");
        return;
    }

    const productData = getFormData();
    if (!productData) return;

    productData.id = selectedProductId;

    fetch(`${apiUrl}/${selectedProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    })
        .then(res => {
            if (res.status === 204) {
                alert("Cập nhật thành công!");
                resetForm();
                fetchProducts();
            } else {
                alert("Lỗi cập nhật!");
            }
        })
        .catch(error => console.error('Error:', error));
}

function deleteProduct(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(res => {
            if (res.status === 204) {
                alert("Đã xóa!");
                fetchProducts();
            } else {
                alert("Không thể xóa!");
            }
        })
        .catch(error => console.error('Error:', error));
}

function fillFormForEdit(id) {
    fetch(`${apiUrl}/${id}`)
        .then(handleResponse)
        .then(product => {
            document.getElementById('bookName').value = product.name;
            document.getElementById('price').value = product.price;
            document.getElementById('description').value = product.description;
            selectedProductId = product.id;
        })
        .catch(error => console.error('Error:', error));
}

function viewProduct(id) {
    fetch(`${apiUrl}/${id}`)
        .then(handleResponse)
        .then(product => {
            alert(
                `📖 Thông tin chi tiết:\n\n` +
                `ID: ${product.id}\n` +
                `Tên: ${product.name}\n` +
                `Giá: ${product.price}\n` +
                `Mô tả: ${product.description}`
            );
        })
        .catch(error => console.error('Error:', error));
}

function getFormData() {
    const name = document.getElementById('bookName').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value.trim();

    if (!name || isNaN(price)) {
        alert("Vui lòng nhập tên sách và giá hợp lệ.");
        return null;
    }

    return { name, price, description };
}

function resetForm() {
    document.getElementById('bookName').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    selectedProductId = null;
}
