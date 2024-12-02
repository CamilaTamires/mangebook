import axios from 'axios';
import router from '@/router';  // Importando o Vue Router, caso use

// Criação da instância do Axios com a base URL configurada
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',  // Garantir que o tipo de conteúdo seja JSON
  },
});

// Adicionando o token JWT no header de todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar as respostas de erro globalmente
api.interceptors.response.use(
  response => response,  // Retorna a resposta normalmente
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Token expirado ou inválido, redirecionando para login...');
        // Usando Vue Router para redirecionar em vez de window.location.href
        router.push('/login');
      } 
      else if (error.response.status === 500) {
        console.error('Erro no servidor, tente novamente mais tarde');
        // Aqui você pode adicionar uma notificação mais amigável ao usuário
      } 
      else if (error.response.status === 400) {
        console.error('Requisição inválida');
      }
    } else {
      console.error('Erro de rede ou configuração', error);
      // Trate casos específicos de erro de rede, como ECONNREFUSED
    }

    return Promise.reject(error);
  }
);

export default api;
