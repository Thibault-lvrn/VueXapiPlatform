<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { urlBase } from '@/main.js';
import MovieCard from '@/components/MovieCard.vue';

const route = useRoute();
let movieInfo = ref('');

onMounted(async () => {
  const id = route.params.id;
  try {
    console.log("HELLO")
    const response = await axios.get(`${urlBase}/api/movies/${id}`);
    movieInfo.value = response.data;
    console.log("movie info : ")
    console.log(movieInfo.value)
    console.log("// movie info")
  } catch (error) {
    console.error(error);
  }
});
</script>


<template>
  <div class="about">
    <h1>This is the movie page</h1>
  </div>

  <div class="movies">
    <h2>Hello Movies</h2>
    <div v-if="movieInfo">
      <MovieCard :movie="movieInfo" v-if="movieInfo" />
      
      <h3>La Catégorie du movie : </h3>
      <router-link :to="{ name: 'FicheCategory', params: { id: movieInfo.category.id } }">
        <p>{{ movieInfo.category.name }}</p>
      </router-link>

      <h3>Les Acteurs du movie : </h3>
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
