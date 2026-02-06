const API_URL = 'http://localhost:3000/api';

// Sprawdź czy użytkownik jest zalogowany
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('add-post-section').style.display = 'block';
    }
}

// Wylogowanie
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.reload();
});

// Załaduj posty
async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/forum/posts`);
        const posts = await response.json();

        const container = document.getElementById('posts-container');
        container.innerHTML = posts.map(post => `
            <div class="post">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>Autor: ${post.author.name} | ${new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd ładowania postów:', error);
    }
}

// Dodaj nowy post
document.getElementById('add-post-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    try {
        const response = await fetch(`${API_URL}/forum/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            document.getElementById('add-post-form').reset();
            loadPosts();
        }
    } catch (error) {
        console.error('Błąd dodawania posta:', error);
    }
});

// Przekierowanie do logowania
document.getElementById('login-btn')?.addEventListener('click', () => {
    window.location.href = '/login.html';
});

document.getElementById('register-btn')?.addEventListener('click', () => {
    window.location.href = '/register.html';
});

checkAuth();
loadPosts();
