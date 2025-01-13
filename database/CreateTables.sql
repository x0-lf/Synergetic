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
);

CREATE TABLE events (
id_event int  AUTO_INCREMENT PRIMARY KEY,
name varchar(64)  NOT NULL,
description varchar(64)  NOT NULL,
seats int  NOT NULL,
created_at datetime  NOT NULL,
status varchar(64)  NOT NULL
);

CREATE TABLE tickets (
id_ticket int AUTO_INCREMENT PRIMARY KEY,
price decimal(10,2)  NOT NULL,
start_of_event datetime  NOT NULL,
events_id_event int  NOT NULL,
clients_id_client int  NOT NULL
);

ALTER TABLE tickets ADD CONSTRAINT tickets_clients FOREIGN KEY tickets_clients (clients_id_client)
    REFERENCES clients (id_client);

ALTER TABLE tickets ADD CONSTRAINT tickets_events FOREIGN KEY tickets_events (events_id_event)
    REFERENCES events (id_event);