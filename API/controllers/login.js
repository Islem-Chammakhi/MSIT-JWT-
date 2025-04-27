const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { validateLogin } = require('../validators/authValidators'); // Chemin relatif corrigé
const {generateAccessTokens} = require('../tokens/accessToken'); 
const {generateRefreshTokens} = require('../tokens/refreshToken');
const { handleAuthErrors } = require('../utils/errorHandler'); // Chemin relatif corrigé


const login = [
    ...validateLogin,
      async (req, res) => {
    // 1. Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const accessToken = generateAccessTokens(user.id);
      const refreshToken = generateRefreshTokens(user.id); 
      console.log(req.ip)
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
        }
      });

      res
        .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/', // Pour s'assurer que les cookies sont valables sur tout le domaine
            domain: process.env.NODE_ENV === 'production' ? '.votredomaine.com' : undefined,
            maxAge: 15 * 60 * 1000 
        })
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.votredomaine.com' : undefined,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
      console.log(user.sessions)
      res.json({
        success: true,
        user: { id: user.id, email: user.email }
      });

    } catch (error) {
      handleAuthErrors(error, res);
    }
  }
]

module.exports = {login}