<script setup>
import {ref, onMounted} from 'vue';
import MovieCard from '@/components/Card/MovieCard.vue';
import {urlBase} from '@/main.js';
import axios from 'axios';
import AddMovie from '@/components/entityManager/AddMovie.vue';

const movies = ref([]);
const pageNumber = ref(parseInt(localStorage.getItem('moviePageNumber')) || 1);
const itemsPerPage = ref(8);
const numberOfPages = ref('');
const lastPageUrl = ref('');
const isLoading = ref(true);
const searchTerm = ref('');

const fetchMovie = async (page) => {
  if (page) {
    pageNumber.value = page;
  }
  try {
    const response = await axios.get(
      `${urlBase}/api/movies?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}&title=${searchTerm.value}`
    );
    movies.value = response.data;
    lastPageUrl.value = movies.value['hydra:view']['hydra:last'];
    getNumberOfPages();
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const searchMovies = async () => {
  pageNumber.value = 1;
  if (!searchTerm.value) {
    fetchMovie();
    return;
  }
  try {
    const response = await axios.get(`${urlBase}/api/movies?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}&title=${searchTerm.value}`);
    movies.value = response.data;
    lastPageUrl.value = movies.value['hydra:view']['hydra:last'];
    getNumberOfPages();
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const getNumberOfPages = async () => {
  const dernierChiffre = lastPageUrl.value.match(/\d+$/);
  let test = typeof lastPageUrl.value;
  if ((dernierChiffre === undefined) || (dernierChiffre == null) || (dernierChiffre == "undefined")) {
  // if (test != 'string') {
    numberOfPages.value = 1;
  } else {
    numberOfPages.value = dernierChiffre ? parseInt(dernierChiffre[0], 10) : 0;
  }
};

const nextPage = () => {
  if (pageNumber.value >= numberOfPages.value) {
    pageNumber.value = numberOfPages.value;
  } else {
    pageNumber.value++;
    localStorage.setItem('moviePageNumber', pageNumber.value);
  }
  fetchMovie();
};

const previousPage = () => {
  if (pageNumber.value <= 1) {
    pageNumber.value = 1;
  } else {
    pageNumber.value--;
    localStorage.setItem('moviePageNumber', pageNumber.value);
  }
  fetchMovie();
};

onMounted(() => {
  fetchMovie();
});

const uploadFile = async (file) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Cookie': 'sf_redirect=%7B%22token%22%3A%22b9f283%22%2C%22route%22%3A%22_api_%5C%2Fmedia_objects%7B._format%7D_post%22%2C%22method%22%3A%22POST%22%2C%22controller%22%3A%22App%5C%5CController%5C%5CCreateMediaObjectAction%22%2C%22status_code%22%3A201%2C%22status_text%22%3A%22Created%22%7D',
  };

  const formData = new FormData();
  formData.append('file', file, 'banner_linkedin_EN.jpg');

  try {
    const response = await axios.post('http://localhost:8088/WRA506/index.php/api/media_objects', formData, {
      headers: headers,
    });
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
  }
};
</script>

<template>
  <h1>Movies page</h1>
  <div class="movies">
    <div>
      <form class="search-container">
        <input type="text" v-model="searchTerm" placeholder="Rechercher des films..." @input="searchMovies">
      </form>
      <div>
        <ul class="pagination">
          <button class="pagination_btn" @click="previousPage()">&lt;</button>
          <template v-for="page in numberOfPages">
            <button class="pagination_btn" :class="{ active: pageNumber === page }" @click="fetchMovie(page)">
              <span>{{ page }}</span>
            </button>
          </template>
          <button class="pagination_btn" @click="nextPage()">></button>
        </ul>
      </div>
      <div class="addEntity">
        <div>
          <button @click="AddMovie.methods.openModalAdd()">Ajouter un film</button>
        </div>
      </div>
    </div>


    <ul class="item-listing" :class="{ loadingContainer: isLoading }">
      <div class="loading" v-if="isLoading">
        Chargement...
      </div>
      <li class="card card-movie" v-if="!isLoading" v-for="movie in movies['hydra:member']" :key="movie.id">
        <MovieCard :movie="movie" callerComponent="MoviesView" v-if="movie"/>
      </li>
    </ul>
  </div>
</template>
