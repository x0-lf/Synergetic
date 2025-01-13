import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',   // XAMPP
    database: 'synergetic',
    port: 3306,
    dateStrings: true,
};

export async function getTickets(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [tickets] = await connection.execute(
            `SELECT tickets.*,
                    events.name AS event_name,
                    events.description AS event_description,
                    events.status AS event_status,
                    clients.name AS client_name,
                    clients.surname AS client_surname
             FROM tickets
                      JOIN events ON tickets.events_id_event = events.id_event
                      JOIN clients ON tickets.clients_id_client = clients.id_client
             LIMIT ? OFFSET ?`,
            [Number(limit), Number(offset)]
        );

        const [[{ total }]] = await connection.execute(
            `SELECT COUNT(*) AS total FROM tickets`
        );

        return { tickets, totalTickets: total };
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getClientTickets(clientId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [tickets] = await connection.execute(
            `SELECT tickets.*,
                    events.name AS event_name,
                    events.description AS event_description,
                    events.status AS event_status
             FROM tickets
                      JOIN events ON tickets.events_id_event = events.id_event
             WHERE tickets.clients_id_client = ?
             LIMIT ? OFFSET ?`,
            [clientId, Number(limit), Number(offset)]
        );

        const [[{ total }]] = await connection.execute(
            `SELECT COUNT(*) AS total
             FROM tickets
             WHERE clients_id_client = ?`,
            [clientId]
        );

        return { tickets, totalTickets: total };
    } catch (error) {
        console.error('Error fetching client tickets:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getTicketById(id, details = false) {
    const connection = await mysql.createConnection(dbConfig);

    try {
        const query = details
            ? `SELECT
                   tickets.id_ticket,
                   tickets.price,
                   tickets.start_of_event,
                   events.name AS event_name,
                   events.description AS event_description,
                   events.seats AS event_seats,
                   events.created_at AS event_created_at,
                   events.status AS event_status,
                   clients.name AS client_name,
                   clients.surname AS client_surname,
                   clients.birthdate AS client_birthdate,
                   clients.phone_number AS client_phone_number,
                   clients.email AS client_email
               FROM tickets
                        JOIN events ON tickets.events_id_event = events.id_event
                        JOIN clients ON tickets.clients_id_client = clients.id_client
               WHERE tickets.id_ticket = ?`
            : `SELECT
                   tickets.id_ticket,
                   tickets.price,
                   tickets.start_of_event,
                   tickets.events_id_event,
                   tickets.clients_id_client
               FROM tickets
               WHERE tickets.id_ticket = ?`;

        const [rows] = await connection.execute(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

export async function addTicket(ticket) {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
        'INSERT INTO tickets (price, start_of_event, events_id_event, clients_id_client) VALUES (?, ?, ?, ?)',
        [ticket.price, ticket.start_of_event, ticket.events_id_event, ticket.clients_id_client]
    );
    await connection.end();
}

export async function updateTicket(id, ticket) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
        `UPDATE tickets 
         SET price = ?, start_of_event = ?, events_id_event = ?, clients_id_client = ? 
         WHERE id_ticket = ?`,
        [ticket.price, ticket.start_of_event, ticket.events_id_event, ticket.clients_id_client, id]
    );
    await connection.end();
    return result.affectedRows > 0;
}

export async function deleteTicket(id) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM tickets WHERE id_ticket = ?', [id]);
    await connection.end();
    return result.affectedRows > 0;
}