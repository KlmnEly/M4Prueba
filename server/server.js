// Importa las librerías necesarias
import cors from 'cors';
import express from 'express';
// Importa la conexión a la base de datos
import pool from './connection.js';
// Importa las rutas de la API
import clientsRoutes from './routes/clientsRoutes.js'; // Asegúrate de que esta ruta es correcta

const app = express();

// --- Configuración de middlewares ---
// Permite que la API sea consumida por aplicaciones en diferentes dominios
app.use(cors());
// Middleware CRUCIAL: Permite a Express analizar el cuerpo de las peticiones JSON
app.use(express.json());

// --- Configuración de rutas ---
const PORT = 3000;
const api_version = '/api/v1';

// Ruta de prueba
app.get(`${api_version}`, async (req, res) => {
    res.send('Server online');
});

// Usa las rutas de los clientes
app.use(`${api_version}/clients`, clientsRoutes);

// Escucha en el puerto especificado
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
