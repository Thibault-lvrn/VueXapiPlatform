<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';

let categories = ref([]);
// let urlBase = "http://localhost:8088"
// let lefilm = ref([]);

// const headers = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// };

const fetchActors = async () => {
  const response = await fetch(`${urlBase}/S5-TD1/index.php/api/categories?page=1`);
  categories.value = await response.json();
}

fetchActors();

</script>

<template>
  <div class="about">
    <h1>This is the Categories page</h1>
  </div>

  <div class="actors">
    <h2>Categories</h2>
    <ul>
      <li v-if="categories" v-for="categorie in categories['hydra:member']" :key="categorie.id">
        <router-link :to="{ name: 'FicheCategory', params: { id: categorie.id } }">
          {{ categorie.name }}
        </router-link>
        <ul>
          <li v-for="film in categorie.movies" :key="film.id">
            <router-link :to="{ name: 'FicheMovie', params: { id: film.id } }">
              <MovieCard :film="film" v-if="film" />
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
  }
}
</style>
