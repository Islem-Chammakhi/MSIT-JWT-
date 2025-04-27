const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = {
   generateRefreshTokens: (userId) => {
      return jwt.sign(
      { userId },
      process.env.RefreshToken,
    { expiresIn: '7d' } // Refresh token long
  );
}
}
