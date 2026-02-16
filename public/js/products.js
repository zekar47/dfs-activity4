const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login.html';
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

window.onload = loadProducts;

async function loadProducts() {
    const response = await fetch('/api/products', { headers: authHeaders() });

    if (!response.ok) {
        if(response.status === 401) logout();
        return;
    }

    const products = await response.json();
    const list = document.getElementById('productList');
    list.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.innerHTML = `
            <div class="product-info">
                <strong class="editable" onclick="makeEditable(this, '${product._id}', 'name')">${product.name}</strong>
                <p class="editable desc" onclick="makeEditable(this, '${product._id}', 'description')">${product.description || 'Sin descripción'}</p>
                <span class="price-tag">$<span class="editable" onclick="makeEditable(this, '${product._id}', 'price')">${product.price}</span></span>
            </div>
            <div class="actions">
                <button class="btn-danger" onclick="deleteProduct('${product._id}')">Eliminar</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Función para convertir texto en input automáticamente
function makeEditable(element, id, field) {
    const originalValue = element.innerText;
    const input = document.createElement('input');
    input.value = originalValue;
    input.className = 'inline-edit';
    
    // Si es precio, que sea tipo número
    if (field === 'price') input.type = 'number';

    element.replaceWith(input);
    input.focus();

    // Guardar al perder el foco o presionar Enter
    input.onblur = () => saveInlineEdit(input, element, id, field, originalValue);
    input.onkeydown = (e) => {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') {
            input.value = originalValue; // Cancelar
            input.blur();
        }
    };
}

async function saveInlineEdit(input, originalElement, id, field, originalValue) {
    const newValue = input.value;

    if (newValue === originalValue) {
        input.replaceWith(originalElement);
        return;
    }

    const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ [field]: newValue })
    });

    if (response.ok) {
        originalElement.innerText = newValue;
        input.replaceWith(originalElement);
    } else {
        alert('Error al actualizar');
        loadProducts();
    }
}

async function createProduct() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;

    if (!name || !price) return alert("Nombre y precio son obligatorios");

    const res = await fetch('/api/products', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, description, price })
    });

    if (res.ok) {
        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        document.getElementById('price').value = '';
        loadProducts();
    }
}

async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    await fetch('/api/products/' + id, {
        method: 'DELETE',
        headers: authHeaders()
    });
    loadProducts();
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}
