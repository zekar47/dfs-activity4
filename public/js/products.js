const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/login.html';
}

// Helper for headers
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };
}

// Load products on page load
window.onload = loadProducts;

async function loadProducts() {
  const response = await fetch('/api/products', {
    headers: authHeaders()
  });

  if (!response.ok) {
    alert('Unauthorized');
    return;
  }

  const products = await response.json();

  const list = document.getElementById('productList');
  list.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${product.name} - $${product.price}
      <button onclick="editProduct('${product._id}')">Edit</button>
      <button onclick="deleteProduct('${product._id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

// CREATE
async function createProduct() {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;

  await fetch('/api/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, description, price })
  });

  loadProducts();
}

// DELETE
async function deleteProduct(id) {
  await fetch('/api/products/' + id, {
    method: 'DELETE',
    headers: authHeaders()
  });

  loadProducts();
}

// UPDATE (simple prompt version)
async function editProduct(id) {
  const newName = prompt("New name:");
  const newPrice = prompt("New price:");

  await fetch('/api/products/' + id, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({
      name: newName,
      price: newPrice
    })
  });

  loadProducts();
}

// LOGOUT
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
}
