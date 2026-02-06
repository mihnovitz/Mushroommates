const API_URL = 'http://localhost:3000/api';

document.getElementById('thread-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Musisz być zalogowany aby utworzyć wątek');
        window.location.href = '/login.html';
        return;
    }

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

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
            window.location.href = '/';
        } else {
            alert('Błąd tworzenia wątku');
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('Błąd połączenia z serwerem');
    }
});
