const API_URL = 'http://localhost:3000/api';

const urlParams = new URLSearchParams(window.location.search);
const threadId = urlParams.get('id');

async function loadThread() {
    try {
        const response = await fetch(`${API_URL}/forum/posts/${threadId}`);
        const post = await response.json();

        document.getElementById('thread-content').innerHTML = `
            <div class="post">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <small>Autor: ${post.author?.name || 'Nieznany'} | ${new Date(post.createdAt).toLocaleDateString()}</small>
            </div><h3 style="margin-top: 30px;">Odpowiedzi</h3>
            <div id="replies-container"></div>
        `;

        const token = localStorage.getItem('token');
        if (token) {document.getElementById('add-reply-section').style.display = 'block';
        }
    } catch (error) {
        console.error('Błąd ładowania wątku:', error);
        document.getElementById('thread-content').innerHTML = '<p style="color: #e74c3c;">Błąd ładowania wątku</p>';
    }
}

document.getElementById('reply-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const content = document.getElementById('reply-content').value;

    try {
        const response = await fetch(`${API_URL}/forum/posts/${threadId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            document.getElementById('reply-form').reset();
            loadThread();
        }
    } catch (error) {
        console.error('Błąd dodawania odpowiedzi:', error);
    }
});

loadThread();
