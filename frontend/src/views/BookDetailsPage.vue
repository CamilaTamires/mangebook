<template>
  <div class="book-details-page">
    <!-- Cabeçalho -->
    <CompCabecalho :searchQuery="searchQuery" @updateSearchQuery="updateSearchQuery" />

    <div class="book-details-container">
      <!-- Exibe as informações do livro apenas se 'book' não for nulo -->
      <div v-if="book" class="book-info">
        <h1>{{ book.title }}</h1>
        <p><strong>Autor:</strong> {{ book.author }}</p>
        <p><strong>Ano de Publicação:</strong> {{ book.year }}</p>
        <p><strong>Sinopse:</strong> {{ book.description || 'Sem sinopse disponível.' }}</p>
      </div>

      <!-- Exibe a imagem do livro, se disponível, caso contrário, uma imagem padrão -->
      <div v-if="book" class="book-image">
        <!-- Exibe a imagem do livro ou a imagem padrão -->
        <img :src="book.coverImage || require('@/assets/branco800x1200.jpg')" alt="Capa do Livro" />
      </div>

      <!-- Exibe um loader ou mensagem de erro se 'book' for nulo ou se ainda estiver carregando -->
      <div v-else>
        <p>Carregando detalhes do livro...</p> <!-- Mensagem durante o carregamento -->
      </div>
    </div>

    <button @click="goBack">Voltar</button> <!-- Botão para voltar à página anterior -->


    <!-- Rodapé -->
    <CompRodape />
  </div>
</template>

<script>
import axios from "axios";
import CompCabecalho from '@/components/CompCabecalho.vue'; // Importando o cabeçalho
import CompRodape from '@/components/CompRodape.vue';     // Importando o rodapé

export default {
  components: {
    CompCabecalho,  // Cabeçalho
    CompRodape,     // Rodapé
  },
  data() {
    return {
      book: null,  // Inicializa a propriedade 'book' como null, para ser preenchida com os dados da API
      searchQuery: '', // Para busca no cabeçalho
    };
  },
  created() {
    this.fetchBookDetails();  // Chama o método para buscar os detalhes do livro assim que o componente é criado
  },
  methods: {
    // Método assíncrono para buscar os detalhes do livro pela API
    async fetchBookDetails() {
      const bookId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
        if (response.status === 200) {
          this.book = response.data;
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do livro:", error);
        alert("Livro não encontrado. Verifique o ID ou tente novamente mais tarde.");
      }
    },

    // Método para buscar livros e redirecionar para a HomePage
    performSearch() {
      if (this.searchQuery.trim()) {
        // Redireciona para a página Home passando a query de pesquisa
        this.$router.push({ path: '/home', query: { searchQuery: this.searchQuery } });
      }
    },

    // Método para voltar à página anterior
    goBack() {
      this.$router.push({ path: '/home', query: { searchQuery: this.searchQuery } });// Redireciona para a página inicial ou outra página desejada
    },
    
    updateSearchQuery(newSearchQuery) {
      this.searchQuery = newSearchQuery;  // Método para atualizar a busca no cabeçalho
    }
  },
};
</script>

<style scoped>
.book-details-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: rgba(118, 24, 19, 1);
  color: white;
}

.book-details-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
}

.book-info {
  flex: 1;
  padding-right: 20px;
}

.book-info h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.book-info p {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.book-image img {
  max-width: 300px;
  max-height: 400px;
  object-fit: cover;
}

button {
  padding: 10px 20px;
  background-color: rgba(183, 145, 88, 1);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: rgba(153, 123, 78, 1);
}
</style>
