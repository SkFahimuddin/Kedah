const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  res.json({ status: 'success', message: 'Route placeholder - implement controller' });
});

module.exports = router;
