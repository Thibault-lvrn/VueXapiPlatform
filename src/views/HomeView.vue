<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import ActorCard from '@/components/ActorCard.vue';
import { urlBase } from '@/main.js';
import moment from 'moment';

let movies = ref([]);
let actors = ref([]);

const fetchMovies = async () => {
  console.log(`${urlBase}/api/movies?page=1`)
  const response = await fetch(`${urlBase}/api/movies?page=1&itemsPerPage=5`);
  movies.value = await response.json();
  const sortedmovies = movies.value['hydra:member'].sort((a, b) => {
    return new Date(b.releaseDate) - new Date(a.releaseDate);
  });
  const latestmovies = sortedmovies.slice(0, 4);
  movies.value = latestmovies;
}

fetchMovies();

const fetchActors = async () => {
  const response = await fetch(`${urlBase}/api/actors?page=1&itemsPerPage=5`);
  actors.value = await response.json();
  const sortedActors = actors.value['hydra:member'].sort((a, b) => {
    return b.id - a.id;
  });
  const latestActors = sortedActors.slice(0, 4);
  actors.value = latestActors;
}

fetchActors();

</script>

<template>
  <div class="about">
    <h1>This is the Home page</h1>
  </div>

  <div class="movies">
    <h2>Latest Movies</h2>
    <ul>
      <li class="card" v-for="movie in movies" :key="movie.id">
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

  <div class="actors">
    <h2>Actors</h2>
    <ul>
      <li class="card" v-for="actor in actors" :key="actor.id">
        <div class="card-content">
          <ActorCard :actor="actor" v-if="actor" />
          <div class="card-footer">
            <button>
              <router-link :to="{ name: 'FicheActor', params: { id: actor.id } }">
                Voir plus
              </router-link>
            </button>
          </div>
        </div>
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
