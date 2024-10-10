const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar usuário.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Senha inválida.' });

        // Gerar o token usando a chave secreta correta.
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao realizar login.' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email']
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter perfil do usuário' });
    }
};

module.exports = { register, login, getUserProfile };
