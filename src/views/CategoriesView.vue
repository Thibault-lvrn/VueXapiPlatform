<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '@/components/Card/MovieCard.vue';
import { urlBase } from '@/main.js';

let categories = ref([]);
const isLoading = ref(true);

const fetchCategories = async () => {
  try {
    const response = await fetch(`${urlBase}/api/categories?page=1`);
    
    if (!response.ok) {
      throw new Error(`Error fetching categories. Status: ${response.status}`);
    }

    categories.value = await response.json();
    isLoading.value = false;

  } catch (error) {
    console.error('An error occurred while fetching categories:', error);
    // Handle error or set isLoading.value to false in case of error
    isLoading.value = false;
  }
}

onMounted(fetchCategories);

</script>

<template>
  <h1>Categories page</h1>
  
  <div class="category">
    <div>
      <div class="loading" v-if="isLoading">
        Chargement...
      </div>
      <div v-if="categories" v-for="categorie in categories['hydra:member']" :key="categorie.id">
        <h3>
          <router-link :to="{ name: 'FicheCategory', params: { id: categorie.id } }">
            {{ categorie.name }}
          </router-link>
        </h3>
        <ul>
          <div v-if="isLoading">
            Chargement...
          </div>
          <li v-if="!isLoading" class="card" v-for="movie in categorie.movies" :key="movie.id">
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
