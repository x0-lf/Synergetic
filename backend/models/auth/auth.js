import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',   // XAMPP
    database: 'synergetic',
    port: 3306,
};

dotenv.config({ path: './config/.env' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '90m';
console.log('JWT_SECRET:', JWT_SECRET);

export async function register(req, res) {
    const { name, surname, birthdate, phone_number, email, login, password } = req.body;

    if (!name || !surname || !birthdate || !phone_number || !email || !login || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const connection = await mysql.createConnection(dbConfig);

        await connection.execute(
            `INSERT INTO clients (name, surname, birthdate, phone_number, email, login, password)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, surname, birthdate, phone_number, email, login, hashedPassword]
        );

        await connection.end();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
}

export async function login(req, res) {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Login and password are required' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM clients WHERE login = ?', [login]);

        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invalid login or password' });
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid login or password' });
        }

        const token = jwt.sign({ id: user.id_client, login: user.login, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login' });
    }
}

// Verify JWT Middleware
export async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    //undefined
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('No authorization header or invalid format.');
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Received token:', token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM clients WHERE id_client = ?', [decoded.id]);
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const dbUser = rows[0];

        if (dbUser.role !== decoded.role || dbUser.login !== decoded.login) {
            console.error(`Role mismatch: Expected '${rows[0]?.role}', got '${decoded.role}'.`);
            return res.status(403).json({ message: 'Role or login mismatch: Access denied' });
        }

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}

