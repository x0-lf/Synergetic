import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',   // XAMPP
    database: 'synergetic',
    port: 3306,
    dateStrings: true,
};

const normalizeDate = (date) => {
    if (!date) return null;

    const originalDate = new Date(date);
    originalDate.setHours(originalDate.getHours() + 1);

    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getDate()).padStart(2, '0');
    const hours = String(originalDate.getHours()).padStart(2, '0');
    const minutes = String(originalDate.getMinutes()).padStart(2, '0');
    const seconds = String(originalDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const validateEvent = (event) => {
    const errors = [];

    if (typeof event.name !== 'string' || event.name.length < 3 || event.name.length > 64) {
        errors.push('Event name must be between 3 and 64 characters.');
    }

    if (typeof event.description !== 'string' || event.description.length < 3 || event.description.length > 64) {
        errors.push('Description must be between 3 and 64 characters.');
    }

    if (!Number.isInteger(Number(event.seats)) || event.seats < 1 || event.seats > 1000) {
        errors.push('Seats must be a number between 1 and 1000.');
    }

    if (!event.created_at || isNaN(new Date(event.created_at).getTime())) {
        errors.push('Created at must be a valid date.');
    }

    if (!['upcoming_event', 'past_event'].includes(event.status)) {
        errors.push("Status must be either 'upcoming_event' or 'past_event'.");
    }

    return errors;
};


export async function getEvents(page, limit) {
    const connection = await mysql.createConnection(dbConfig);
    const offset = (page - 1) * limit;

    try {
        const [rows] = await connection.execute(
            `SELECT * FROM events LIMIT ? OFFSET ?`,
            [Number(limit), Number(offset)]
        );

        const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM events');
        const totalEvents = countResult[0].total;

        const totalPages = Math.ceil(totalEvents / limit);

        const events = rows.map((event) => ({
            ...event,
            created_at: normalizeDate(event.created_at),
        }));

        return { events, totalPages };
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

//Ticket-related
export async function getAllEvents() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM events');
        return rows.map(event => ({
            ...event,
            created_at: normalizeDate(event.created_at),
        }));
    } catch (error) {
        console.error('Error fetching all events:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getEventById(id) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM events WHERE id_event = ?', [id]);
    await connection.end();
    return rows[0];
}

export async function addEvent(event) {
    const errors = validateEvent(event);
    if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
        'INSERT INTO events (name, description, seats, created_at, status) VALUES (?, ?, ?, ?, ?)',
        [event.name, event.description, event.seats, normalizeDate(event.created_at), event.status]
    );
    await connection.end();
}

export async function updateEvent(id, event) {
    const errors = validateEvent(event);
    if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
        `UPDATE events 
         SET name = ?, description = ?, seats = ?, created_at = ?, status = ? 
         WHERE id_event = ?`,
        [event.name, event.description, event.seats, event.created_at, event.status, id]
    );
    await connection.end();
    return result.affectedRows > 0;
}

export async function deleteEvent(id) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        await connection.execute('DELETE FROM tickets WHERE events_id_event = ?', [id]);

        const [result] = await connection.execute('DELETE FROM events WHERE id_event = ?', [id]);
        await connection.end();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.end();
        throw error;
    }
}


