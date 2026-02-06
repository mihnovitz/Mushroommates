const API_URL = 'http://localhost:3000/api';

// Sprawdź czy użytkownik jest zalogowany
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Musisz być zalogowany aby dodać grzyba!');
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Wylogowanie
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

// Dodaj grzyba
document.getElementById('add-mushroom')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!checkAuth()) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', document.getElementById('mushroom-name').value);
    formData.append('species', document.getElementById('mushroom-species').value);
    formData.append('location', document.getElementById('mushroom-location').value);
    formData.append('latitude', document.getElementById('mushroom-lat').value);
    formData.append('longitude', document.getElementById('mushroom-lng').value);

    const photoFile = document.getElementById('mushroom-photo').files[0];
    if (photoFile) {
        formData.append('image', photoFile);
    }

    try {
        const response = await fetch(`${API_URL}/mushrooms`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Grzyb dodany!');
            document.getElementById('add-mushroom').reset();
            loadMushrooms();
        } else {
            const error = await response.json();
            alert('Błąd dodawania grzyba: ' + (error.error || 'Nieznany błąd'));
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('Błąd połączenia z serwerem');
    }
});

// Załaduj listę grzybów
async function loadMushrooms() {
    try {
        const response = await fetch(`${API_URL}/mushrooms`);
        const mushrooms = await response.json();

        const container = document.getElementById('mushrooms-container');
        container.innerHTML = mushrooms.map(m => `
            <div class="mushroom-card">
                ${m.photo ? `<img src="${m.photo}" alt="${m.name}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">` : ''}
                <h3>${m.name}</h3>
                <p><strong>Gatunek:</strong> ${m.species || 'Nieznany'}</p>
                <p><strong>Lokalizacja:</strong> ${m.location}</p>
                <p><strong>Współrzędne:</strong> ${m.latitude}, ${m.longitude}</p>
                <p><strong>Znalazł:</strong> ${m.user?.name || 'Nieznany'}</p>
                <small>Dodano: ${new Date(m.createdAt).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd ładowania grzybów:', error);
    }
}

checkAuth();
loadMushrooms();
