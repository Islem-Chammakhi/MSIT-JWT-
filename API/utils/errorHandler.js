const handleAuthErrors = (error, res) => {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }
    console.error('Auth Error:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  };

module.exports = {handleAuthErrors};