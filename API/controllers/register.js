const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { validationResult } = require('express-validator');
const { validateRegister } = require('../validators/authValidators');
const { generateAccessTokens } = require('../tokens/accessToken');
const { generateRefreshTokens } = require('../tokens/refreshToken');
const { handleAuthErrors } = require('../utils/errorHandler');

const register = [
  ...validateRegister,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      console.log('Register attempt:', { email });

      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        });
        console.log('User created:', user.id);

        const accessToken = generateAccessTokens(user.id);
        const refreshToken = generateRefreshTokens(user.id);
        const { exp } = jwt.decode(refreshToken);
        console.log('Generated tokens:', { accessToken, refreshToken });

        await tx.session.create({
          data: {
            userId: user.id,
            refreshToken,
            userAgent: req.get('User-Agent') || 'unknown',
            ipAddress: req.ip || 'unknown',
            expiresAt: new Date(exp * 1000),
          },
        });
        console.log('Session created:', { userId: user.id, refreshToken });

        res
          .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000, // 15 min
          })
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
          });

        res.status(201).json({
          success: true,
          user: { id: user.id, email: user.email },
        });
        console.log('Registration successful, cookies set');
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      handleAuthErrors(error, res);
    }
  },
];

module.exports = { register };