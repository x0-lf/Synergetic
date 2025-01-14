-- clients
INSERT INTO clients (id_client, name, surname, birthdate, phone_number, email, login, password, role)
VALUES
    (1, 'Marek', 'Marek', '1995-11-01', '123-456-789', 'marek@zmarek.com', 'marek', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client'),
    (2, 'Admin', 'Adminski', '1998-12-12', '133-700-111', 'admin@admin.com', 'admin', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'admin'),
    (3, 'Kasia', 'Kasia', '2000-05-20', '987-654-321', 'kasia11@kasia.pl', 'kasia11', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client'),
    (4, 'Artur', 'Nowak', '1988-03-15', '111-222-333', 'artur.pl@nowak.com', 'artur', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client'),
    (5, 'Anna', 'Marchewka', '1992-08-10', '999-888-777', 'annama@marchewka.pl', 'anna', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client'),
    (6, 'Tomasz', 'Bialy', '1990-11-25', '444-555-666', 'tomasz@bialy.pl', 'tomasz', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client'),
    (7, 'Mariusz', 'Pudzianowski', '1985-04-18', '222-333-444', 'najsilniejszy@polak.com', 'pudzian', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'admin'),
    (8, 'Michal', 'Bleble', '1993-07-22', '111-333-555', 'michal@bleble.com', 'michal', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client'),
    (9, 'Ewa', 'Maria', '2001-01-30', '888-777-666', 'ewa@maria.pl', 'ewa', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client'),
    (10, 'Mariusz', 'Kawka', '1987-09-14', '777-666-555', 'mariusz@kawka.com', 'mariusz', '$2b$10$ZjYLpYh3R6OpYI2x3NwBYOxnbcr/S.Us6H95SSBBpdPivl9wpqZj6', 'client');

-- events
INSERT INTO events (id_event, name, description, seats, created_at, status)
VALUES
    (1, 'Tonight DanceFloor 66', 'Tonights party', 500, '2025-01-01 11:12:00', 'upcoming_event'),
    (2, 'Sobotnia Impreza', 'Weekend', 300, '2025-01-15 18:00:00', 'upcoming_event'),
    (3, 'Niedziela Chill', 'Relaksujacy Wieczor', 200, '2025-02-01 20:00:00', 'upcoming_event'),
    (4, 'Rock Festival', 'Rock music festival', 1000, '2025-03-01 19:00:00', 'upcoming_event'),
    (5, 'Jazzowy Piatek', 'Jazz concert on Friday', 150, '2024-04-01 13:37:00', 'past_event'),
    (6, 'Karnawalowy Bal', 'Annual carnival ball', 600, '2025-02-10 19:00:00', 'upcoming_event'),
    (7, 'Wieczor Klasyczny', 'Classical music night', 250, '2025-03-15 19:30:00', 'upcoming_event'),
    (8, 'Filmowa Sobota', 'Movie night', 200, '2025-04-05 20:00:00', 'upcoming_event'),
    (9, 'Gala Sportowa', 'Sports award night', 400, '2025-05-20 18:00:00', 'upcoming_event'),
    (10, 'Piknik Rodzinny', 'Family picnic', 300, '2025-06-01 13:37:00', 'upcoming_event');

-- tickets
INSERT INTO tickets (id_ticket, price, start_of_event, events_id_event, clients_id_client)
VALUES
    (1, 99.99, '2025-05-01 11:12:00', 1, 1),
    (2, 50.00, '2025-01-15 18:00:00', 2, 3),
    (3, 30.00, '2025-02-01 20:00:00', 3, 4),
    (4, 120.00, '2025-03-01 19:00:00', 4, 1),
    (5, 75.00, '2024-09-01 19:30:00', 5, 3),
    (6, 60.00, '2025-02-10 19:00:00', 6, 1),
    (7, 45.00, '2025-03-15 19:30:00', 7, 1),
    (8, 80.00, '2025-04-05 20:00:00', 8, 1),
    (9, 100.00, '2025-05-20 18:00:00', 9, 1),
    (10, 50.00, '2025-06-01 12:00:00', 10, 1);
