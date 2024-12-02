<template>
  <header>
    <!-- Botão invisível atrás do logo -->
    <button class="logo-button" @click="goHome"></button>
    
    <!-- Logo e título -->
    <div class="logo">
      <img :src="require('../assets/logo.png')" alt="Logo" />
      <h1>Arvoreteca</h1>
    </div>
    
    <!-- Barra de pesquisa -->
    <div class="search-bar">
      <input 
        type="text" 
        :value="searchQuery" 
        @input="handleSearchInput"
        placeholder="Buscar título ou autor" 
      />
      <button @click="search">Buscar</button>
      
    </div>
    
    <!-- Seção de perfil -->
    <div class="profile">
      <button class="profile-button" @click="toggleDropdown">
        <img src="../assets/conta.png" alt="Perfil" class="profile-icon" />
      </button>

      <!-- Menu suspenso (dropdown) -->
      <div v-if="dropdownVisible" class="dropdown-menu">
        <p class="username">{{ userName }}</p>
        <button class="dropdown-item" @click="manageBooks">Gerenciar Livros</button>
        <button class="dropdown-item" @click="logout">Sair</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    searchQuery: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      dropdownVisible: false,
    };
  },
  methods: {
    handleSearchInput(event) {
      this.$emit('updateSearchQuery', event.target.value);
    },

    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },

    manageBooks() {
      this.$router.push('/book-management');
    },

    goHome() {
      this.$router.push('/home');
    },

// Método para buscar livros e redirecionar para a HomePage
    search() {
      if (this.searchQuery.trim()) {
        // Quando o usuário clicar no botão de buscar, redireciona para a HomePage
        this.$router.push({ path: '/home', query: { searchQuery: this.searchQuery } });
      }
    },

    logout() {
      // Limpa o token de autenticação
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      // Redireciona para a página de login
      this.$router.push('/');
    }
  },
};
</script>

<style scoped>
/* Estilo para o cabeçalho */
header {
  width: 95vw;
  background-color: rgba(118, 24, 19, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: relative; /* Necessário para o posicionamento do botão */
}

/* Botão invisível que fica atrás do logo */
.logo-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 140px; /* Largura do logo */
  height: 140px; /* Altura do logo */
  background: transparent;
  border: none;
  z-index: 0; /* Fica atrás do logo */
  cursor: pointer;
}

.logo-button:hover {
  /* Adicionar algum efeito visual quando o botão for clicado */
  opacity: 0.6;
}

/* Estilo para a imagem do logo */
.logo img {
  width: auto;
  height: 140px;
  z-index: 1; /* Garante que o logo fique acima do botão */
}

/* Estilo para o título (h1) ao lado do logo */
h1 {
  color: white;
  margin-left: 10px;
}

/* Estilos para a barra de pesquisa */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Estilo para o campo de entrada de texto */
.search-bar input {
  padding: 10px;
  border-radius: 4px;
  width: 400px;
}

/* Estilo para o botão de pesquisa */
.search-bar button {
  background-color: rgba(183, 145, 88, 1);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  width: 120px;
}

/* Seção do perfil */
.profile {
  display: flex;
  align-items: center;
  position: relative; /* Necessário para o posicionamento do menu */
}

/* Botão circular do perfil */
.profile-button {
  width: 50px;
  height: 50px;
  background-color: white;
  border: none;
  border-radius: 50%; /* Faz o botão redondo */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Sombra para destaque */
  cursor: pointer;
  transition: transform 0.2s ease;
}

.profile-button:hover {
  transform: scale(1.1);
}

/* Ícone dentro do botão */
.profile-icon {
  width: 200%;
  height: 105%;
  object-fit: contain;
  display: block;
  margin: auto;
}

/* Estilo para o menu suspenso (dropdown) */
.dropdown-menu {
  position: absolute; /* Posiciona o menu abaixo do botão */
  top: 60px; /* Ajuste o valor conforme necessário */
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  width: 200px;
  z-index: 10;
}

/* Estilo para os itens do menu */
.dropdown-item {
  background: none;
  border: none;
  padding: 10px;
  text-align: left;
  width: 100%;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: rgba(183, 145, 88, 1);
  color: white;
}

/* Estilo para o nome do usuário */
.username {
  font-weight: bold;
  margin-bottom: 10px;
  padding-left: 10px;
}
</style>
