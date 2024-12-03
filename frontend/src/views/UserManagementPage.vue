<template>
    <div class="user-management">
      <!-- Cabeçalho -->
      <CompCabecalho :searchQuery="searchQuery" @updateSearchQuery="updateSearchQuery" />
  
      <!-- Tabela de Usuários -->
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Usuário</th>
            <th>Email</th>
            <th>Data de Nascimento</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td>{{ user.name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.birthDate }}</td>
            <td>{{ user.cpf }}</td>
            <td>{{ user.isActive ? 'Ativo' : 'Desabilitado' }}</td>
            <td>
              <button @click="openModal(user)">Editar</button>
              <button @click="deleteUser(user._id)">Excluir</button>
              <button @click="disableUser(user._id)">Desabilitar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Botão Inserir Usuário -->
      <div class="menu">
        <button @click="openModal()">Inserir Usuário</button>
      </div>
  
      <!-- Modal para Inserir/Editar Usuário -->
      <div v-if="modalVisible" class="modal">
        <div class="modal-content">
          <h2>{{ isEditing ? 'Editar Usuário' : 'Inserir Novo Usuário' }}</h2>
          <input v-model="modalUser.username" placeholder="Nome de usuário" required />
          <input v-model="modalUser.name" placeholder="Nome completo" required />
          <input v-model="modalUser.email" placeholder="Email" type="email" required />
          <input v-model="modalUser.birthDate" placeholder="Data de Nascimento" type="date" required />
          <input v-model="modalUser.cpf" placeholder="CPF" type="text" required />
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
        users: [], // Lista de usuários
        modalVisible: false,
        modalUser: { id: null, username: '', name: '', email: '', birthDate: '', cpf: '' },
        isEditing: false, // Determina se está no modo edição
        searchQuery: '', // Para busca na tabela
        successMessage: '', // Mensagem de sucesso após salvar usuário
      };
    },
    computed: {
      filteredUsers() {
        if (Array.isArray(this.users)) {
        return this.users.filter(user =>
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return []; // Se não for um array, retorna um array vazio
      },
    },
    created() {
      // Verificar se o usuário está autenticado
      this.checkAuth();
    },
    methods: {
      checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redireciona para a página de login se não houver token
          this.$router.push('/login');
        } else {
          // Caso o token exista, tenta buscar os dados dos usuários
          this.fetchUsers();
        }
      },
      updateSearchQuery(newSearchQuery) {
        this.searchQuery = newSearchQuery;
      },
      async fetchUsers() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/auth/users', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (Array.isArray(response.data)) {
                this.users = response.data;
              } else {
              console.error('A resposta da API não é um array:', response.data);
        }
     } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      },
      openModal(user = null) {
        this.modalVisible = true;
        this.isEditing = !!user;
        if (user) {
          this.modalUser = { ...user };
        } else {
          this.modalUser = { id: null, username: '', name: '', email: '', birthDate: '', cpf: '' };
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
          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          let url = 'http://localhost:5000/api/auth/users';
          let method = 'post';
  
          if (this.isEditing) {
            url = `http://localhost:5000/api/auth/users/${this.modalUser._id}`;
            method = 'put';
          }
  
          await axios({ method, url, data: this.modalUser, ...config });
          this.fetchUsers();
          this.successMessage = 'Usuário salvo com sucesso!';
          this.closeModal();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } catch (error) {
          console.error('Erro ao salvar usuário:', error);
        }
      },
      async deleteUser(id) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error("Token não encontrado!");
            return;
          }
          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          await axios.delete(`http://localhost:5000/api/auth/users/${id}`, config);
          this.fetchUsers();
        } catch (error) {
          console.error('Erro ao excluir usuário:', error);
        }
      },
      async disableUser(id) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error("Token não encontrado!");
            return;
          }
          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          await axios.put(`http://localhost:5000/api/auth/users/${id}/disable`, {}, config);
          this.fetchUsers();
        } catch (error) {
          console.error('Erro ao desabilitar usuário:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .user-management {
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
  