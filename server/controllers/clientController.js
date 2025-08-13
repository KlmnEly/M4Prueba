// server/controllers/clientController.js
import pool from '../connection.js'; 

// Obtiene todos los clientes
const getClients = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clients');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtiene un cliente por su ID
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crea un nuevo cliente
const createClient = async (req, res) => {
    try {
        const { name, identification, address, phone_number, email } = req.body;
        // Validación de campos obligatorios
        if (!name || !identification || !address || !phone_number || !email) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const [result] = await pool.query(
            'INSERT INTO clients (name, identification, address, phone_number, email) VALUES (?, ?, ?, ?, ?)',
            [name, identification, address, phone_number, email]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualiza un cliente existente
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, identification, address, phone_number, email } = req.body;
        // Validación de campos obligatorios
        if (!name || !identification || !address || !phone_number || !email) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const [result] = await pool.query(
            'UPDATE clients SET name = ?, identification = ?, address = ?, phone_number = ?, email = ? WHERE id = ?',
            [name, identification, address, phone_number, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Elimina un cliente
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM clients WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export { createClient, deleteClient, getClientById, getClients, updateClient };
