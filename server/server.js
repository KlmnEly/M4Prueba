import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Qwe.123*',
    database: 'pd_kelmin_miranda_tayrona'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to database');
});

// ------------------- CRUD for Clients -------------------

// Create
app.post('/api/v1/clients', (req, res) => {
    const { name, identification, address, phone_number, email } = req.body;
    if (!name || !identification || !address || !phone_number || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    db.query(
        'INSERT INTO clients (name, identification, address, phone_number, email) VALUES (?, ?, ?, ?, ?)',
        [name, identification, address, phone_number, email],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id_client: result.insertId, name, identification, address, phone_number, email });
        }
    );
});

// Read all
app.get('/api/v1/clients', (req, res) => {
    db.query('SELECT * FROM clients', (err, results) => {
        if (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Read one
app.get('/api/v1/clients/:id', (req, res) => {
    db.query('SELECT * FROM clients WHERE id_client = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// Update
app.put('/api/v1/clients/:id', (req, res) => {
    const { name, identification, address, phone_number, email } = req.body;
    db.query(
        'UPDATE clients SET name=?, identification=?, address=?, phone_number=?, email=? WHERE id_client=?',
        [name, identification, address, phone_number, email, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Client updated successfully' });
        }
    );
});

// Delete
app.delete('/api/v1/clients/:id', (req, res) => {
    db.query('DELETE FROM clients WHERE id_client=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Client deleted successfully' });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});