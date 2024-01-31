<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';
import axios from 'axios';
import DateFormatter from '@/components/DateFormatter.vue';
import AddMovie from '@/components/AddMovie.vue';
import RemoveMovie from '@/components/RemoveMovie.vue';
import UpdateMovie from '@/components/UpdateMovie.vue';

const movies = ref([]);
const pageNumber = ref(parseInt(localStorage.getItem('moviePageNumber')) || 1);
const itemsPerPage = ref(9);
const numberOfPages = ref('');
const lastPageUrl = ref("");

const fetchMovie = async (page) => {
  if (page) {
    pageNumber.value = page;
  }

  try {
    const response = await axios.get(`${urlBase}/api/movies?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}`);
    movies.value = response.data;
    lastPageUrl.value = movies.value['hydra:view']["hydra:last"];
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

    console.log(response.data);
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
  }
}
</script>

<template>
  <h1>Movies page</h1>

  <div class="movies">
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
    <div class="addMovie">
      <button @click="AddMovie.methods.openModalAdd()">Ajouter un film</button>
    </div>
    <ul>
      
      <li class="card" v-for="movie in movies['hydra:member']" :key="movie.id">
        <div class="card-content">

          <MovieCard :movie="movie" v-if="movie" />
          <div class="card-footer">
            <button>
              <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
                Voir plus
              </router-link>
            </button>
            <div class="card_gesture">
              <button class="edit material-symbols-outlined" v-on:click="UpdateMovie.methods.openModalEdit(movie.id)">edit</button>
              <button class="remove material-symbols-outlined" v-on:click="RemoveMovie.methods.openModalRemove(movie.id)">delete</button>
            </div>
          </div>
        </div>

        <!-- modifications modals -->
        <UpdateMovie :movie="movie" />
        <RemoveMovie :movieId="movie.id" />
        <AddMovie />
        <!-- end -->

      </li>
    </ul>
  </div>
</template>

<style>

.card-footer {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  height: 100%;
}

.pagination {
  margin-bottom: 60px;
}

.pagination .active {
  background-color: rgb(58, 58, 58);;
  color: white;
}

.form-input {
  width: 100%;
} 

.form-input  label {
  display: block;
  width: 100%;
}

.noScroll {
  overflow: hidden;
}

.addMovie {
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}

@media (min-width: 1024px) {
  .about {
    display: flex;
  }
}
</style>
