const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log('AccessToken:', token);
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Accès non autorisé - Token manquant' });
  }

  if (!process.env.AccessToken) {
    console.error('JWT_SECRET is not defined');
    return res.status(500).json({ error: 'Erreur serveur: configuration manquante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.AccessToken);
    console.log('Decoded token:', decoded);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      console.log('User not found');
      throw new Error('Utilisateur introuvable');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired, requesting refresh');
      return res.status(401).json({ 
        error: 'Session expirée',
        action: 'refresh_token',
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(401).json({ 
      error: 'Token invalide',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { authMiddleware };