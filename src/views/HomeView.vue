<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import ActorCard from '@/components/ActorCard.vue';
import { urlBase } from '@/main.js';

let films = ref([]);
let actors = ref([]);

const fetchMovies = async () => {
  const response = await fetch(`${urlBase}/S5-TD1/index.php/api/movies?page=1`);
  films.value = await response.json();
  const sortedFilms = films.value['hydra:member'].sort((a, b) => {
    return new Date(b.releaseDate) - new Date(a.releaseDate);
  });
  const latestFilms = sortedFilms.slice(0, 4);
  films.value = latestFilms;
}

fetchMovies();

const fetchActors = async () => {
  const response = await fetch(`${urlBase}/S5-TD1/index.php/api/actors?page=1`);
  actors.value = await response.json();
  console.log('hello', actors);
  const sortedActors = actors.value['hydra:member'].sort((a, b) => {
    return b.id - a.id;
  });
  const latestActors = sortedActors.slice(0, 4);
  console.log('latest',latestActors)
  actors.value = latestActors;
  console.log('hello', actors);
}

fetchActors();

</script>

<template>
  <div class="about">
    <h1>This is the Home page</h1>
  </div>

  <div class="actors">
    <h2>Latest Movies</h2>
    <ul>
      <li v-for="film in films" :key="film.id">
        <router-link :to="{ name: 'FicheMovie', params: { id: film.id } }">
          <MovieCard :film="film" v-if="film" />
        </router-link>
      </li>
    </ul>
  </div>

  <div class="actors">
    <h2>Actors</h2>
    <ul>
      <li v-for="actor in actors" :key="actor.id">
        <router-link :to="{ name: 'FicheActor', params: { id: actor.id } }">
          <ActorCard :actor="actor" v-if="actor" />
        </router-link>
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
