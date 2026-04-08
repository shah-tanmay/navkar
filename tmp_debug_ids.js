require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  connectionString: "postgres://postgres:password@localhost:32768/postgres"
});
client.connect()
  .then(() => client.query('SELECT id, name FROM products LIMIT 5;'))
  .then(res => {
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
