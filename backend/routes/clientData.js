import express from 'express';
import { getClientData, updateClientData } from '../models/client.js';
import { authorizeRoles } from '../utils/authorizeRoles.js';
import { verifyToken } from '../models/auth/auth.js';

const router = express.Router();

router.get('/self', verifyToken, authorizeRoles('client'), async (req, res) => {
    try {
        const clientId = req.user.id;
        const role = req.user.role;
        const client = await getClientData(clientId, role);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error fetching client data:', error);
        res.status(500).json({ message: 'Error fetching client data' });
    }
});

router.put('/self', verifyToken, authorizeRoles('client'), async (req, res) => {
    try {
        const clientId = req.user.id;
        const role = req.user.role;
        const updatedClientData = req.body;

        const success = await updateClientData(clientId, updatedClientData,role);

        if (!success) {
            return res.status(404).json({ message: 'Client not found or update failed' });
        }

        res.json({ message: 'Client data updated successfully' });
    } catch (error) {
        console.error('Error updating client data:', error);
        res.status(500).json({ message: 'Error updating client data' });
    }
});

export default router;
