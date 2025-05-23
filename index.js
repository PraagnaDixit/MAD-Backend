require('dotenv').config();

// index.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Neon PostgreSQL
const pool = new Pool({

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  host: process.env.DB_HOST,

  database: process.env.DB_NAME,

  port: process.env.DB_PORT,

  ssl: {

    rejectUnauthorized: false,

  },

});

// GET /rides - fetch all rides
app.get('/rides', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rides');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /rides - add a new ride
app.post('/rides', async (req, res) => {

  const { id, start_location, end_location, transport_type } = req.body;



  try {

    const result = await pool.query(

      'INSERT INTO rides (id, start_location, end_location, transport_type) VALUES ($1, $2, $3, $4) RETURNING *',

      [id, start_location, end_location, transport_type]

    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error('Insert error:', err);

    res.status(500).json({ error: err.message });

  }

});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
