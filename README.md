This is a project to promote learning, we use technologies  **MySQL**, **Node.js** y **Express**. It also has **automatic file CSV upload**

---

## 🚀 Configuration and install

## Structure
```
    ├── package.json
    ├── package-lock.json
    ├── public
    │   ├── clients.js
    │   └── index.html
    ├── README.md
    ├── script.sql
    └── server
        ├── controllers
        │   └── clientController.js
        ├── data
        │   ├── banks.csv
        │   ├── bills.csv
        │   ├── clients.csv
        │   ├── states.csv
        │   ├── transactions.csv
        │   └── transaction_types.csv
        ├── routes
        │   └── clientRoutes.js
        ├── seeders
        │   ├── load_banks.js
        │   ├── load_bills.js
        │   ├── load_clients.js
        │   ├── load_states.js
        │   ├── load_transactions.js
        │   ├── load_transaction_types.js
        │   └── run_seeders.js
        └── server.js
```

### 1. Clone the repository
```bash
git clone https://github.com/KlmnEly/M4Prueba.git
cd M4Prueba
```

### 2. Install dependences
```bash
npm install
```
### 3. Create DATABASE

Import the file `script.sql` from your database gestor.

---

## 4. Modify the database credentials for the conection in the "server.js" file
``` 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Qwe.123*',
    database: 'pd_kelmin_miranda_tayrona'
});
```

## 5. Inserting data with seeders

Execute the next command for load the data from the files `.csv` in this route `server/data/`:

```bash
npm run seed
```

This script execute `server/seeders/run_seeders.js` for fill the database with initial datas.

---

## 🖥️ Start the Server

```bash
npm start
```

The server is avaliable in:  
```
http://localhost:3000/api/v1/
```

---

## 🔧 Scripts Utils

| Comando         | Descripción                                 |
|----------------|---------------------------------------------|
| `npm start`  | Star server                                    |
| `npm run seed` | Execute initial datas (CSV)                  |

---

## 🧠 technologies

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [MySQL2 (driver)](https://www.npmjs.com/package/mysql2)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
---