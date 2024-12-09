<template>
  <!-- Contêiner principal do formulário de login -->
  <div class="login-container">
    <!-- Caixa de login -->
    <div class="login-box">
      <!-- Logo da aplicação -->
      <img src="../assets/logo.png" alt="Logo" class="logo" />
      <h1>Arvoreteca</h1>
      
      <!-- Formulário de login -->
      <form @submit.prevent="handleFormSubmit">
        <!-- Campo para inserir o username -->
        <div class="input-container">
          <label for="username">Usuário</label>
          <input v-model="username" type="text" id="username" placeholder="Nome de usuário" required />
        </div>

        <!-- Campo para inserir a senha -->
        <div class="input-container">
          <label for="password">Senha</label>
          <input v-model="password" type="password" id="password" placeholder="Sua senha" required />
        </div>

        <!-- Mensagem de erro ou sucesso -->
        <div v-if="message" :class="{'message error': isError, 'message success': !isError}">
          {{ message }}
        </div>

        <!-- Botão para enviar o formulário (login) -->
        <button type="submit">{{ isLoginMode ? 'Entrar' : 'Cadastrar-se' }}</button>
      </form>
      
      <!-- Link para alternar entre login e cadastro -->
      <button type="button" @click="toggleMode">
        {{ isLoginMode ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entrar' }}
      </button>
    </div>
  </div>

  
</template>

<script>
// Importação do axios, uma biblioteca para fazer requisições HTTP
import axios from '@/axios';  // Certifique-se de que o axios está configurado corretamente.


export default {
  data() {
    return {
      username: '',  // Armazena o username do usuário
      password: '',  // Armazena a senha do usuário
      message: '',    // Armazena mensagens para exibir ao usuário (sucesso ou erro)
      isError: false,  // Flag para determinar se é erro
      isLoginMode: true, // Flag para controlar o modo (login ou cadastro)
    };
  },
  methods: {
    // Método para verificar se o login ou o cadastro deve ser realizado
    async handleFormSubmit() {
      if (this.isLoginMode) {
        this.loginUser();  // Se estiver no modo de login
      } else {
        this.registerUser();  // Se estiver no modo de cadastro
      }
    },

    // Método para realizar o login
    async loginUser() {
      try {
        const response = await axios.post('auth/login', {
          username: this.username,
          password: this.password,
        });

      

        // Verifica se a resposta contém o token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);  // Salva o token no localStorage
          this.$router.push('/home');  // Redireciona para a página de principal
        } else {
          this.isError = true;
          this.message = 'Erro ao fazer login: Token não encontrado';
        }
      } catch (error) {
        this.isError = true;
        // A mensagem de erro agora captura tanto a resposta quanto a mensagem de erro geral
        this.message = 'Erro ao fazer login: ' + (error.response ? error.response.data.message : error.message);
      }
    },

    // Método para registrar o usuário
    async registerUser() {
      try {
        // Verifica se o nome de usuário está disponível para registro
        const checkResponse = await axios.get(`auth/check-username/${this.username}`);
        if (!checkResponse.data.available) {
          this.isError = true;
          this.message = 'Usuário já existe. Escolha outro nome de usuário.';
          return;
        }

        // Realiza o cadastro se o nome de usuário estiver disponível
        const response = await axios.post('/auth/register', {
          username: this.username,
          password: this.password,
        });

        // Usa a variável response para algo adicional
        console.log(response); // Loga a resposta no console ou usa um valor de resposta aqui

        // Definindo a mensagem de sucesso
        this.isError = false;
        this.message = 'Usuário cadastrado com sucesso!';
        this.$router.push('/home');  // Redireciona para a página principal
      } catch (error) {
        this.isError = true;
        this.message = 'Erro ao cadastrar usuário: ' + (error.response ? error.response.data.message : error.message);
      }
    },

    // Alterna entre os modos de login e cadastro
    toggleMode() {
      this.isLoginMode = !this.isLoginMode;
      this.message = '';  // Limpa a mensagem de erro ou sucesso ao trocar de modo
    },
  },
};
</script>

<style scoped>
/* Estilos para o contêiner principal do login, com imagem de fundo */
.login-container {
  background-image: url('../assets/fundoNote.png');  /* Define uma imagem de fundo */
  background-size: cover;  /* Faz com que a imagem cubra toda a área */
  height: 100vh;  /* Define a altura da página como 100% da altura da janela */
  display: flex;  /* Usa flexbox para centralizar o conteúdo */
  justify-content: center;  /* Centraliza horizontalmente */
  align-items: center;  /* Centraliza verticalmente */
}

/* Estilos para a caixa de login */
.login-box {
  background-color: rgba(118, 24, 19, 1);  /* Cor de fundo vermelha */
  padding: 20px;  /* Espaçamento interno */
  border-radius: 10px;  /* Bordas arredondadas */
  text-align: center;  /* Centraliza o texto dentro da caixa */
  width: 70%;  /* Largura percentual */
  max-width: 500px;  /* Define um limite máximo de largura */
}

/* Estilos para o logo da aplicação */
.logo {
  width: 100px;  /* Largura do logo */
  height: 100px;  /* Altura do logo */
}

/* Estilos para o título da página */
h1 {
  color: white;  /* Cor do texto */
  margin-top: 10px;  /* Espaçamento superior */
  font-size: 2em;  /* Tamanho da fonte */
}

/* Estilos para os campos de entrada de dados */
.input-container {
  color: rgb(230, 220, 207);  /* Cor de fundo do botão */
  margin-bottom: 20px;  /* Espaçamento inferior entre os campos */
}

input {
  width: 95%;  /* Faz com que o campo ocupe toda a largura disponível */
  padding: 10px;  /* Espaçamento interno */
  margin-top: 5px;  /* Espaçamento superior */
  border-radius: 4px;  /* Bordas arredondadas */
  border: 1px solid #ccc;  /* Borda cinza clara */
}

/* Estilos para os botões */
button {
  width: 100%;  /* Faz o botão ocupar toda a largura disponível */
  padding: 10px;  /* Espaçamento interno */
  background-color: rgba(183, 145, 88, 1);  /* Cor de fundo do botão */
  color: white;  /* Cor do texto */
  border: none;  /* Remove bordas do botão */
  border-radius: 4px;  /* Bordas arredondadas */
  margin-top: 10px;  /* Espaçamento superior */
}

/* Estilo para o botão ao passar o mouse sobre ele */
button:hover {
  background-color: #0056b3;  /* Altera a cor de fundo para azul quando o mouse passa sobre o botão */
}

/* Estilo para mensagens de erro ou sucesso */
.message {
  color: green;
  margin-top: 20px;
  font-size: 1.2em;
}

.message.error {
  color: red;
}
</style>
