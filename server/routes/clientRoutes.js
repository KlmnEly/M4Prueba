// server/routes/clientRoutes.js
import { Router } from 'express';
import { createClient, deleteClient, getClientById, getClients, updateClient } from '../controllers/clientController.js';

const router = Router();

// Rutas CRUD para clientes
router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;