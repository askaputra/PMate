const statsService = require('../services/statsService');

const getStats = (req, res) => {
  try {
    const stats = statsService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStats };