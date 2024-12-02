<template>
  <div class="book-management">
    <!-- Cabeçalho -->
    <CompCabecalho :searchQuery="searchQuery" @updateSearchQuery="updateSearchQuery" />

    <!-- Tabela de Livros -->
    <table>
      <thead>
        <tr>
          <!-- <th>ID</th>  não quero que fique visível -->
          <th>Título</th>
          <th>Autor</th>
          <th>Ano</th>
          <th>Sinopse</th> <!-- Coluna para exibir sinopse -->
          <th>ISBN</th> <!-- Nova coluna para o ISBN -->
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in filteredBooks" :key="book._id">
          <!--<td>{{ book._id }}</td> não quero que fique visível -->
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.year }}</td>
          <td>{{ book.description ? book.description.slice(0, 200) + (book.description.length > 200 ? '...' : '') : 'Sem sinopse' }}</td>
          <td>{{ book.isbn || 'Sem ISBN' }}</td> <!-- Exibe o ISBN -->
          <td>
            <!-- Botão de Editar Livro -->
            <button @click="openModal(book)">Editar</button>
            <!-- Botão de Excluir Livro -->
            <button @click="deleteBook(book._id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Botão Inserir Livro -->
    <div class="menu">
      <button @click="openModal()">Inserir Livro</button>
    </div>

    <!-- Modal para Inserir/Editar Livro -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Editar Livro' : 'Inserir Novo Livro' }}</h2>
        <input v-model="modalBook.title" placeholder="Título do livro" required />
        <input v-model="modalBook.author" placeholder="Autor do livro" required />
        <input v-model="modalBook.year" placeholder="Ano de publicação" required type="number" />
        
        <!-- Novo campo para ISBN -->
        <input v-model="modalBook.isbn" placeholder="ISBN do livro" required />
        
        <!-- Novo campo para Sinopse -->
        <textarea v-model="modalBook.description" placeholder="Sinopse do livro" rows="4"></textarea>

        <!-- Botões: Inserir ou Editar -->
        <button @click="save">{{ isEditing ? 'Editar' : 'Inserir' }}</button>
        <button @click="closeModal">Cancelar</button>
      </div>
    </div>

    <!-- Rodapé -->
    <CompRodape />
  </div>
</template>

<script>
// Importando os componentes
import CompCabecalho from '@/components/CompCabecalho.vue';
import CompRodape from '@/components/CompRodape.vue';
import axios from 'axios';

export default {
  components: {
    CompCabecalho, // Cabeçalho
    CompRodape,    // Rodapé
  },
  data() {
    return {
      books: [], // Vamos puxar os livros diretamente do banco
      modalVisible: false,
      modalBook: { id: null, title: '', author: '', year: null, description: '', isbn: '' }, // Inclui ISBN
      isEditing: false, // Determina se está no modo edição
      searchQuery: '', // Para busca na tabela
      successMessage: '', // Mensagem de sucesso após salvar livro
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (book.isbn && book.isbn.includes(this.searchQuery))
      );
    },
  },
  created() {
    this.fetchBooks();
  },
  methods: {
    updateSearchQuery(newSearchQuery) {
      this.searchQuery = newSearchQuery;
    },
    async fetchBooks() {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        this.books = response.data;
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    },
    openModal(book = null) {
      this.modalVisible = true;
      this.isEditing = !!book;
      if (book) {
        this.modalBook = { ...book };
      } else {
        this.modalBook = { id: null, title: '', author: '', year: null, description: '', isbn: '' };
      }
    },
    closeModal() {
      this.modalVisible = false;
    },
    async save() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token não encontrado!");
          return;
        }
        const config = {
          headers: { 'Authorization': `Bearer ${token}` },
        };
        let url = 'http://localhost:5000/api/books';
        let method = 'post';

        if (this.isEditing) {
          url = `http://localhost:5000/api/books/${this.modalBook._id}`;
          method = 'put';
        }

        await axios({ method, url, data: this.modalBook, ...config });
        this.fetchBooks();
        this.successMessage = 'Livro registrado com sucesso!';
        this.closeModal();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        console.log('Valores de atualização:', this.modalBook);
        console.error('Erro ao adicionar livro:', error);
      }
    },
    async deleteBook(id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token não encontrado!");
          return;
        }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/books/${id}`, config);
        this.fetchBooks();
      } catch (error) {
      
        console.error('Erro ao excluir livro:', error);
      }
    },
  },
};
</script>

<style scoped>
.book-management{
  background-color: rgba(118, 24, 19, 1); /* Cor de fundo vermelho escuro */
}
/* Estilo da Tabela */
table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #a3a2a2;
}

th, td {
  padding: 10px;
  text-align: center;
}

td {
  color: #f2f2f2;
  font-size: large;
}

th {
  background-color: #f2f2f2;
}

/* Estilo para o modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(55, 82, 141, 0.5);
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 5px;
  width: 500px;
}

button {
  padding: 10px;
  margin-top: 10px;
  background-color: rgba(183, 145, 88, 1);
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px; /* Adiciona 10px de espaço à direita de cada botão */
}



button:hover {
  background-color: rgba(153, 123, 78, 1);
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

textarea {
  resize: vertical;
}

.menu {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>
