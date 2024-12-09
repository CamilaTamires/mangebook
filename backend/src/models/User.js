const mongoose = require('mongoose');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Garante que o username seja único
    trim: true,    // Remove espaços extras
  },
  password: {
    type: String,
    required: true,
    minlength: 6,  // Senha com pelo menos 6 caracteres
  },
  name: {
    type: String,
    required: true,  // Nome do usuário
    trim: true,      // Remove espaços extras
  },
  email: {
    type: String,
    required: true,
    unique: true,  // O email deve ser único
    match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um email válido'],  // Validação de email
  },
  birthDate: {
    type: Date,
    required: true,  // Data de nascimento
  },
  cpf: {
    type: String,
    required: true,
    unique: true,  // CPF também deve ser único
    match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Por favor, insira um CPF válido'],  // Validação do CPF
  },
  isActive: {
    type: Boolean,
    default: true,  // Usuário ativo por padrão
  },
  nivel: {
    type: String,
    required: true,
    enum: ['admin', 'aluno'],  // Restringe o valor a 'admin' ou 'aluno'
    default: 'aluno',  // Valor padrão será 'aluno'
  },
}, { timestamps: true });  // Adiciona os campos createdAt e updatedAt automaticamente

// Criando e exportando o modelo do usuário
module.exports = mongoose.model('User', userSchema);
