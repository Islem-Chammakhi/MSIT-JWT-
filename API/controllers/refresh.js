const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const {generateAccessTokens} = require('../tokens/accessToken'); 
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log('RefreshToken:', refreshToken);
  if (!refreshToken) {
    console.log('No refresh token provided');
    return res.status(401).json({ error: 'Aucun refresh token fourni' });
  }

  try {
    const session = await prisma.session.findFirst({
      where: { refreshToken, expiresAt: { gt: new Date() } },
    });
    console.log('Session:', session);
    if (!session) {
      console.log('Invalid or expired refresh token');
      return res.status(401).json({ error: 'Refresh token invalide ou expiré' });
    }

    const decoded = jwt.verify(refreshToken, process.env.RefreshToken);
    console.log('Decoded refresh token:', decoded);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const newAccessToken = generateAccessTokens(user.id);
    console.log('New accessToken generated:', newAccessToken);

    res
      .cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60 * 1000,
      })
      .json({ success: true });
    console.log('Refresh successful, new accessToken set');
  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.status(401).json({ error: 'Refresh token invalide' });
  }
};
  
  module.exports = { refreshToken };