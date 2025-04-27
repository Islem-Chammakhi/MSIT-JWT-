const { authMiddleware } = require('../middlewares/authMiddleware');

const checkAuth = [authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
}];

module.exports = { checkAuth };