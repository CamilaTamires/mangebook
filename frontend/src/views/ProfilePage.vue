<template>
  <div class="profile-page">
    <h2>Perfil do Usuário</h2>
    <div v-if="user">
      <p><strong>Nome:</strong> {{ user.name }}</p>
      <p><strong>Usuário:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Data de Nascimento:</strong> {{ formatDate(user.birthDate) }}</p>
      <p><strong>CPF:</strong> {{ formatCPF(user.cpf) }}</p>
      <p><strong>Nível:</strong> {{ user.nivel }}</p>

      <button @click="editProfile">Editar Perfil</button>
    </div>
    <div v-else>
      <p>Carregando perfil...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,  // Para armazenar os dados do usuário
    };
  },
  created() {
    this.fetchUserProfile();  // Carregar as informações do usuário quando a página for criada
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');  // Redireciona se o usuário não estiver autenticado
          return;
        }
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        this.user = response.data;  // Armazena os dados do usuário na variável user
      } catch (error) {
        console.error('Erro ao carregar o perfil do usuário:', error);
      }
    },

    // Método para formatar a data de nascimento
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('pt-BR', options);
    },

    // Método para formatar o CPF
    formatCPF(cpf) {
      if (!cpf) return '';
      cpf = cpf.replace(/\D/g, '');  // Remove todos os caracteres não numéricos
      if (cpf.length <= 3) return cpf;
      if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}`;
      if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}`;
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    },

    // Método para redirecionar para a página de edição
    editProfile() {
      this.$router.push('/edit-profile');  // A página de edição do perfil
    },
  },
};
</script>

<style scoped>
.profile-page {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
