import express from 'express';
import {getEvents, getEventById, addEvent, updateEvent, deleteEvent, getAllEvents} from '../models/event.js';
import { authorizeRoles } from '../utils/authorizeRoles.js';
import { verifyToken } from '../models/auth/auth.js';

const router = express.Router();

//Ticket related
router.get('/', verifyToken, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userRole = req.user.role;

    try {
        if (userRole === 'admin' || userRole === 'client') {
            const { events, totalPages } = await getEvents(page, limit);
            return res.json({ events, totalPages });
        } else {
            const events = await getAllEvents();
            return res.json({ events });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Error fetching events');
    }
});

router.get('/:id', verifyToken, authorizeRoles('admin','client'), async (req, res) => {
    const id = req.params.id;
    try {
        const event = await getEventById(id);
        if (!event) {
            return res.status(404).send(`Event with ID ${id} not found`);
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).send('Error fetching event');
    }
});

router.put('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    const id = req.params.id;
    const updatedEvent = req.body;
    try {
        const success = await updateEvent(id, updatedEvent);
        if (!success) {
            return res.status(404).send(`Event with ID ${id} not found`);
        }
        res.status(200).send(`Event with ID ${id} updated successfully`);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send('Error updating event');
    }
});

router.post('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const newEvent = req.body;
        await addEvent(newEvent);
        res.status(201).send('Event added successfully');
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('Error adding event');
    }
});

router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await deleteEvent(id);
        if (!deleted) {
            return res.status(404).send(`Event with ID ${id} not found`);
        }
        res.status(200).send(`Event with ID ${id} deleted successfully`);
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Error deleting event');
    }
});

export default router;
