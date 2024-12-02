const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Supondo que você tem um modelo de usuário
const authController = require('../controllers/authController');
const router = express.Router();


// Rota para verificar disponibilidade do nome de usuário
router.get('/check-username/:username', authController.checkUsername);

// Rota para registrar um novo usuário (sem bcrypt, com senha simples)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({
      username,
      password  // A senha aqui será em texto puro, mas você pode optar por criptografar mais tarde
    });

    await user.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
});

// Rota para login de usuário
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica a senha sem criptografia (em texto simples)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Cria um token JWT
    const token = jwt.sign({ userId: user._id }, 'seu_segredo', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar logar', error });
  }
});


module.exports = router;
