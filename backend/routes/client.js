import express from 'express';
import {getClients, getClientById, addClient, updateClient, deleteClient, getAllClients} from '../models/client.js';
import { authorizeRoles } from '../utils/authorizeRoles.js';
import { verifyToken } from '../models/auth/auth.js';

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const { clients, total } = await getClients(page, limit);
        res.json({ clients, total });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).send('Error fetching clients');
    }
});

//Ticket Related
router.get('/all', verifyToken, async (req, res) => {
    try {
        const clients = await getAllClients();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching all clients:', error);
        res.status(500).send('Error fetching clients');
    }
});

router.get('/:id', verifyToken, authorizeRoles('admin','client'), async (req, res) => {
    const id = req.params.id;
    try {
        const client = await getClientById(id);
        if (!client) {
            return res.status(404).send(`Client with ID ${id} not found`);
        }
        res.json(client);
    } catch (error) {
        console.error(`Error fetching client:`, error);
        res.status(500).send(`Error fetching client`);
    }
});

router.post('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const newClient = req.body;
        await addClient(newClient);
        res.status(201).send('Client added successfully');
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).send('Error adding client');
    }
});

router.put('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    const id = req.params.id;
    const updatedClient = req.body;
    try {
        const success = await updateClient(id, updatedClient);
        if (!success) {
            return res.status(404).send(`Client with ID ${id} not found`);
        }
        res.status(200).send(`Client with ID ${id} updated successfully`);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).send('Error updating client');
    }
});

router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await deleteClient(id);
        if (!deleted) {
            return res.status(404).send(`Client with ID ${id} not found`);
        }
        res.status(200).send(`Client with ID ${id} deleted successfully`);
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).send('Error deleting client');
    }
});

export default router;
