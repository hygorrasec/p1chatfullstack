const express = require('express');
const { register, login, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/user');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/profile/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId, {
            attributes: ['name'],
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
    }
});

module.exports = router;
