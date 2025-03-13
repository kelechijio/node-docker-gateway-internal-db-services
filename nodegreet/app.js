const express = require('express');
const logger = require('morgan');
const { Pool } = require('pg');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');

const app = express();

app.use(logger('dev'));
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'kc',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.POSTGRES_DB || 'kcdb',
    password: process.env.POSTGRES_PASSWORD || 'kcpass',
    port: 5432,
});

// Function to initialize the database
const initDB = async () => {
    try {
        const client = await pool.connect();

        await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL
      );
    `);

        const { rows } = await client.query('SELECT COUNT(*) FROM posts');
        if (parseInt(rows[0].count) === 0) {
            await client.query(`
                INSERT INTO posts (title, description)
                VALUES ('Post 1 here', 'Description for Post 1'),
                       ('Post 2 ouu', 'Description for Post 2'),
                       ('Post 3 thanks', 'Description for Post 3'),
                       ('Post 4 yaay', 'Description for Post 4'),
                       ('Post 5 haloo', 'Description for Post 5'),
                       ('Post 6 daddyy', 'Description for Post 6'),
                       ('Post 7 osess', 'Description for Post 7'),
                       ('Post 8 posted', 'Description for Post 8'),
                       ('Post 9 later!', 'Description for Post 9'),
                       ('Post 10 finally!', 'Description for Post 10');
            `);
            console.log('Database seeded with initial data.');
        }

        console.log('Database initialized.');
        client.release();
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
};

// Initialize DB on startup
initDB();

// Middleware to pass DB connection to routes
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// Routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);

module.exports = app;
