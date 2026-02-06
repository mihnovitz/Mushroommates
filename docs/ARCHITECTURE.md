# Architektura Projektu Mushroommates

## 📁 Struktura katalogów

```
Mushroommates/
├── src/
│   ├── config/                    # Konfiguracja serwisów
│   │   ├── database.js           # Singleton PrismaClient
│   │   └── multer.js             # Konfiguracja uploadu plików
│   │
│   ├── middleware/                # Middleware Express
│   │   ├── auth.middleware.js    # Autoryzacja JWT
│   │   ├── error.middleware.js   # Centralna obsługa błędów
│   │   └── validation.middleware.js # Walidacja z Joi
│   │
│   ├── controllers/               # Kontrolery HTTP
│   │   ├── auth.controller.js    # Endpoint handlers dla auth
│   │   ├── forum.controller.js   # Endpoint handlers dla forum
│   │   └── mushroom.controller.js # Endpoint handlers dla grzybów
│   │
│   ├── services/                  # Logika biznesowa
│   │   ├── auth.service.js       # Rejestracja, logowanie
│   │   ├── forum.service.js      # CRUD postów i komentarzy
│   │   └── mushroom.service.js   # CRUD grzybów
│   │
│   ├── validators/                # Schematy walidacji Joi
│   │   ├── auth.validator.js     # Walidacja rejestracji/logowania
│   │   ├── forum.validator.js    # Walidacja postów/komentarzy
│   │   └── mushroom.validator.js # Walidacja danych grzybów
│   │
│   ├── utils/                     # Narzędzia pomocnicze
│   │   ├── errors.js             # Custom error classes
│   │   ├── logger.js             # Winston logger
│   │   └── response.js           # Standardowe odpowiedzi API
│   │
│   ├── routes/                    # Definicje route'ów
│   │   ├── index.js              # Główny router (agregacja)
│   │   ├── auth.js               # Routes dla autentykacji
│   │   ├── forum.routes.js       # Routes dla forum
│   │   └── mushroom.routes.js    # Routes dla grzybów
│   │
│   ├── auth.js                    # Helper functions (JWT, bcrypt)
│   ├── app.js                     # Konfiguracja Express app
│   └── index.js                   # Entry point (server start)
│
├── public/                        # Pliki statyczne (frontend)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── index.js              # Strona główna (lista postów)
│   │   ├── app.js                # Logika auth (modalne)
│   │   ├── mushrooms.js          # Dodawanie grzybów
│   │   ├── new-thread.js         # Tworzenie wątków
│   │   └── thread.js             # Widok wątku + komentarze
│   ├── uploads/                   # Uploaded files
│   ├── index.html
│   ├── login.html
│   ├── mushrooms.html
│   ├── new-thread.html
│   ├── thread.html
│   └── forum.html
│
├── prisma/
│   ├── schema.prisma             # Schemat bazy danych
│   └── migrations/               # Migracje
│
├── logs/                          # Logi aplikacji
│   ├── error.log
│   └── combined.log
│
├── .env                           # Zmienne środowiskowe
├── .env.example                   # Przykładowa konfiguracja
├── .gitignore
├── docker-compose.yml             # PostgreSQL + RabbitMQ
├── package.json
└── README.md

```

## 🏗️ Architektura warstwowa

### 1. **Warstwa prezentacji (Frontend)**
- Pliki HTML/CSS/JavaScript
- Komunikacja z API przez fetch()
- LocalStorage dla JWT tokens

### 2. **Warstwa routingu (Routes)**
- Mapowanie URL na kontrolery
- Middleware dla autoryzacji i walidacji
- Agregacja wszystkich endpoint'ów

### 3. **Warstwa kontrolerów (Controllers)**
- **Odpowiedzialność**: Obsługa HTTP requests/responses
- Parsowanie parametrów
- Wywołanie odpowiednich serwisów
- Zwracanie odpowiedzi (używając utils/response.js)

### 4. **Warstwa logiki biznesowej (Services)**
- **Odpowiedzialność**: Implementacja logiki aplikacji
- Walidacja biznesowa
- Operacje na wielu modelach
- Niezależna od HTTP (można reużyć)

### 5. **Warstwa dostępu do danych (Prisma ORM)**
- **Odpowiedzialność**: Komunikacja z bazą danych
- CRUD operations
- Transakcje
- Relacje między modelami

## 🔄 Przepływ requestu (przykład)

```
POST /api/auth/register

1. Express Router (routes/auth.js)
   ↓
2. Validation Middleware (validators/auth.validator.js)
   - Joi schema validation
   ↓
3. Controller (controllers/auth.controller.js)
   - Parsuje req.body
   - Wywołuje AuthService.register()
   ↓
4. Service (services/auth.service.js)
   - Sprawdza czy user istnieje
   - Hashuje hasło (bcrypt)
   - Tworzy użytkownika (Prisma)
   - Generuje JWT token
   ↓
5. Response (utils/response.js)
   - sendSuccess() / sendError()
   ↓
6. Client receives JSON response
```

## 🛡️ Middleware Stack

Każdy request przechodzi przez:

1. **helmet** - Security headers
2. **cors** - CORS policy
3. **express.json()** - Body parser
4. **morgan** - HTTP logging
5. **rate-limiter** - Rate limiting (100 req/15min)
6. **authMiddleware** - JWT verification (jeśli wymagane)
7. **validate** - Joi validation (jeśli wymagane)
8. **controller** - Business logic
9. **errorHandler** - Centralna obsługa błędów

## 🔐 Bezpieczeństwo

### Implementowane mechanizmy:
- ✅ JWT tokens (HttpOnly w przyszłości)
- ✅ Bcrypt password hashing
- ✅ Helmet.js security headers
- ✅ Rate limiting
- ✅ Input validation (Joi)
- ✅ File upload validation (type, size)
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection (input sanitization)

## 📊 Custom Error Classes

```javascript
AppError              // Base error class
├── ValidationError   // 400 - Błędy walidacji
├── UnauthorizedError // 401 - Brak autoryzacji
├── ForbiddenError    // 403 - Brak uprawnień
├── NotFoundError     // 404 - Nie znaleziono
└── ConflictError     // 409 - Konflikt (np. duplikat email)
```

## 📝 Logging

**Winston logger** z poziomami:
- `error` → logs/error.log
- `info` → logs/combined.log
- `debug` → konsola (development)

Format logów:
```
2026-02-06 21:50:01 [info]: 🚀 Server running on http://localhost:3000
2026-02-06 21:52:47 [error]: ValidationError: "latitude" must be less than or equal to 90
```

## 🧪 Testowanie

Struktura przygotowana pod testy:
- **Unit tests** - services (logika biznesowa)
- **Integration tests** - controllers + database
- **E2E tests** - całe flow

## 📦 Zalety tej architektury

1. **Separation of Concerns** - każda warstwa ma swoją odpowiedzialność
2. **Reusable** - serwisy można używać poza HTTP context
3. **Testable** - łatwo mockować zależności
4. **Maintainable** - łatwo znaleźć gdzie zmienić kod
5. **Scalable** - łatwo dodać nowe features
6. **Clean Code** - mniejsze, bardziej fokusowe pliki

## 🔄 Migracja ze starego kodu

Stary plik `src/index.old.js` (217 linii) został rozdzielony na:
- 15 małych, fokusowych plików
- Każdy plik < 100 linii
- Jasna odpowiedzialność każdego modułu
- Łatwiejszy w utrzymaniu i rozwijaniu
