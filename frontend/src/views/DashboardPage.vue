<template>
  <!-- Contêiner principal do Dashboard -->
  <div class="dashboard">
    <!-- Título da página -->
    <h1>Bem-vindo ao Dashboard</h1>
    
    <!-- Link para navegar até a página de categorias -->
    <router-link to="/categories">Ver Categorias</router-link>
  </div>
</template>

<script>
// Definindo o componente 'DashboardPage'
export default {
  name: 'DashboardPage', // Nome do componente para fins de identificação
};
</script>

<style scoped>
/* Estilos para o contêiner principal do Dashboard */
.dashboard {
  padding: 20px; /* Adiciona espaçamento ao redor do conteúdo */
  text-align: center; /* Centraliza o texto no contêiner */
}
</style>
