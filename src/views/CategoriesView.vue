<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '@/components/Card/MovieCard.vue';
import { urlBase } from '@/main.js';
import axios from 'axios';
import AddCategory from '@/components/entityManager/AddCategory.vue';

let categories = ref([]);
const isLoading = ref(true);
const pageNumber = ref(parseInt(localStorage.getItem('categoryPageNumber')) || 1);
const numberOfPages = ref('');
const itemsPerPage = ref(2);
const searchTerm = ref('');


const fetchCategories = async (page) => {
  if (page) {
    pageNumber.value = page;
  }
  try {
    const response = await axios.get(
      `${urlBase}/api/categories?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}`
    );

    if (!response.data) {
      throw new Error(`No data returned from the server`);
    }

    categories.value = response.data;
    numberOfPages.value = Math.ceil(response.data['hydra:totalItems'] / itemsPerPage.value);
    isLoading.value = false;
  } catch (error) {
    console.error('An error occurred while fetching categories:', error);
    isLoading.value = false;
  }
}

const searchCategories = async () => {
  if (!searchTerm.value) {
    fetchCategories();
    return;
  }
  try {
    const response = await axios.get(`${urlBase}/api/categories?page=1&name=${searchTerm.value}`);
    categories.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.error('An error occurred while searching categories:', error);
    isLoading.value = false;
  }
};

const nextPage = () => {
  if (pageNumber.value >= numberOfPages.value) {
    pageNumber.value = numberOfPages.value;
  } else {
    pageNumber.value++;
    localStorage.setItem('categoryPageNumber', pageNumber.value);
  }
  fetchCategories();
};

const previousPage = () => {
  if (pageNumber.value <= 1) {
    pageNumber.value = 1;
  } else {
    pageNumber.value--;
    localStorage.setItem('categoryPageNumber', pageNumber.value);
  }
  fetchCategories();
};

onMounted(fetchCategories);
</script>

<template>
  <h1>Categories page</h1>
  
  <div class="category">
    <form class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Rechercher des catégories..." @input="searchCategories">
    </form>
    <div>
      <ul class="pagination">
        <button class="pagination_btn" @click="previousPage()">&lt;</button>
        <template v-for="page in numberOfPages">
          <button class="pagination_btn" :class="{ active: pageNumber === page }" @click="fetchCategories(page)">
            <span>{{ page }}</span>
          </button>
        </template>
        <button class="pagination_btn" @click="nextPage()">></button>
      </ul>
    </div>
    <div class="addEntity">
      <div>
        <button @click="AddCategory.methods.openModalAdd()">Ajouter une catégories</button>
      </div>
    </div>
    <div>
      <div class="loading" v-if="isLoading">
        Chargement...
      </div>
      <div v-if="categories" v-for="categorie in categories['hydra:member']" :key="categorie.id">
        <h3>
          <router-link :to="{ name: 'FicheCategory', params: { id: categorie.id } }">
            {{ categorie.name }}
          </router-link>
        </h3>
        <ul class="item-listing">
          <div class="loading" v-if="isLoading">
            Chargement...
          </div>
          <li v-if="!isLoading" class="card card-movie" v-for="movie in categorie.movies" :key="movie.id">
            <MovieCard :movie="movie" v-if="movie" />
          </li>
        </ul>
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
