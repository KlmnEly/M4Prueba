import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection.js";

export async function loadTransactionTypes() {
    const fileRute = path.resolve('SERVER/DATA/transaction_types.csv');
    const transaction_types = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(fileRute).pipe(csv({ separator: ';' })).on('data', (row) => {
            transaction_types.push([
                row.id_type_transaction,
                row.name
            ]);
        }).on('end', async () => {
            try {
                const sql = 'INSERT INTO transaction_types (id_type_transaction, name) VALUES ?;';
                const [results] = await pool.query(sql, [transaction_types]);
                console.log(`se insertaron ${results.affectedRows} transaction_types`);
                resolve();
            } catch (error) {
                console.error('error al insertar transaction_types: ', error.message);
                reject(error);
            }
        }).on('error', (error) => {
            console.error('error al intentar leer archivo: ', error.message);
            reject(error);
        });
    });
}