require('dotenv').config();  // Carregar variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');  // Importando as rotas de autenticação
const bookRoutes = require('./routes/bookRoutes');  // Rotas de livros

const app = express();

// Middleware
app.use(cors());  // Permite que o front-end se comunique com o backend
app.use(express.json());  // Permite que o servidor entenda dados JSON


// Configuração das rotas
app.use('/api/auth', authRoutes);  // Rota de autenticação
app.use('/api/books', bookRoutes);  // Rota de livros

// Conectando ao MongoDB usando a URL do banco de dados do .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado ao MongoDB');
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
  process.exit(1);  // Encerra o servidor se não conseguir conectar ao banco
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ocorreu um erro no servidor' });
});

// Iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
