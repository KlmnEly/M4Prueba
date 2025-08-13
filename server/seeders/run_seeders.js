import { pool } from "../connection.js";
import { loadBanks } from "./load_banks.js";
import { loadBills } from "./load_bills.js";
import { loadClients } from "./load_clients.js";
import { loadStates } from "./load_states.js";
import { loadTransactionTypes } from "./load_transaction_types.js";
import { loadTransactions } from "./load_transactions.js";

(async () => {
    try {
        console.log('loading seeders...');
        await loadBanks();
        await loadBills();
        await loadClients();
        await loadStates();
        await loadTransactionTypes();
        await loadTransactions();
        console.log('seeders loaded successfully');
        return
    } catch (error) {
        console.error('Imposible load seeder: ', error.message);
    } finally {
        await pool.end();
        console.log('Connection closed');
    }
})();