const express = require('express');
const router = express.Router();
const {register} = require('../controllers/register');
const {login} = require('../controllers/login');
const {logout} = require('../controllers/logout');
const {refreshToken} = require('../controllers/refresh');
const {checkAuth} = require('../controllers/checkAuth');
const {protectedRoute} = require('../controllers/protectedRoute');
const {authMiddleware} = require('../middlewares/authMiddleware');


router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

router.get('/check-auth', checkAuth);

router.get('/protected', authMiddleware, protectedRoute);

module.exports = router;