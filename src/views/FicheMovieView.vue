<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { urlBase } from '@/main.js';
import MovieCard from '@/components/Card/MovieCard.vue';

const route = useRoute();
let movieInfo = ref('');

onMounted(async () => {
  const id = route.params.id;
  try {
    const response = await axios.get(`${urlBase}/api/movies/${id}`);
    movieInfo.value = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>


<template>
  <h1>Movie page</h1>

  <div class="movies">
    <div v-if="movieInfo">
      <!-- <pre>{{ movieInfo }}</pre> -->
      <MovieCard :movie="movieInfo" v-if="movieInfo" />
      
      <h3>La Catégorie du film : </h3>
      <router-link :to="{ name: 'FicheCategory', params: { id: movieInfo.category.id } }">
        <p>{{ movieInfo.category.name }}</p>
      </router-link>

      <h3>Distribution : </h3>
      <ul v-for="actor in movieInfo.actor" :key="movie">
        <router-link :to="{ name: 'FicheActor', params: { id: actor.id } }">
          <li>
            {{ actor.firstName }}
            {{ actor.lastName }}
          </li>
        </router-link>
      </ul>
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
