# 🚀 Instrukcja uruchomienia serwera

## Metoda 1: Tryb development (z nodemon - auto-restart)

```bash
cd /home/mihno/Documents/ZTPAI/project/Mushroommates
npm run dev
```

**Zalety:**
- Automatyczny restart przy zmianach
- Logi w konsoli z kolorami
- Idealne do development

## Metoda 2: Tryb production

```bash
cd /home/mihno/Documents/ZTPAI/project/Mushroommates
npm start
```

## Metoda 3: W tle (background)

```bash
cd /home/mihno/Documents/ZTPAI/project/Mushroommates
nohup npm run dev > logs/server.log 2>&1 &
```

## Sprawdzanie czy serwer działa

```bash
# Sprawdź procesy
ps aux | grep node

# Testuj endpoint
curl http://localhost:3000/api/health

# Zobacz logi (jeśli w tle)
tail -f logs/combined.log
```

## Zatrzymanie serwera

```bash
# Zatrzymaj wszystkie procesy node
pkill -f "node"

# Lub tylko serwer
pkill -f "node src/index.js"

# Lub tylko nodemon
pkill -f "nodemon"
```

## Troubleshooting

### Problem: Port already in use

```bash
# Znajdź proces na porcie 3000
lsof -i:3000

# Zabij proces
kill -9 <PID>

# Lub zabij wszystkie node procesy
pkill -f node
```

### Problem: Brak logów

```bash
# Upewnij się że katalog logs istnieje
mkdir -p logs

# Sprawdź uprawnienia
chmod 755 logs
```

### Problem: Cannot find module

```bash
# Przeinstaluj dependencies
rm -rf node_modules package-lock.json
npm install
```

## Weryfikacja poprawnego działania

Po uruchomieniu powinieneś zobaczyć:

```
[info]: ✅ Połączono z bazą danych PostgreSQL
[info]: 🚀 Server running on http://localhost:3000
[info]: 📝 Environment: development
```

Następnie otwórz przeglądarkę: http://localhost:3000
