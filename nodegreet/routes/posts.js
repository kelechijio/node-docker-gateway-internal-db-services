const express = require('express');
const router = express.Router();

// Get all posts
router.get('/', async function (req, res, next) {
  try {
    const { rows } = await req.db.query('SELECT * FROM posts');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single post by ID
router.get('/:id', async function (req, res, next) {
  const { id } = req.params;
  try {
    const { rows } = await req.db.query('SELECT * FROM posts WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
