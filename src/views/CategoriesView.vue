<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';

let categories = ref([]);

const fetchActors = async () => {
  const response = await fetch(`${urlBase}/api/categories?page=1`);
  categories.value = await response.json();
}

fetchActors();

</script>

<template>
  <div class="about">
    <h1>This is the Categories page</h1>
  </div>

  <div class="category">
    <h2>Categories</h2>
    <div>
      <div v-if="categories" v-for="categorie in categories['hydra:member']" :key="categorie.id">
        <h3>
          <router-link :to="{ name: 'FicheCategory', params: { id: categorie.id } }">
            {{ categorie.name }}
          </router-link>
        </h3>
        <ul>
          <li class="card" v-for="film in categorie.movies" :key="film.id">
            <router-link :to="{ name: 'FicheMovie', params: { id: film.id } }">
              <MovieCard :film="film" v-if="film" />
            </router-link>
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
