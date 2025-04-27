const { authMiddleware } = require('../middlewares/authMiddleware');

const protectedRoute = [
    authMiddleware,
    async (req, res) => {
      res.json({
        message: 'Vous avez accès à cette route protégée ! 👌👌',
        user: req.user,
      });
    },
  ];
  
  module.exports = { protectedRoute };