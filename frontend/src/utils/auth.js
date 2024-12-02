// Função que verifica se o usuário está autenticado
export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

// Função para realizar o logout do usuário
export function logout() {
  // Remove o item 'token' do localStorage para desautenticar o usuário
  localStorage.removeItem('token');
  
  // Redireciona o usuário para a página de login (rota '/')
  window.location.href = '/'; // Aqui, o usuário será redirecionado para o login após o logout
}

