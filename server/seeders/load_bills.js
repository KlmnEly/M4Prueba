import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection.js";

export async function loadBills() {
    const fileRute = path.resolve('SERVER/DATA/bills.csv');
    const bills = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(fileRute).pipe(csv({ separator: ';' })).on('data', (row) => {
            bills.push([
                row.id_bill,
                row.num_bill,
                row.bill_period,
                row.invoiced_amount,
                row.amount_paid
            ]);
        }).on('end', async () => {
            try {
                const sql = 'INSERT INTO bills (id_bill, num_bill, bill_period, invoiced_amount, amount_paid) VALUES ?;';
                const [results] = await pool.query(sql, [bills]);
                console.log(`se insertaron ${results.affectedRows} bills`);
                resolve();
            } catch (error) {
                console.error('error al insertar bills: ', error.message);
                reject(error);
            }
        }).on('error', (error) => {
            console.error('error al intentar leer archivo: ', error.message);
            reject(error);
        });
    });
}