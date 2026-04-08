import pkg from 'pg';
const { Pool } = pkg;
// Manually copying connection logic from navkar-backend/config.js and src/db/index.js
const pool = new Pool({
  connectionString: "postgres://postgres:password@localhost:32768/postgres"
});

async function diagnose() {
  const targetId = '97427585-8334-48e8-b4a4-1500024518e4';
  console.log(`Target ID: [${targetId}]`);

  try {
    const res = await pool.query('SELECT id, name FROM products');
    console.log(`Total products: ${res.rows.length}`);
    
    let found = false;
    res.rows.forEach(row => {
      const dbId = row.id.toString();
      const match = dbId === targetId;
      console.log(`- ID in DB: [${dbId}] (Length: ${dbId.length}) Match: ${match}`);
      if (match) found = true;
      
      // Check for hidden characters
      if (dbId.trim() === targetId.trim()) {
         console.log(`  !!! TRIM MATCH FOUND !!! [${dbId.trim()}]`);
      }
    });

    if (!found) {
      console.log('No exact match found in the first batch.');
    }
    
    // Test the specific query used in ProductAccessor
    const testQuery = await pool.query('SELECT id FROM products WHERE id::text = $1', [targetId]);
    console.log(`Direct query (id::text = $1) result count: ${testQuery.rows.length}`);

  } catch (err) {
    console.error('Error during diagnosis:', err);
  } finally {
    await pool.end();
  }
}

diagnose();
