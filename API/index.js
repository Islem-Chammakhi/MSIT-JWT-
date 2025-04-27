const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes'); 
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));


// Routes
app.use('/api/auth', authRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});


async function connectDB() {
    try {
      await prisma.$connect();
      console.log('✅ Connecté à la base MySQL via Prisma');
    } catch (error) {
      console.error('❌ Erreur de connexion DB:', error);
      process.exit(1);
    }
  }

app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
  });

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('🔌 Déconnecté de Prisma');
    process.exit(0);
  });