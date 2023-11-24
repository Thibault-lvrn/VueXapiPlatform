<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';
import { onMounted } from 'vue';
import axios from 'axios';

const films = ref([]);
const pageNumber = ref(parseInt(localStorage.getItem('moviePageNumber')) || 1);
const itemsPerPage = ref(9);
const numberOfPages = ref(5);
const lastPageUrl = ref("");
const loading = ref(false);

const fetchMovie = async (page) => {
  if (page) {
    pageNumber.value = page;
  }

  try {
    const response = await axios.get(`${urlBase}/api/movies?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}`);
    films.value = response.data;
    lastPageUrl.value = films.value['hydra:view']["hydra:last"];
    getNumberOfPages();
  } catch (error) {
    console.error(error);
  }
};

const getNumberOfPages = async () => {
  const dernierChiffre = lastPageUrl.value.match(/\d+$/);
  numberOfPages.value = dernierChiffre ? parseInt(dernierChiffre[0], 10) : 0;
}

const nextPage = () => {
  if (pageNumber.value >= numberOfPages.value) {
    pageNumber.value = numberOfPages.value;
  } else {
    pageNumber.value++;
    localStorage.setItem('moviePageNumber', pageNumber.value);
  }
  fetchMovie();
}

const previousPage = () => {
  if (pageNumber.value <= 1) {
    pageNumber.value = 1;
  } else {
    pageNumber.value--;
    localStorage.setItem('moviePageNumber', pageNumber.value);
  }
  fetchMovie();
}

onMounted(() => {
  fetchMovie();
});


</script>

<template>
  <div class="about">
    <h1>This is the Movies page</h1>
  </div>

  <div class="movies">
    <h2>Movies</h2>
    <div>
      <ul class="pagination">
        <button @click="previousPage()">&lt;</button>
        <templat v-for="page in numberOfPages">
          <button :class="{ active: pageNumber === page }" @click="fetchMovie(page)">
            <span>{{ page }}</span>
          </button>
        </templat>
        <button @click="nextPage()">></button>
      </ul>
    </div>

    <ul>
      <li class="card" v-for="film in films['hydra:member']" :key="film.id">
        <router-link :to="{ name: 'FicheMovie', params: { id: film.id } }">
          <MovieCard :film="film" v-if="film" />
        </router-link>
      </li>
    </ul>
  </div>
</template>