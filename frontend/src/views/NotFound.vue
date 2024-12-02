<template>
    <div class="not-found">
      <h1>Página não encontrada (404)</h1>
      <p>Desculpe, a página que você está procurando não existe.</p>
      <router-link to="/">Voltar para a página inicial</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background-color: #f4f4f4;
  }
  
  h1 {
    font-size: 3em;
    color: #e74c3c;
  }
  
  p {
    font-size: 1.2em;
    margin-top: 10px;
  }
  
  router-link {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  
  router-link:hover {
    background-color: #2980b9;
  }
  </style>
  