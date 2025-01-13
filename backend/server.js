import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import clientRoutes from './routes/client.js';
import eventRoutes from './routes/event.js';
import ticketRoutes from './routes/ticket.js';
import authRoutes from './routes/auth/auth.js';

import clientDataRoutes from './routes/clientData.js';

const app = express();

dotenv.config({ path: './config/.env' });
//debug do not use
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
app.use(cors());

//add this later on
// app.use(cors({
//     origin: 'http://localhost:5000', // Allow your frontend domain
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Authorization', 'Content-Type'], // Include Authorization header
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Client own data
app.use('/api/clients', clientDataRoutes);

//CRUD OPERATIONS
app.use('/api/clients', clientRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);

//register login
app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
