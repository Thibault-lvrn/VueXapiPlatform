<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';

let films = ref([]);

const fetchMovie = async () => {
  const response = await fetch(`${urlBase}/S5-TD1/index.php/api/movies?page=1`);
  films.value = await response.json();
  console.log(films);
}

fetchMovie();

</script>

<template>
  <div class="about">
    <h1>This is the Movies page</h1>
  </div>

  <div class="actors">
    <h2>Movies</h2>
    <ul>
      <li v-for="film in films['hydra:member']" :key="film.id">
        <MovieCard :film="film" v-if="film" />
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
