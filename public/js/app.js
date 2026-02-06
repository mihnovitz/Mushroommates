const API_URL = 'http://localhost:3000/api';

// API Helper - centralna funkcja do requestów
async function apiRequest(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    const token = localStorage.getItem('token');
    if (token && !options.skipAuth) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Wystąpił błąd');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth Manager
const AuthManager = {
    get isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    login(token) {
        localStorage.setItem('token', token);
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    },

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (!loginBtn || !registerBtn || !logoutBtn) return;

        if (this.isAuthenticated) {
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
        }
    }
};

// Modal Manager
const ModalManager = {
    create(content) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `<div class="modal-content">${content}</div>`;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close(modal);
        });

        return modal;
    },

    close(modal) {
        if (modal && modal.parentNode) {
            modal.remove();
        }
    }
};

// Form Handlers
const FormHandlers = {
    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            alert('Wypełnij wszystkie pola');
            return;
        }

        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (data.success && data.data?.token) {
                AuthManager.login(data.data.token);
                window.location.reload();
            }
        } catch (error) {
            alert(error.message || 'Błąd logowania');
        }
    },

    async handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('register-username')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;

        if (!name || !email || !password) {
            alert('Wypełnij wszystkie pola');
            return;
        }

        if (password.length < 6) {
            alert('Hasło musi mieć minimum 6 znaków');
            return;
        }

        try {
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            if (data.success) {
                alert('Rejestracja udana! Możesz się teraz zalogować.');
                const modal = document.querySelector('.modal');
                ModalManager.close(modal);
            }
        } catch (error) {
            alert(error.message || 'Błąd rejestracji');
        }
    }
};

// Event Listeners Setup
function initializeApp() {
    // Login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            ModalManager.create(`
                <h2>Logowanie</h2>
                <form id="login-form">
                    <input type="email" id="login-email" placeholder="Email" required>
                    <input type="password" id="login-password" placeholder="Hasło" required minlength="6">
                    <button type="submit">Zaloguj</button>
                </form>
            `);

            const form = document.getElementById('login-form');
            if (form) {
                form.addEventListener('submit', FormHandlers.handleLogin);
            }
        });
    }

    // Register button
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            ModalManager.create(`
                <h2>Rejestracja</h2>
                <form id="register-form">
                    <input type="text" id="register-username" placeholder="Nazwa użytkownika" required minlength="2">
                    <input type="email" id="register-email" placeholder="Email" required>
                    <input type="password" id="register-password" placeholder="Hasło (min. 6 znaków)" required minlength="6">
                    <button type="submit">Zarejestruj</button>
                </form>
            `);

            const form = document.getElementById('register-form');
            if (form) {
                form.addEventListener('submit', FormHandlers.handleRegister);
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Czy na pewno chcesz się wylogować?')) {
                AuthManager.logout();
            }
        });
    }

    // Update UI based on auth status
    AuthManager.updateUI();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
