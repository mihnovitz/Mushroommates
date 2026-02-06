const API_URL = 'http://localhost:3000/api';

document.getElementById('thread-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Musisz być zalogowany aby utworzyć wątek');
        window.location.href = '/login.html';
        return;
    }

    const title = document.getElementById('title')?.value;
    const content = document.getElementById('content')?.value;

    // Walidacja po stronie klienta
    if (!title || title.length < 5) {
        alert('Tytuł musi mieć minimum 5 znaków');
        return;
    }

    if (!content || content.length < 10) {
        alert('Treść musi mieć minimum 10 znaków');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/forum/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Wątek utworzony pomyślnie!');
            window.location.href = '/';
        } else {
            alert('Błąd tworzenia wątku: ' + (data.error || data.message || 'Nieznany błąd'));
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('Błąd połączenia z serwerem');
    }
});
