const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Supondo que você tem um modelo de usuário
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');  // Para proteger as rotas
const router = express.Router();


// Rota para verificar disponibilidade do nome de usuário
router.get('/check-username/:username', authController.checkUsername);

// Rota para registrar um novo usuário (sem bcrypt, com senha simples)
router.post('/register', async (req, res) => {
  const { username, password, name, email, birthDate, cpf } = req.body;

  try {
    const user = new User({
      username,
      password,  // A senha será armazenada em texto simples, como solicitado
      name,
      email,
      birthDate,
      cpf,
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

// Rota protegida - Exemplo de como você pode usar o middleware de autenticação
router.get('/users', async (req, res) => {
  try {
    const user = await User.findOne();  // Isto retorna um único usuário.
    return res.json([user]);  // Envolve o usuário em um array.
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});


module.exports = router;
