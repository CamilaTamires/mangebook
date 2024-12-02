<template>
  <div class="home-page">
    <!-- Cabeçalho -->
    <CompCabecalho :searchQuery="searchQuery" @updateSearchQuery="updateSearchQuery" />

    <!-- Carrossel -->
    <CompCarrosel />

    <!-- Lista de livros -->
    <div class="books-list">
      <h2>Livros Recém-chegado</h2>

      <!-- Espaço entre o título e a lista de livros -->
      <div class="spacer"></div>

      <!-- Exibe a lista de livros -->
      <div v-if="loading" class="loading">
        <p>Carregando livros...</p>
      </div>

      <!-- Exibe uma mensagem se não houver livros -->
      <div v-else-if="filteredBooks.length === 0">
        <p>Nenhum livro encontrado.</p>
      </div>

      <!-- Exibe os livros -->
      <div class="book-items">
        <div class="book-item" v-for="book in filteredBooks" :key="book._id">
          <div class="book-content">
            <h3>{{ book.title }}</h3>
            
            <!-- Exibe a imagem estática da capa entre o título e o autor -->
            <img src="@/assets/branco270x280.png" alt="Capa do livro" class="book-cover" />
            
            <p>{{ book.author }}</p>
            <button @click="goToBookDetails(book._id)">Ver Detalhes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rodapé -->
    <CompRodape />
  </div>
</template>

<script>
import CompCabecalho from "@/components/CompCabecalho.vue";
import CompCarrosel from "@/components/CompCarrosel.vue"; 
import CompRodape from "@/components/CompRodape.vue";
import axios from "axios";

export default {
  components: {
    CompCabecalho,
    CompCarrosel,  
    CompRodape,
  },
  data() {
    return {
      books: [],  // Lista de livros que virão da API
      loading: true, // Flag para mostrar carregamento
      searchQuery: '',  // Propriedade para armazenar a consulta de busca
    };
  },
  computed: {
    filteredBooks() {
      // Filtra os livros conforme o termo de busca
      return this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  created() {
    this.updateSearchQuery(this.$route.query.searchQuery || '');
    this.fetchBooks();  // Carregar os livros ao criar o componente
    
  },
  watch: {
    // Observa as mudanças na query e aplica o filtro
    '$route.query.searchQuery'(newSearchQuery) {
      this.updateSearchQuery(newSearchQuery);
      this.fetchBooks(); 
    },
  },
  methods: {
    // Método para atualizar o termo de busca vindo do cabeçalho
    updateSearchQuery(newSearchQuery) {
     this.searchQuery = newSearchQuery || ''; 
    },
    async fetchBooks() {
      try {
        const response = await axios.get("http://localhost:5000/api/books",{
        params: { searchQuery: this.searchQuery }  
        });
        this.books = response.data; // Armazenar os livros retornados pela API
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
      } finally {
        this.loading = false;  // Esconde o carregamento ao terminar
      }
    },
    goToBookDetails(bookId) {
      this.$router.push({ name: 'BookDetails', params: { id: bookId } });
    },
  },
};
</script>

<style scoped>
.home-page {
  width: 98vw;
  background-color: rgba(118, 24, 19, 1);
  color: white;
  text-align: center;
}

/* Estilos para o título */
.books-list h2 {
  font-size: 2rem;
  margin-bottom: 30px;  /* Espaço abaixo do título */
  text-align: center;
}

/* Espaço entre o título e a lista de livros */
.spacer {
  height: 20px;  /* Ajuste o valor conforme necessário */
}

/* Organiza os itens de livros em linha */
.book-items {
  display: flex;
  flex-wrap: wrap; /* Permite que os livros quebrem de linha se necessário */
  justify-content: center; /* Centraliza os itens no eixo horizontal */
}

/* Estilo para os itens do livro */
.book-item {
  margin: 15px;
  width: 220px;  /* Largura fixa para cada item */
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1); /* Fundo levemente transparente */
  border-radius: 8px;  /* Bordas arredondadas */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Sombra sutil para os itens */
  display: flex;
  flex-direction: column; /* Alinha os elementos dentro do item de forma vertical */
  justify-content: center; /* Garante que os itens fiquem centralizados verticalmente */
  align-items: center; /* Garante que os itens fiquem centralizados horizontalmente */
}

/* Estilo para a imagem (capa do livro) */
.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 10px;  /* Espaçamento entre a imagem e o título */
}

/* Estilos para o conteúdo do livro (título, autor, botão) */
.book-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Estilo para o título do livro */
.book-details h3 {
  font-size: 1.2rem;
  margin: 5px 0;
}

/* Estilo para o autor do livro */
.book-details p {
  font-size: 1rem;
  margin: 5px 0;
}

/* Estilos para o botão */
.book-item button {
  margin-top: 10px;
  background-color: rgba(183, 145, 88, 1);
  border: none;
  color: white;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.book-item button:hover {
  background-color: rgba(153, 123, 78, 1);
}

/* Carregamento */
.loading {
  font-size: 18px;
  color: #888;
}
</style>
