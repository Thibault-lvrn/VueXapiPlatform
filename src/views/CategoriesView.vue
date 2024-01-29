<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';

let categories = ref([]);

const fetchCategories = async () => {
  const response = await fetch(`${urlBase}/api/categories?page=1`);
  categories.value = await response.json();
}

fetchCategories();
</script>

<template>
  <h1>Categories page</h1>
  
  <div class="category">
    <div>
      <div v-if="categories" v-for="categorie in categories['hydra:member']" :key="categorie.id">
        <h3>
          <router-link :to="{ name: 'FicheCategory', params: { id: categorie.id } }">
            {{ categorie.name }}
          </router-link>
        </h3>
        <ul>
          <li class="card" v-for="movie in categorie.movies" :key="movie.id">
            <div class="card-content">
              <MovieCard :movie="movie" v-if="movie" />
              <div class="card-footer">
                <button>
                  <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
                    Voir plus
                  </router-link>  
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
  }
}
</style>
