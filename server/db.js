const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/football_analytics'
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
})

module.exports = pool;