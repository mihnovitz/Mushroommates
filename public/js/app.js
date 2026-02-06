const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Elementy DOM
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');

// Sprawdź czy użytkownik jest zalogowany
function checkAuth() {
    if (token) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    }
}

// Modal logowania
loginBtn.addEventListener('click', () => {
    const modal = createModal(`
        <h2>Logowanie</h2>
        <form id="login-form">
            <input type="email" id="login-email" placeholder="Email" required>
            <input type="password" id="login-password" placeholder="Hasło" required>
            <button type="submit">Zaloguj</button>
        </form>
    `);

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                location.reload();
            } else {
                alert(data.error || 'Błąd logowania');
            }
        } catch (error) {
            alert('Błąd połączenia');
        }
    });
});

// Modal rejestracji
registerBtn.addEventListener('click', () => {
    const modal = createModal(`
        <h2>Rejestracja</h2>
        <form id="register-form">
            <input type="text" id="register-username" placeholder="Nazwa użytkownika" required>
            <input type="email" id="register-email" placeholder="Email" required>
            <input type="password" id="register-password" placeholder="Hasło" required>
            <button type="submit">Zarejestruj</button>
        </form>
    `);

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Rejestracja udana! Możesz się zalogować.');
                modal.remove();
            } else {
                alert(data.error || 'Błąd rejestracji');
            }
        } catch (error) {
            alert('Błąd połączenia');
        }
    });
});

// Wyloguj
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    location.reload();
});

// Funkcja pomocnicza do tworzenia modali
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `<div class="modal-content">${content}</div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    return modal;
}

checkAuth();