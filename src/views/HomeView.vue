<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '@/components/Card/MovieCard.vue';
import ActorCard from '@/components/Card/ActorCard.vue';
import { urlBase } from '@/main.js';

const movies = ref([]);
const actors = ref([]);
const isLoading = ref(true);

const fetchMovies = async () => {
  try {
    const response = await fetch(`${urlBase}/api/movies?page=1&itemsPerPage=5`);
    
    if (!response.ok) {
      throw new Error(`Error fetching movies. Status: ${response.status}`);
    }

    movies.value = await response.json();
    isLoading.value = false;
    
    const sortedmovies = movies.value['hydra:member'].sort((a, b) => {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    });
    const latestmovies = sortedmovies.slice(0, 4);
    movies.value = latestmovies;
  } catch (error) {
    console.error('An error occurred while fetching movies:', error);
    isLoading.value = false;
  }
}

const fetchActors = async () => {
  try {
    const response = await fetch(`${urlBase}/api/actors?page=1&itemsPerPage=5`);
    
    if (!response.ok) {
      throw new Error(`Error fetching actors. Status: ${response.status}`);
    }

    actors.value = await response.json();
    
    const sortedActors = actors.value['hydra:member'].sort((a, b) => {
      return b.id - a.id;
    });
    const latestActors = sortedActors.slice(0, 4);
    actors.value = latestActors;

  } catch (error) {
    console.error('An error occurred while fetching actors:', error);
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchActors();
  fetchMovies();
});
</script>

<template>
  <h1>Home page</h1>

  <div class="movies">
    <h2>Movies</h2>
    <ul class="item-listing">
      <div class="loading" v-if="isLoading">
        Chargement...
      </div>
      <li class="card card-movie" v-for="movie in movies" :key="movie.id">
          <MovieCard :movie="movie" callerComponent="HomeView" v-if="movie" />
      </li>
    </ul>
  </div>

  <div class="actors">
    <h2>Actors</h2>
    <ul class="item-listing">
      <div class="loading" v-if="isLoading">
        Chargement...
      </div>
      <li v-if="!isLoading" class="card" v-for="actor in actors" :key="actor.id">
          <ActorCard :actor="actor" v-if="actor" />
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
