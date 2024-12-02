const mongoose = require('mongoose');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Certifique-se de que o username seja único
  },
  password: {
    type: String,
    required: true,
  },
  // Outros campos podem ser adicionados conforme necessário (e.g. nome, email, etc)
});

// Criando e exportando o modelo do usuário
module.exports = mongoose.model('User', userSchema);
