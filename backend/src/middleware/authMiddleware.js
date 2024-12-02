const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Verifica se o token está presente no cabeçalho Authorization
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  // Se o token não estiver presente, retorna "Acesso negado"
  if (!token) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  try {
    // Decodifica o token
    const decoded = jwt.verify(token, 'seu_segredo');  // Substitua 'seu_segredo' por uma chave secreta segura
    req.userId = decoded.userId;  // Adiciona o ID do usuário na requisição
    next();  // Passa para o próximo middleware ou rota
  } catch (error) {
    // Se o token for inválido, retorna erro de "Token inválido"
    return res.status(401).json({ message: 'Token inválido' });
  }
};
