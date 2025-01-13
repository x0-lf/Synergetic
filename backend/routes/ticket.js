import express from 'express';
import {getTickets, getTicketById, addTicket, updateTicket, deleteTicket, getClientTickets} from '../models/ticket.js';
import { authorizeRoles } from '../utils/authorizeRoles.js';
import { verifyToken } from '../models/auth/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    const { role, id: userId } = req.user; // Extract role and user ID from token
    const { page = 1, limit = 10 } = req.query; // Pagination params

    try {
        if (role === 'admin') {
            const { tickets, totalTickets } = await getTickets(page, limit);
            const totalPages = Math.ceil(totalTickets / limit);
            return res.json({ tickets, totalTickets, totalPages });
        } else if (role === 'client') {
            const { tickets, totalTickets } = await getClientTickets(userId, page, limit);
            const totalPages = Math.ceil(totalTickets / limit);
            return res.json({ tickets, totalTickets, totalPages });
        }
        res.status(403).send('Access denied');
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).send('Error fetching tickets');
    }
});

router.get('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    const id = req.params.id;
    try {
        const ticket = await getTicketById(id, false); // Fetch raw data
        if (!ticket) {
            return res.status(404).send(`Ticket with ID ${id} not found`);
        }
        res.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).send('Error fetching ticket');
    }
});

router.get('/:id/details', verifyToken, async (req, res) => {
    const { id: ticketId } = req.params;

    try {
        const ticket = await getTicketById(ticketId, true);

        if (!ticket) {
            return res.status(404).send(`Ticket with ID ${ticketId} not found`);
        }
        res.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        res.status(500).send('Error fetching ticket details');
    }
});

router.post('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { price, start_of_event, events_id_event, clients_id_client } = req.body;

        if (!price || !start_of_event || !events_id_event || !clients_id_client) {
            return res.status(400).send('All fields are required');
        }

        await addTicket(req.body);
        res.status(201).send('Ticket added successfully');
    } catch (error) {
        console.error('Error adding ticket:', error);
        res.status(500).send('Error adding ticket');
    }
});

router.put('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { price, start_of_event, events_id_event, clients_id_client } = req.body;

        if (!price || !start_of_event || !events_id_event || !clients_id_client) {
            return res.status(400).send('All fields are required');
        }

        const success = await updateTicket(id, req.body);
        if (!success) {
            return res.status(404).send(`Ticket with ID ${id} not found`);
        }
        res.status(200).send(`Ticket with ID ${id} updated successfully`);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).send('Error updating ticket');
    }
});

router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await deleteTicket(id);
        if (!deleted) {
            return res.status(404).send(`Ticket with ID ${id} not found`);
        }
        res.status(200).send(`Ticket with ID ${id} deleted successfully`);
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).send('Error deleting ticket');
    }
});

export default router;
