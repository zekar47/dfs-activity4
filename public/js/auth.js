async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/index.html';
    } else {
        alert(data.message || 'Error en login');
    }
}

async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    // Nota: El backend actual no guarda el UserType en el modelo User, 
    // pero lo enviamos por si decides extender el modelo.
    const userType = document.getElementById('userTypeSelect').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    if (response.ok) {
        alert('Registro exitoso. Ahora inicia sesión.');
        window.location.href = '/login.html';
    } else {
        const error = await response.json();
        alert(error.message || 'Error en registro');
    }
}
