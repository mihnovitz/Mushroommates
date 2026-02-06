const API_URL = 'http://localhost:3000/api';

const urlParams = new URLSearchParams(window.location.search);
const threadId = urlParams.get('id');

async function loadThread() {
    try {
        const response = await fetch(`${API_URL}/forum/posts/${threadId}`);
        const data = await response.json();

        const post = data.success ? data.data : data; // Obsługa obu formatów

        let commentsHtml = '';
        if (post.comments && post.comments.length > 0) {
            commentsHtml = post.comments.map(comment => `
                <div class="post" style="margin-left: 20px; border-left: 3px solid #3498db;">
                    <p>${comment.content}</p>
                    <small>Autor: ${comment.user?.name || 'Nieznany'} | ${new Date(comment.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            commentsHtml = '<p style="color: #95a5a6; margin-left: 20px;">Brak odpowiedzi. Dodaj pierwszą!</p>';
        }

        const threadContent = document.getElementById('thread-content');
        if (threadContent) {
            threadContent.innerHTML = `
                <div class="post">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <small>Autor: ${post.user?.name || 'Nieznany'} | ${new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
                <h3 style="margin-top: 30px;">Odpowiedzi</h3>
                <div id="replies-container">${commentsHtml}</div>
            `;
        }

        const token = localStorage.getItem('token');
        const replySection = document.getElementById('add-reply-section');
        if (token && replySection) {
            replySection.style.display = 'block';
        }
    } catch (error) {
        console.error('Błąd ładowania wątku:', error);
        const threadContent = document.getElementById('thread-content');
        if (threadContent) {
            threadContent.innerHTML = '<p style="color: #e74c3c;">Błąd ładowania wątku</p>';
        }
    }
}

document.getElementById('reply-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const content = document.getElementById('reply-content')?.value;

    if (!content || content.length < 1) {
        alert('Komentarz nie może być pusty');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/forum/posts/${threadId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            document.getElementById('reply-form').reset();
            loadThread();
        } else {
            alert('Błąd dodawania odpowiedzi: ' + (data.error || data.message || 'Nieznany błąd'));
        }
    } catch (error) {
        console.error('Błąd dodawania odpowiedzi:', error);
        alert('Błąd połączenia z serwerem');
    }
});

loadThread();
