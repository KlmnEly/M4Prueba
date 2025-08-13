import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection.js";

export async function loadStates() {
    const fileRute = path.resolve('SERVER/DATA/states.csv');
    const states = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(fileRute).pipe(csv({ separator: ';' })).on('data', (row) => {
            states.push([
                row.id_status,
                row.name
            ]);
        }).on('end', async () => {
            try {
                const sql = 'INSERT INTO states (id_status, name) VALUES ?;';
                const [results] = await pool.query(sql, [states]);
                console.log(`se insertaron ${results.affectedRows} states`);
                resolve();
            } catch (error) {
                console.error('error al insertar states: ', error.message);
                reject(error);
            }
        }).on('error', (error) => {
            console.error('error al intentar leer archivo: ', error.message);
            reject(error);
        });
    });
}