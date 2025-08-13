import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection.js";

export async function loadBanks() {
    const fileRute = path.resolve('SERVER/DATA/banks.csv');
    const banks = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(fileRute).pipe(csv({ separator: ';' })).on('data', (row) => {
            banks.push([
                row.id_bank,
                row.name
            ]);
        }).on('end', async () => {
            try {
                const sql = 'INSERT INTO banks (id_bank, name) VALUES ?;';
                const [results] = await pool.query(sql, [banks]);
                console.log(`se insertaron ${results.affectedRows} banks`);
                resolve();
            } catch (error) {
                console.error('error al insertar banks: ', error.message);
                reject(error);
            }
        }).on('error', (error) => {
            console.error('error al intentar leer archivo: ', error.message);
            reject(error);
        });
    });
}