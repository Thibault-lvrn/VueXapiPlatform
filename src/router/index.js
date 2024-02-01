import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/MoviesView.vue')
    },
    {
      path: '/actors',
      name: 'actors',
      component: () => import('../views/ActorsView.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue')
    },
    {
      path: '/FicheMovie/:id',
      name: 'FicheMovie',
      component: () => import('../views/FicheMovieView.vue')
    },
    {
      path: '/FicheActor/:id',
      name: 'FicheActor',
      component: () => import('../views/FicheActorView.vue')
    },
    {
      path: '/FicheCategory/:id',
      name: 'FicheCategory',
      component: () => import('../views/FicheCategoryView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

export default router
