const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const logout = async (req, res) => {
  try {
    // 1. Récupérer le refreshToken depuis les cookies
    const refreshToken = req.cookies.refreshToken;

    const user = await prisma.user.findFirst({
        where: {
          sessions: {
            some: { refreshToken: refreshToken } // Recherche dans les tokens associés
            }
        }
    });
    if (user) {
        await prisma.session.deleteMany({ where: { userId: user.id } });
    }


    // 3. Nettoyer les cookies côté client
    res
      .clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })
      .status(200)
      .json({ success: true, message: 'Déconnexion réussie' });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la déconnexion',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {logout};