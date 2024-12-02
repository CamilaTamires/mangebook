<template>
  <div class="carrosel">
    <!-- Contêiner do carrossel -->
    <div class="carrosel-container">
      <!-- Imagem do carrossel com transição -->
      <img :src="banners[currentIndex]" alt="Banner" class="carrosel-image" />
    </div>
    
    <!-- Controles de navegação (setas) -->
    <button class="carrosel-button left" @click="prevSlide">←</button>
    <button class="carrosel-button right" @click="nextSlide">→</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Lista de banners (URLs das imagens)
      banners: [
        require('@/assets/img_carrosel1.png'),
        require('@/assets/img_carrosel21.png'),
        require('@/assets/img_carrosel4.png'),
      ],
      currentIndex: 0, // Índice da imagem atual
    };
  },
  mounted() {
    // Inicia a transição automática de slides
    this.startAutoSlide();
  },
  beforeUnmount() {
    // Limpa o intervalo quando o componente for destruído
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    // Função para avançar para o próximo banner
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.banners.length;
    },
    // Função para voltar para o banner anterior
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
    },
    // Função para iniciar o slide automático
    startAutoSlide() {
      this.intervalId = setInterval(() => {
        this.nextSlide(); // Avança para o próximo slide
      }, 3000); // 3000ms = 3 segundos
    },
  },
};
</script>

<style scoped>
/* Estilos para o carrossel */
.carrosel {
  
  width: 100%;
  max-width: auto; /* Largura máxima para o carrossel */
  
}

.carousel-container {
  width: 100vw;  /* 100% da largura da tela */
  height: 100vh; /* 100% da altura da tela */
  overflow: hidden; /* Ocultar qualquer parte da imagem que saia da área visível */
  position: relative; /* Permitir que o carrossel seja posicionado dentro */
}

.carousel-images {
  display: flex; /* Coloca as imagens em linha */
  transition: transform 0.5s ease; /* Suaviza a transição entre as imagens */
  width: 100vw; /* Garante que o carrossel ocupe 100% da largura */
}

/* Ajuste das imagens do carrossel */
.carousel-images img {
  width: 100vw;  /* As imagens ocupam 100% da largura da tela */
  height: 100vh; /* As imagens ocupam 100% da altura da tela */
  object-fit: cover; /* Ajusta as imagens para cobrir o espaço disponível sem distorcer */
  flex-shrink: 0; /* Impede que as imagens encolham */
}

.carrosel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5); /* Fundo semitransparente */
  color: white;
  border: none;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10; /* Coloca as setas acima das imagens */
}

.left {
  left: 10px; /* Posição da seta à esquerda */
}

.right {
  right: 10px; /* Posição da seta à direita */
}

.carrosel-button:hover {
  background-color: rgba(0, 0, 0, 0.8); /* Efeito de hover nas setas */
}
</style>
