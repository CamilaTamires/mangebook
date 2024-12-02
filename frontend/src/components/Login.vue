<template>
  <!-- Contêiner principal da página de login -->
  <div class="login-container">
    <!-- Caixa de login onde o conteúdo será exibido -->
    <div class="login-box">
      <!-- Logo da aplicação -->
      <img src="../assets/img_logo.png" alt="Logo" class="logo" />
      
      <!-- Título da página -->
      <h1>Arvoreteca</h1>

      <!-- Formulário de login, que chama a função loginUser quando enviado -->
      <form @submit.prevent="loginUser">
        
        <!-- Container do campo de email -->
        <div class="input-container">
          <label for="email">Usuário</label>
          <!-- Campo para o usuário inserir o email, vinculado ao modelo de dados 'email' -->
          <input v-model="email" type="email" id="email" placeholder="Digite seu email" required />
        </div>

        <!-- Container do campo de senha -->
        <div class="input-container">
          <label for="password">Senha</label>
          <!-- Campo para o usuário inserir a senha, vinculado ao modelo de dados 'password' -->
          <input v-model="password" type="password" id="password" placeholder="Digite sua senha" required />
        </div>

        <!-- Botão para enviar o formulário -->
        <button type="submit">Entrar</button>
        
        <!-- Botão para redirecionar o usuário para a página de recuperação de senha -->
        <button type="button" @click="forgotPassword">Esqueci a senha</button>
      </form>
    </div>
  </div>
</template>

<script>
// Importando a instância do axios para fazer requisições HTTP
import axios from '@/axios'; // Certifique-se de que axios está configurado corretamente

export default {
  name: 'Login', // Nome do componente
  data() {
    return {
      email: '', // Variável para armazenar o email inserido pelo usuário
      password: '', // Variável para armazenar a senha inserida pelo usuário
    };
  },
  methods: {
    // Método que será chamado ao enviar o formulário de login
    async loginUser() {
      try {
        // Fazendo uma requisição POST para o backend com o email e senha
        const response = await axios.post('/login', {
          email: this.email, // Passando o email inserido no formulário
          password: this.password, // Passando a senha inserida no formulário
        });

        // Se a requisição for bem-sucedida, o token é armazenado no localStorage
        // Esse token pode ser usado para autenticar o usuário nas próximas requisições
        localStorage.setItem('token', response.data.token);

        // Após salvar o token, o usuário é redirecionado para o Dashboard
        // O Vue Router é usado para fazer o redirecionamento para a página '/dashboard'
        this.$router.push('/dashboard');
      } catch (error) {
        // Se ocorrer algum erro, logamos o erro no console para fins de depuração
        console.error('Erro ao fazer login', error);
      }
    },

    // Método chamado ao clicar no botão "Esqueci a senha"
    // O Vue Router redireciona o usuário para a página de recuperação de senha
    forgotPassword() {
      this.$router.push('/forgot-password'); // Redireciona para a página de recuperação de senha
    }
  }
};
</script>

<style scoped>
/* Estilo do contêiner principal da tela de login */
.login-container {
  background-image: url('@/assets/img_fundoNote.png'); /* Define a imagem de fundo */
  background-size: cover; /* Faz a imagem cobrir toda a tela */
  height: 100vh; /* Define a altura da tela para 100% da altura da viewport */
  display: flex; /* Usando flexbox para centralizar o conteúdo */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
}

/* Estilo da caixa de login */
.login-box {
  background-color: rgba(118, 24, 19, 1); /* Cor de fundo com um tom de vermelho */
  padding: 20px; /* Adiciona um espaço interno */
  border-radius: 10px; /* Borda arredondada para dar um efeito mais suave */
  text-align: center; /* Centraliza o texto dentro da caixa */
}

/* Estilo do logo da aplicação */
.logo {
  width: 100px; /* Define a largura do logo */
  height: 100px; /* Define a altura do logo */
}

/* Estilo do título da página */
h1 {
  color: white; /* Cor do texto */
  margin-top: 10px; /* Espaço acima do título */
  font-size: 2em; /* Define o tamanho da fonte */
}

/* Estilo do container dos campos de entrada */
.input-container {
  margin-bottom: 20px; /* Adiciona um espaço abaixo de cada campo de entrada */
}

/* Estilo dos campos de entrada (email e senha) */
input {
  width: 100%; /* Faz os campos de entrada ocuparem toda a largura disponível */
  padding: 10px; /* Adiciona espaço dentro do campo */
  margin-top: 5px; /* Adiciona um pequeno espaço acima dos campos */
  border-radius: 4px; /* Borda arredondada nos campos de entrada */
  border: 1px solid #ccc; /* Cor da borda */
}

/* Estilo dos botões */
button {
  width: 100%; /* Faz os botões ocuparem toda a largura disponível */
  padding: 10px; /* Adiciona um pouco de espaçamento dentro dos botões */
  background-color: rgba(183, 145, 88, 1); /* Cor de fundo dos botões */
  color: white; /* Cor do texto nos botões */
  border: none; /* Remove a borda padrão do botão */
  border-radius: 4px; /* Bordas arredondadas nos botões */
  margin-top: 10px; /* Espaço acima dos botões */
}

/* Efeito de hover no botão */
button:hover {
  background-color: #0056b3; /* Muda a cor de fundo quando o mouse passa sobre o botão */
}
</style>
