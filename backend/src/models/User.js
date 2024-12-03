const mongoose = require('mongoose');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Garante que o username seja único
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,  // Nome do usuário
  },
  email: {
    type: String,
    required: true,
    unique: true,  // O email deve ser único
  },
  birthDate: {
    type: Date,
    required: true,  // Data de nascimento
  },
  cpf: {
    type: String,
    required: true,
    unique: true,  // CPF também deve ser único
  },
  isActive: {
    type: Boolean,
    default: true,  // Usuário ativo por padrão
  },
});

// Criando e exportando o modelo do usuário
module.exports = mongoose.model('User', userSchema);
