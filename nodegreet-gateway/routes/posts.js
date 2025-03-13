const express = require('express');
const axios = require('axios');

const router = express.Router();

// Internal service URL from environment variable (or default)
const INTERNAL_SERVICE_URL = process.env.INTERNAL_SERVICE_URL || 'http://localhost:4000';

// Get all posts from the internal service
router.get('/', async function (req, res, next) {
  try {
    const response = await axios.get(`${INTERNAL_SERVICE_URL}/posts`);

    res.json({
      data: response.data,
      result_count: response.data.length,
      time_retrieved: new Date().toISOString(),
      status_code: response.status,
      request_status: 'success'
    });

  } catch (err) {
    console.error('Error fetching posts:', err.message);

    res.status(500).json({
      data: [],
      result_count: 0,
      time_retrieved: new Date().toISOString(),
      status_code: 500,
      request_status: 'error',
      error_message: 'Failed to fetch posts'
    });
  }
});

// Get a single post by ID from the internal service
router.get('/:id', async function (req, res, next) {
  const { id } = req.params;

  try {
    const response = await axios.get(`${INTERNAL_SERVICE_URL}/posts/${id}`);

    res.json({
      data: response.data,
      result_count: response.data ? 1 : 0,
      time_retrieved: new Date().toISOString(),
      status_code: response.status,
      request_status: 'success'
    });

  } catch (err) {
    console.error(`Error fetching post with ID ${id}:`, err.message);

    const status = err.response ? err.response.status : 500;

    res.status(status).json({
      data: null,
      result_count: 0,
      time_retrieved: new Date().toISOString(),
      status_code: status,
      request_status: 'error',
      error_message: `Failed to fetch post with ID ${id}`
    });
  }
});

module.exports = router;
