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
    const formData = {
        name: document.getElementById('mushroom-name').value,
        species: document.getElementById('mushroom-species').value,
        location: document.getElementById('mushroom-location').value,
        latitude: parseFloat(document.getElementById('mushroom-lat').value),
        longitude: parseFloat(document.getElementById('mushroom-lng').value)
    };

    try {
        const response = await fetch(`${API_URL}/mushrooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Grzyb dodany!');
            document.getElementById('add-mushroom').reset();
            loadMushrooms();
        } else {
            alert('Błąd dodawania grzyba');
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
                <h3>${m.name}</h3>
                <p><strong>Gatunek:</strong> ${m.species || 'Nieznany'}</p>
                <p><strong>Lokalizacja:</strong> ${m.location}</p>
                <p><strong>Współrzędne:</strong> ${m.latitude}, ${m.longitude}</p>
                <small>Dodano: ${new Date(m.createdAt).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd ładowania grzybów:', error);
    }
}

checkAuth();
loadMushrooms();
