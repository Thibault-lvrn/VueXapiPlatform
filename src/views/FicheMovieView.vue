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
      <div style="display: flex; justify-content: center; flex-direction: row; align-items: center; gap: 2rem;">
        <div>
          <img v-if="movieInfo.file[0]" :src="'http://89.234.182.9/MovieProject/Api/WRA506-ApiPlatform-films/public/uploads/' + movieInfo.file[0]['filePath']" :alt="movieInfo.title" width="300">
        </div>
        <div style="margin-top: 30px;">
          <h3 style="text-align: left; font-weight: 700;">{{ movieInfo.title }}</h3>
          <p><span style="text-transform: uppercase; font-weight: 700;">Description : </span> {{ movieInfo.description }}</p>
          <p><span style="text-transform: uppercase; font-weight: 700;">Date de sortie :</span> {{ movieInfo.releaseDate }}</p>
          <p><span style="text-transform: uppercase; font-weight: 700;">Durée :</span> {{ movieInfo.duration }} minutes</p>
          <p><span style="text-transform: uppercase; font-weight: 700;">Note : </span>{{ movieInfo.note }} étoiles</p>
          <p><span style="text-transform: uppercase; font-weight: 700;">La Catégorie du film :</span> <router-link :to="{ name: 'FicheCategory', params: { id: movieInfo.category.id } }">{{ movieInfo.category.name }}</router-link></p>
          <div>
            <span style="text-transform: uppercase; font-weight: 700;">Distribution : </span>
            <ul class="list">
              <li v-for="actor in movieInfo.actor" :key="movie">
                  <router-link :to="{ name: 'FicheActor', params: { id: actor.id } }">
                    {{ actor.firstName }}
                    {{ actor.lastName }}
                  </router-link>
                </li>
            </ul>
          </div>
        </div>
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
