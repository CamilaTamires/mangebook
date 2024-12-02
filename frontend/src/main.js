import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importação do Vue Router
import PrimeVue from 'primevue/config';

// Criando a instância do Vue
createApp(App)
  .use(router)  // Usando o Vue Router
  .use(PrimeVue) // Usando o PrimeVue para registrar componentes globais
  .mount('#app');  // Montando a aplicação