let selectedProductId = null;
let allProducts = [];
const apiUrl = 'https://localhost:7188/api/products';

document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();

    document.getElementById('btnAdd').addEventListener('click', () => {
        window.location.href = "frontend/Create.html";
    });

    document.getElementById('btnUpdate').addEventListener('click', () => {
        if (!selectedProductId) {
            alert("Vui lòng chọn sản phẩm trước khi cập nhật (bấm nút Edit).");
            return;
        }
        window.location.href = `frontend/Update.html?id=${selectedProductId}`;
    });

    document.getElementById('btnReset').addEventListener('click', resetForm);

    // Bộ lọc: nút lọc
    const btnFilter = document.getElementById('btnFilter');
    if (btnFilter) btnFilter.addEventListener('click', filterProducts);

    // Bộ lọc: ấn Enter cũng lọc
    document.querySelectorAll('#filterName, #filterDesc').forEach(input => {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') filterProducts();
        });
    });

    // Bộ lọc: thanh trượt cũng lọc ngay khi thay đổi
    document.getElementById('priceRangeMin')?.addEventListener('input', syncPriceDisplay);
    document.getElementById('priceRangeMax')?.addEventListener('input', syncPriceDisplay);

    document.getElementById('btnResetFilter')?.addEventListener('click', resetFilter);
});

function fetchProducts() {
    fetch(apiUrl)
        .then(handleResponse)
        .then(data => {
            allProducts = data;
            displayProducts(data);
        })
        .catch(error => console.error('Fetch error:', error.message));
}

function handleResponse(response) {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
}

function displayProducts(products) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    if (products.length === 0) {
        bookList.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">Không tìm thấy sản phẩm nào phù hợp.</td>
            </tr>
        `;
        return;
    }

    products.forEach(product => {
        bookList.innerHTML += createProductRow(product);
    });

    document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            window.location.href = `frontend/Delete.html?id=${id}`;
        })
    );

    document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            selectedProductId = btn.dataset.id;
            alert("✅ Đã chọn sản phẩm ID: " + selectedProductId + ". Bấm nút ✏️ Cập nhật để sửa.");
        })
    );

    document.querySelectorAll('.view-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            window.location.href = `frontend/View.html?id=${id}`;
        })
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

function resetForm() {
    document.getElementById('bookName').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    selectedProductId = null;
    resetFilter();
}

// Đồng bộ hiển thị giá trị thanh range
function syncPriceDisplay() {
    const min = document.getElementById('priceRangeMin');
    const max = document.getElementById('priceRangeMax');
    document.getElementById('minPriceVal').innerText = min.value;
    document.getElementById('maxPriceVal').innerText = max.value;
    filterProducts();
}

// Lọc sản phẩm
function filterProducts() {
    const name = document.getElementById('filterName').value.toLowerCase();
    const desc = document.getElementById('filterDesc').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('priceRangeMin').value);
    const maxPrice = parseFloat(document.getElementById('priceRangeMax').value);

    const filtered = allProducts.filter(p => {
        const matchName = !name || p.name.toLowerCase().includes(name);
        const matchDesc = !desc || p.description.toLowerCase().includes(desc);
        const matchMin = isNaN(minPrice) || p.price >= minPrice;
        const matchMax = isNaN(maxPrice) || p.price <= maxPrice;
        return matchName && matchDesc && matchMin && matchMax;
    });

    displayProducts(filtered);
}

// Reset bộ lọc
function resetFilter() {
    document.getElementById('filterName').value = '';
    document.getElementById('filterDesc').value = '';
    document.getElementById('priceRangeMin').value = 0;
    document.getElementById('priceRangeMax').value = 1000000;
    syncPriceDisplay();
    displayProducts(allProducts);
}
