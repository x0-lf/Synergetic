INSERT INTO clients (id_client, name, surname, birthdate, phone_number, email)
VALUES
    (1, 'Marek', 'Marek', '1995-11-01', '123-456-789', 'marek@zmarek.com');

INSERT INTO events (id_event, name, description, seats, created_at, status)
VALUES
    (1, 'Tonight DanceFloor 66', 'Tonight''s party', 500, '2025-01-01 11:12:00', 'upcoming_event');

INSERT INTO tickets (id_ticket, price, start_of_event, events_id_event, clients_id_client)
VALUES
    (1, 99.99, '2025-05-01 11:12:00', 1, 1);
