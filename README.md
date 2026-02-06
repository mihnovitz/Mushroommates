# Mushroommates - Forum Grzybiarzy 🍄

## Opis projektu

Mushroommates to aplikacja webowa dla pasjonatów grzybiarstwa. Platforma umożliwia:
- **Forum dyskusyjne** - tworzenie wątków i dyskusje o grzybach
- **Dzielenie się znaleziskami** - dodawanie znalezionych grzybów ze zdjęciami i lokalizacją
- **Społeczność** - wymiana wiedzy i doświadczeń między grzybiarzami

## Stack technologiczny

### Backend
- **Node.js** (v18+) - środowisko uruchomieniowe
- **Express.js** - framework webowy
- **Prisma ORM** - nowoczesny ORM dla bazy danych
- **PostgreSQL** - relacyjna baza danych
- **JWT** - autentykacja i autoryzacja użytkowników
- **Joi** - walidacja danych wejściowych
- **Winston** - zaawansowane logowanie
- **Helmet** - bezpieczeństwo HTTP headers
- **Multer** - obsługa uploadu plików (zdjęcia grzybów)

### Frontend
- **HTML5/CSS3/JavaScript** - technologie frontendowe
- **Vanilla JS** - bez frameworków, czysty JavaScript
- **Responsive Design** - responsywny interfejs

### Infrastruktura
- **Docker** - konteneryzacja bazy danych i RabbitMQ
- **RabbitMQ** - kolejkowanie zadań asynchronicznych

## Architektura

Aplikacja wykorzystuje **architekturę warstwową** (Layered Architecture):
- **Warstwa prezentacji** - HTML/CSS/JS (frontend)
- **Warstwa routingu** - Express routes z middleware
- **Warstwa kontrolerów** - obsługa HTTP requestów
- **Warstwa serwisów** - logika biznesowa
- **Warstwa dostępu do danych** - Prisma ORM + PostgreSQL

📖 Szczegółowy opis architektury: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Model bazy danych (ERD)

Baza danych zawiera 5 głównych tabel:

1. **User** - użytkownicy systemu
   - id, email, password, name, role, createdAt

2. **Post** - wątki na forum
   - id, title, content, imageUrl, userId, createdAt

3. **Comment** - komentarze w wątkach
   - id, content, postId, userId, createdAt

4. **Mushroom** - znalezione grzyby
   - id, name, species, location, latitude, longitude, photo, userId, createdAt

5. **Role** - role użytkowników (user, admin)

Wszystkie tabele są w 3NF (trzeciej postaci normalnej).

## Instalacja i uruchomienie

### Wymagania
- Node.js (v18 lub nowszy)
- Docker Desktop
- Git

### Krok 1: Klonowanie repozytorium
```bash
git clone https://github.com/mihnovitz/Mushroommates.git
cd Mushroommates
```

### Krok 2: Instalacja zależności
```bash
npm install
```

### Krok 3: Konfiguracja zmiennych środowiskowych
Utwórz plik `.env` w głównym katalogu:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mushroommates"
JWT_SECRET="mega_sekretny_klucz_min_32_znaki"
PORT=3000
```

### Krok 4: Uruchomienie bazy danych i RabbitMQ
```bash
docker compose up -d
```

### Krok 5: Migracja bazy danych
```bash
npx prisma migrate dev
npx prisma generate
```

### Krok 6: (Opcjonalnie) Seedowanie bazy danych
```bash
npx prisma db seed
```

### Krok 7: Uruchomienie serwera
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

## Funkcjonalności

### Zaimplementowane (✅ ~80%)
- ✅ Rejestracja i logowanie użytkowników
- ✅ Autoryzacja JWT z rolami (user, admin)
- ✅ Forum - tworzenie wątków
- ✅ Komentarze w wątkach
- ✅ Dodawanie grzybów ze zdjęciami
- ✅ Upload plików (zdjęcia)
- ✅ Wyświetlanie listy grzybów i wątków
- ✅ Responsywny interfejs
- ✅ Walidacja danych
- ✅ Obsługa błędów

### W planach
- ⏳ Dokumentacja API (Swagger)
- ⏳ Asynchroniczne przetwarzanie (RabbitMQ)
- ⏳ System polubień
- ⏳ Wyszukiwarka

## API Endpoints

### Autentykacja
- `POST /api/auth/register` - rejestracja użytkownika
- `POST /api/auth/login` - logowanie użytkownika

### Forum
- `GET /api/forum/posts` - lista wszystkich wątków
- `GET /api/forum/posts/:id` - szczegóły wątku z komentarzami
- `POST /api/forum/posts` - utworzenie nowego wątku (wymaga auth)
- `POST /api/forum/posts/:id/comments` - dodanie komentarza (wymaga auth)

### Grzyby
- `GET /api/mushrooms` - lista wszystkich grzybów
- `POST /api/mushrooms` - dodanie grzyba (wymaga auth, multipart/form-data)
- `PUT /api/mushrooms/:id` - edycja grzyba (wymaga auth, tylko własne)
- `DELETE /api/mushrooms/:id` - usunięcie grzyba (wymaga auth, tylko własne)

## Bezpieczeństwo
- Hasła są hashowane (bcrypt)
- JWT tokeny do autoryzacji
- Middleware autoryzacji na chronionych endpointach
- Walidacja uploadu plików (tylko obrazy, max 5MB)

## Autor
Projekt stworzony na potrzeby kursu ZTPAI.

## Licencja
MIT
