const statsService = require('../services/statsService');

const getStats = async (req, res) => {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStats };