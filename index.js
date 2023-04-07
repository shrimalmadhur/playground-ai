const express = require('express');
const alchemySdk = require("alchemy-sdk")

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: alchemySdk.Network.ETH_MAINNET,
};
const alchemy = new alchemySdk.Alchemy(config);


const app = express();
const sqlite3 = require('sqlite3').verbose();

const port = 3000;

const createDB = function() {
  let db = new sqlite3.Database('./db/sample.db');
  db.run('CREATE TABLE transactions(transaction_hash text, category text, asset text)');
  db.close();
}


const insertIntoDb = function(transfers) {
  // console.log(transfers)
  let db = new sqlite3.Database('./db/sample.db');
  let data = []
  transfers.forEach(element => {
    let eachData = {
      transaction_hash : element.hash,
      category: element.category,
      asset: element.asset
    }
    data.push(eachData);
  });

  console.log(data);
  // prepare the SQL statement with placeholders for each column
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');
  const sql = `INSERT INTO transactions (${Object.keys(data[0]).join(', ')}) VALUES (${placeholders})`;

  // begin a new transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // prepare the statement
    const stmt = db.prepare(sql);

    // iterate over each object in the data array and execute the statement with its values
    data.forEach(row => {
      stmt.run(Object.values(row));
    });

    // commit the transaction
    db.run('COMMIT');
    
    // close the statement and the database connection
    stmt.finalize();
    db.close();
  });


  // // insert one row into the langs table
  // db.run(`INSERT INTO transactions(transaction_hash, category) VALUES(?)`, ['C'], function(err) {
  //   if (err) {
  //     return console.log(err.message);
  //   }
  //   // get the last insert id
  //   console.log(`A row has been inserted with rowid ${this.lastID}`);
  // });
  // db.close();
}

const readAndPrint = function() {
  let db = new sqlite3.Database('./db/sample.db');
  let sql = `SELECT * from transactions limit 10`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.transaction_hash, row.category, row.asset);
    });
  });
  
  // close the database connection
  db.close();
}

const getTxData = async function(address) {
  const fromData = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    fromAddress: address,
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
  });
  // console.log(fromData);

  const toData = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toAddress: address,
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
  });
  console.log(toData);

  transferData = fromData.transfers.concat(toData.transfers);
  // console.log(transferData);

  return transferData;
}


// createDB();
// insertIntoDb();
// readAndPrint();

const main = async function() {
  createDB();
  let transferData = await getTxData("0x9e366e32b067a15a359c2c63f961ac8405cb8e2f");
  insertIntoDb(transferData)
}

// main();
readAndPrint()





// app.get('/', (req, res) => {
//   res.send('Hello World, from express');
// });

// app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))