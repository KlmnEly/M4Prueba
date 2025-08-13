import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection.js";

export async function loadClients() {
    const fileRute = path.resolve('SERVER/DATA/clients.csv');
    const clients = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(fileRute).pipe(csv({ separator: ';' })).on('data', (row) => {
            clients.push([
                row.id_client,
                row.name,
                row.identification,
                row.address,
                row.phone_number,
                row.email
            ]);
        }).on('end', async () => {
            try {
                const sql = 'INSERT INTO clients (id_client, name, identification, address, phone_number, email) VALUES ?;';
                const [results] = await pool.query(sql, [clients]);
                console.log(`se insertaron ${results.affectedRows} clients`);
                resolve();
            } catch (error) {
                console.error('error al insertar clients: ', error.message);
                reject(error);
            }
        }).on('error', (error) => {
            console.error('error al intentar leer archivo: ', error.message);
            reject(error);
        });
    });
}