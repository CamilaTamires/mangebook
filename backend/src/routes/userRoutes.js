const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rota para atualizar o usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, name, email, birthDate, cpf, isActive, nivel } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { username, name, email, birthDate, cpf, isActive, nivel },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Rota para retornar todos os usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Isso retorna todos os usuários
    return res.json(users);  // Retorna todos os usuários no formato de um array
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});



module.exports = router;
