const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = {
  generateAccessTokens: (userId) => {
    return jwt.sign(
      { userId },
      process.env.AccessToken, // Corrigez le nom de la variable si nécessaire
      { expiresIn: '15m' }
    );
  }
};