const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Singleton Prisma (meilleures performances)
let prismaInstance;

const getPrisma = () => {
  if (!prismaInstance) prismaInstance = new PrismaClient();
  return prismaInstance;
};

exports.validateRegister = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail()
    .custom(async (email) => {
      try {
        const existingUser = await getPrisma().user.findUnique({
          where: { email },
          select: { id: true },
        });
        if (existingUser) {
          console.log('Validation failed: Email already exists:', email);
          throw new Error('Email déjà utilisé');
        }
        console.log('Email validation passed:', email);
      } catch (error) {
        console.error('Database error during email validation:', error);
        throw new Error('Erreur de validation');
      }
    }),

  body('password')
    .isLength({ min: 8 }).withMessage('8 caractères minimum')
    .matches(passwordRegex).withMessage('Doit contenir 1 majuscule, 1 chiffre et 1 caractère spécial'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        console.log('Validation failed: Passwords do not match', {
          password: req.body.password,
          confirmPassword: value,
        });
        throw new Error('Les mots de passe ne correspondent pas');
      }
      console.log('Password confirmation validation passed');
      return true;
    }),
];

exports.validateLogin = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Mot de passe requis'),
];