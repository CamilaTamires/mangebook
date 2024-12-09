const User = require('../models/User');  // Importando o modelo User
const jwt = require('jsonwebtoken');  // Importando o JWT para gerar tokens


// Função para verificar a disponibilidade do nome de usuário
exports.checkUsername = async (req, res) => {
  const { username } = req.params; // Pega o nome de usuário da URL

  try {
    // Verifica se o nome de usuário já existe
    const existingUser = await User.findOne({ username });

    // Se o usuário existir, retorna que o nome não está disponível
    if (existingUser) {
      return res.status(200).json({ available: false });
    }

    // Se o nome de usuário não existir, retorna que está disponível
    return res.status(200).json({ available: true });

  } catch (error) {
    // Em caso de erro no banco de dados, retorna uma mensagem de erro
    console.error(error);
    return res.status(500).json({ error: 'Erro ao verificar disponibilidade do nome de usuário' });
  }
};

// Função para registrar o usuário
exports.registerUser = async (req, res) => {
  const { username, password, name, email, birthDate, cpf } = req.body;

  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome de usuário já está em uso' });
    }

    // Cria um novo usuário com nome de usuário e senha (sem criptografar)
    const newUser = new User({ username, password, name, email, birthDate, cpf });  // Senha em texto claro
    await newUser.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Função de login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;  // Pega os dados de username e senha enviados na requisição

  try {
    // Verifica se os dados de login foram fornecidos
    if (!username || !password) {
      return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    // Verifica se o usuário existe no banco
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Compara a senha fornecida com a senha em texto claro no banco de dados
    if (password !== user.password) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    // Gera o token JWT (aqui você pode adicionar um segredo e um tempo de expiração)
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,  // Usar o segredo armazenado no .env para mais segurança
      { expiresIn: '1h' }      // O token vai expirar após 1 hora
    );

    // Retorna o token gerado
    return res.status(200).json({ token });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

