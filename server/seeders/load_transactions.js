import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection.js";

export async function loadTransactions() {
    const fileRute = path.resolve('SERVER/DATA/transactions.csv');
    const transactions = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(fileRute).pipe(csv({ separator: ';' })).on('data', (row) => {
            transactions.push([
                row.id_transaction,
                row.code,
                row.status_id,
                row.transaction_type_id,
                row.bank_id,
                row.client_id,
                row.bill_id,
                row.transaction_amount,
                row.date_time
            ]);
        }).on('end', async () => {
            try {
                const sql = 'INSERT INTO transactions (id_transaction, code, status_id, transaction_type_id, bank_id, client_id, bill_id, transaction_amount, date_time) VALUES ?;';
                const [results] = await pool.query(sql, [transactions]);
                console.log(`se insertaron ${results.affectedRows} transactions`);
                resolve();
            } catch (error) {
                console.error('error al insertar transactions: ', error.message);
                reject(error);
            }
        }).on('error', (error) => {
            console.error('error al intentar leer archivo: ', error.message);
            reject(error);
        });
    });
}