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
          <th>Nível</th> 
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ formatDate(user.birthDate) }}</td>
          <td>{{ formatCPF(user.cpf) }}</td>
          <td>{{ user.isActive ? 'Ativo' : 'Desabilitado' }}</td>
          <td>{{ user.nivel || 'Aluno' }}</td> 
          <td>
            <button @click="openModal(user)">Editar</button>
            <!-- Remover o botão Excluir -->
              <button @click="disableUser(user)">
                {{ user.isActive ? 'Desabilitar' : 'Habilitar' }}
              </button>
          </td>
        </tr>
      </tbody>
    </table>
  
    <!-- Modal para Inserir/Editar Usuário -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Editar Usuário' : 'Inserir Novo Usuário' }}</h2>
        <input v-model="modalUser.username" placeholder="Nome de usuário" required readonly />
        <input v-model="modalUser.name" placeholder="Nome completo" required />
        <input v-model="modalUser.email" placeholder="Email" type="email" required />
        <input v-model="modalUser.birthDate" placeholder="Data de Nascimento" type="date" required />
        <input v-model="modalUser.cpf" @input="modalUser.cpf = formatCPF(modalUser.cpf)" placeholder="CPF" type="text" required />
       
        <select v-model="modalUser.nivel" required>
          <option value="Aluno">Aluno</option>
          <option value="Admin">Admin</option>
        </select>

        <button @click="save">{{ isEditing ? 'Salvar' : 'Inserir' }}</button>
        <button @click="closeModal">Cancelar</button>
      </div>
    </div>
  
    <!-- Rodapé -->
    <CompRodape />
  </div>
</template>


<script>
import CompCabecalho from '@/components/CompCabecalho.vue';
import CompRodape from '@/components/CompRodape.vue';
import axios from 'axios';

export default {
  components: {
    CompCabecalho,
    CompRodape,
  },
  data() {
    return {
      users: [],
      modalVisible: false,
      modalUser: { id: null, username: '', name: '', email: '', birthDate: '', cpf: '' },
      isEditing: false,
      searchQuery: '',
      successMessage: '',
    };
  },
  computed: {
    filteredUsers() {
      if (Array.isArray(this.users)) {
        return this.users.filter(user => 
          (user.username && user.username.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (user.name && user.name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      }
      return [];
    },
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      } else {
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
            'Authorization': `Bearer ${token}`,
          },
        });

        // Verifique se a resposta é um array e, se for, extraia o primeiro elemento
        if (Array.isArray(response.data) && Array.isArray(response.data[0])) {
          this.users = response.data[0];  // Acesse o primeiro array dentro da resposta
        } else {
          this.users = response.data;  // Caso a resposta seja um array simples, utilize diretamente
        }
        
        console.log('Usuários recebidos:', this.users);  // Verifique os dados no console

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

        console.log("Dados que serão enviados para o backend:", this.modalUser);

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
    async disableUser(user) {
      try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token não encontrado!");
      return;
    }
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    // Alterar o estado de isActive
    const updatedUser = { ...user, isActive: !user.isActive };

    // Atualizando o status do usuário no banco de dados
    await axios.put(`http://localhost:5000/api/auth/users/${user._id}`, updatedUser, config);

    // Atualizando a lista de usuários após a alteração
    this.fetchUsers();
    } catch (error) {
     console.error('Erro ao alterar status do usuário:', error);
    }
   },
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('pt-BR', options);
    },
    formatCPF(cpf) {
      if (!cpf) return '';
      cpf = cpf.replace(/\D/g, '');  // Remove todos os caracteres não numéricos
      if (cpf.length <= 3) return cpf;
      if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}`; 
      if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}`;
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
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
  