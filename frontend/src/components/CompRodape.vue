<template>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Arvoreteca - Todos os direitos reservados.</p>
        <div class="footer-links">
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Serviço</a>
          <a href="#">Contato</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'CompRodape',
  };
  </script>
  
  <style scoped>
  /* Estilo do rodapé */
  .footer {
    width: 95vw;  /* 100% da largura da tela */
    background-color: rgba(118, 24, 19, 1); /* Cor de fundo semelhante ao cabeçalho */
    color: white;
    padding: 5px; /* Reduzido de 20px para 10px para diminuir a espessura */
    text-align: center;
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .footer-links {
    margin-top: 5px; /* Reduzido de 10px para 5px para diminuir o espaço */
  }
  
  .footer-links a {
    color: white;
    text-decoration: none;
    margin: 0 8px; /* Ajuste de margem para diminuir o espaçamento entre os links */
  }
  
  .footer-links a:hover {
    text-decoration: underline;
  }
  </style>
  