# Synergetic - Klubo-Kawiarnia

## Opis Projektu
Synergetic jest klubem nocnym (muzycznym), w którym dzieją się różne wydarzenia.
Za dnia funkcjonuje jako kawiarnia, miejsce w którym można: przyjść, spędzić czas, obejrzeć jakąś
projekcje (np. pokaz filmu) lub posłuchać wykładu jakiejś persony. System implementuje kontrolę dostępu opartą na rolach
(role-based access control) z podziałem na 3 role: `gość`, `client` i `admin`. Każda rola ma inne uprawnienia w systemie.

## System ról (role-based access control)

### Gość (niezarejestrowany użytkownik)
- **Uprawnienia**
    - Dostęp do strony głównej
    - Rejestracja konta w systemie
    - Zalogowanie się w systemie

### Client (użytkownik systemu z kontem)
- **Uprawnienia**
    - Przeglądanie i modyfikacja swoich własnych danych w systemie (włączając w to login i hasło)
    - Przeglądanie rozszerzonych szczegółów na temat swojego konta
    - Przeglądanie dostępnych wydarzeń i ich szczegółow
    - Wyświetlanie tylko swoich biletów i ich szczegółów (włączając w to informacje o wydarzeniu i swoje informacje w systemie) 

### Admin
- **Uprawnienia**
    - Pełny dostęp do wszystkich tabel
    - Możliwość wykonywania operacji CREATE, READ, UPDATE i DELETE na wszystkich tabelach

## Baza danych - struktura
### Tabele
1. **Clients**
    - Przechowuje informacje o kliencie, jego dane personalne, w tym login i hasło.
2. **Events**
    - Przechowuje informacje o wydarzeniach, ich nazwy, opisy, ilość miejsc, i status
3. **Tickets**
    - Łączy informacje o cliencie z wydarzeniami podczas gdy przechowuje informacje związane z biletem na wydarzenie
    takie jak cena, czy data i czas rozpoczęcia wydarzenia.

### Diagram ERD

### Struktura logiczna systemu
#### Tabela `clients`
```sql
CREATE TABLE clients (
    id_client INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    surname VARCHAR(64) NOT NULL,
    birthdate DATE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(128) NOT NULL,
    login VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'client'
)
```
#### Tabela `events`
```sql
CREATE TABLE events (
                       id_event int  AUTO_INCREMENT PRIMARY KEY,
                       name varchar(64)  NOT NULL,
                       description varchar(64)  NOT NULL,
                       seats int  NOT NULL,
                       created_at datetime  NOT NULL,
                       status varchar(64)  NOT NULL
);
```
#### Tabela `tickets`
```sql
CREATE TABLE tickets (
                         id_ticket int AUTO_INCREMENT PRIMARY KEY,
                         price decimal(10,2)  NOT NULL,
                         start_of_event datetime  NOT NULL,
                         events_id_event int  NOT NULL,
                         clients_id_client int  NOT NULL
);
```

## Jak skonfigurować projekt?

System do prawidłowego działania wymaga pliku `.env` który przechowuje zmienne środowiskowe.
Tą zmienną można wygenerować za pomocą skryptu `generateSecretKey.js` ,który znajduje się w folderze:
```/backend/config/```
W tym samym folderze należy umieścić utworzyć plik `.env` i umieścić w nim:
```JWT_SECRET=<tu wstawić wygenerowany klucz>```

### Jak wygenerować Secret Key?
Przejdź do następującego folderu:
```/backend/config/```
Uruchom następujące polecenie:
```node generateSecretKey.js```


## Przykładowe dane
### Przykład dla `clients`
| id_client | name  | surname | birthdate   | phone_number | email            | role  |
|-----------|-------|---------|-------------|--------------|------------------|-------|
| 1         | Marek | Marek   | 1995-11-01  | 123-456-789  | marek@zmarek.com | client|

### Przykład dla `events`
| id_event | name                 | description     | seats | created_at          | status         |
|----------|----------------------|-----------------|-------|---------------------|----------------|
| 1        | Tonight DanceFloor 66 | Tonight's party | 500   | 2025-01-01 11:12:00 | upcoming_event |

### Przykład dla `tickets`
| id_ticket | price | start_of_event       | events_id_event | clients_id_client |
|-----------|-------|----------------------|-----------------|-------------------|
| 1         | 99.99 | 2025-05-01 11:12:00 | 1               | 1                 |

## Jak skonfigurować projekt?

1. Sklonuj repozytorium:
```bash
git clone https://github.com/x0-lf/synergetic.git
```

2. Zainstaluj wymagane dependencies
```bash
npm install
```

3. Wygeneruj plik `.env` wraz ze zmienną `JWT_SECRET` i umieść ten plik w
```/backend/config/```
4. Pobierz i zainstaluj XAAMP najlepiej w wersji 8.2.12
4.1. Bogatsze instrukcje jak skonfigurować XAAMP znajdziesz w pliku readme_en.txt w miejscu instalacji XAAMP.
5. Po skonfigurowaniu XAMPP uruchom usługę `Apache` i `MySQL`
6. Przejdź w przeglądarce do `http://localhost/phpmyadmin/index.php?route=/server/databases/`
7. Jako nazwę bazy danych podaj synergetic
8. Collation wybierz `utf8mb4_general_ci` lub `utf8_general_ci`
9. Kliknij `Create`
10. Przejdź w przeglądarce do zakładki SQL będąc w bazie danych `synergetic`

    ``http://localhost/phpmyadmin/index.php?route=/database/sql&db=synergetic``

11. Uruchom skrypt, który utworzy tabele w bazie danych z folderu `database/CreateTables.sql`
12. Uruchom skrypt, który wypełni te tabele danymi z folderu `database/insertData.sql`

## Jak uruchomić projekt?
## Server backend:

#### w folderze `/backend` uruchom:

``nodemon server.js``

## Server frontend

#### w głownym katalogu projektu `/` uruchom:

``vite`` lub ``npm run dev:frontend``

## Dane o usługach

#### mysql działa na Porcie: ``3306``
#### nodemon działa na Porcie: ``5000``
#### vite(react) działa na Porcie: ``5173``

## FAQ
1. Czy mogę użyć innego środowiska niż XAAMP np. MAMP??
- tak, ale wymaga zmiany ustawień w plikach w folderze backend zmiany portu z ``3306`` na port twojego środowiska

2. Nie mogę odpalić servera.
- Sprawdź czy dla frontend'u jesteś w katalogu głównym, a dla serveru backendowego w folderze ``/backend``

3. Strona się uruchamia, ale nie można utworzyć konta
- Spawdź czy twoja baza danych jest skonfigurowana na brak hasła, lub zmień w plikach w folderze ``/backend/models`` i dodaj tam dla każdego odpowiednie hasło
