const API_URL = 'http://localhost:3000/api';

// Sprawdź czy użytkownik jest zalogowany
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('new-thread-btn').style.display = 'block'; // <- DODAJ TĘ LINIĘ
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

        if (!posts || posts.length === 0) {
            container.innerHTML = '<p style="color: #95a5a6; text-align: center; padding: 40px;">Brak postów. Dodaj pierwszy!</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <div class="post" onclick="window.location.href='/thread.html?id=${post.id}'" style="cursor: pointer;">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>Autor: ${post.author?.name || 'Nieznany'} | ${new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd ładowania postów:', error);
        document.getElementById('posts-container').innerHTML = '<p style="color: #e74c3c;">Błąd ładowania postów</p>';
    }
}



// Przekierowanie do logowania
document.getElementById('login-btn')?.addEventListener('click', () => {
    window.location.href = '/login.html';
});

document.getElementById('register-btn')?.addEventListener('click', () => {
    window.location.href = '/register.html';
});

checkAuth();
loadPosts();
