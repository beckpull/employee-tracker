const { Pool } = require('pg');

const pool = new Pool (
    {
        user: 'guest',
        password: '1001',
        database: 'tracker_db',
        port: 5432
    },
    console.log('Connected to the tracker_db database.')
);

// pool.connect();

module.exports = pool;