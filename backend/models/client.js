import mysql from 'mysql2/promise';
import bcrypt from "bcrypt";

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',   //XAAMP
    database: 'synergetic',
    port: 3306,
    dateStrings: true   //fix na daty XD
};

const normalizeDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
};

export async function getClients(page, limit) {
    const offset = (page - 1) * limit;
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [clients] = await connection.execute(
            'SELECT * FROM clients LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [[{ total }]] = await connection.execute(
            'SELECT COUNT(*) AS total FROM clients'
        );

        return {
            clients: clients.map(client => ({
                ...client,
                birthdate: normalizeDate(client.birthdate),
            })),
            total,
        };
    } catch (error) {
        console.error('Error in getClients model:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

//Ticket related
export async function getAllClients() {
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM clients');
        return rows.map(client => ({
            ...client,
            birthdate: normalizeDate(client.birthdate),
        }));
    } catch (error) {
        console.error('Error fetching all clients:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

export async function getClientById(id) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM clients WHERE id_client = ?', [id]);
    await connection.end();

    if (rows.length === 0) return null;
    const client = rows[0];
    console.log('Received birthdate:', client.birthdate);

    client.birthdate = normalizeDate(client.birthdate);
    console.log('Normalized Received birthdate:', client.birthdate);
    return client;
}

//Client Related his own data
export async function getClientData(clientId, role) {
    if (role !== 'client') {
        console.error('Access denied: Only clients can fetch this data.');
        throw new Error('Access denied: insufficient permissions.');
    }

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(
            `SELECT id_client, name, surname, birthdate, phone_number, email, login
             FROM clients
             WHERE id_client = ?`,
            [clientId]
        );

        if (rows.length === 0) {
            return null;
        }

        const client = rows[0];
        client.birthdate = normalizeDate(client.birthdate);
        return client;
    } catch (error) {
        console.error('Error fetching client data:', error);
        throw error;
    } finally {
        await connection.end();
    }
}



export async function addClient(client) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const hashedPassword = await bcrypt.hash(client.password, 10);

        await connection.execute(
            `INSERT INTO clients 
             (name, surname, birthdate, phone_number, email, login, password, role) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                client.name,
                client.surname,
                normalizeDate(client.birthdate),
                client.phone_number,
                client.email,
                client.login,
                hashedPassword,
                client.role || 'client',
            ]
        );
    } catch (error) {
        console.error('Error adding client:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

export async function updateClient(id, client, role) {
    const connection = await mysql.createConnection(dbConfig);

    try {
        let query = `
            UPDATE clients
            SET name = ?, surname = ?, birthdate = ?, phone_number = ?, email = ?, login = ?
        `;
        const values = [
            client.name,
            client.surname,
            normalizeDate(client.birthdate),
            client.phone_number,
            client.email,
            client.login,
        ];

        if (client.password) {
            const hashedPassword = await bcrypt.hash(client.password, 10);
            query += `, password = ?`;
            values.push(hashedPassword);
        }

        if (role === 'admin' && client.role) {
            query += `, role = ?`;
            values.push(client.role);
        }

        query += ` WHERE id_client = ?`;
        values.push(id);

        const [result] = await connection.execute(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    } finally {
        await connection.end();
    }
}


export async function updateClientData(clientId, clientData, role) {
    if (role !== 'client') {
        console.error('Access denied: Only clients can update this data.');
        throw new Error('Access denied: insufficient permissions.');
    }

    const connection = await mysql.createConnection(dbConfig);
    try {
        let query = `
            UPDATE clients
            SET name = ?, surname = ?, birthdate = ?, phone_number = ?, email = ?, login = ?
        `;
        const values = [
            clientData.name,
            clientData.surname,
            normalizeDate(clientData.birthdate),
            clientData.phone_number,
            clientData.email,
            clientData.login,
        ];

        if (clientData.password) {
            const hashedPassword = await bcrypt.hash(clientData.password, 10);
            query += `, password = ?`;
            values.push(hashedPassword);
        }

        query += ` WHERE id_client = ?`;
        values.push(clientId);

        const [result] = await connection.execute(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating client data:', error);
        throw error;
    } finally {
        await connection.end();
    }
}



export async function deleteClient(id) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        await connection.execute('DELETE FROM tickets WHERE clients_id_client = ?', [id]);
        const [result] = await connection.execute('DELETE FROM clients WHERE id_client = ?', [id]);
        await connection.end();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.end();
        throw error;
    }
}
