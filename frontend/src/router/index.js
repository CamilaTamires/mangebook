// Importa funções do Vue Router para criar a navegação entre as páginas
import { createRouter, createWebHistory } from 'vue-router';

// Importa os componentes das páginas que serão usadas nas rotas
import LoginPage from '@/views/LoginPage.vue';
import HomePage from '@/views/HomePage.vue';
import BookDetailsPage from '@/views/BookDetailsPage.vue';
import BookManagement from '@/views/BookManagementPage.vue';
import NotFound from '@/views/NotFound.vue';

// Importa a função de autenticação
import { isAuthenticated } from '@/auth';

// Define as rotas do aplicativo
const routes = [
  { 
    path: '/', 
    component: LoginPage,
  },
  {
    path: '/home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/book/:id',
    component: BookDetailsPage,
    name: 'BookDetails',
    meta: { requiresAuth: true },
  },
  {
    path: '/book-management',
    component: BookManagement,
    name: 'BookManagement',
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)',
    component: NotFound,
    meta: { requiresAuth: false },
  },
];

// Cria o roteador
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Define uma função de proteção de rotas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ path: '/' });  // Redireciona para o login se não estiver autenticado
  } else {
    next();  // Permite a navegação
  }
});

export default router;
