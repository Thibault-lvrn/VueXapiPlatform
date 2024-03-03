<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '@/components/Card/MovieCard.vue';
import { urlBase } from '@/main.js';
import axios from 'axios';
import AddCategory from '@/components/entityManager/AddCategory.vue';
import RemoveCategory from '@/components/entityManager/RemoveCategory.vue';
import UpdateCategory from '@/components/entityManager/UpdateCategory.vue';
import UpdateCategoryMovie from '@/components/entityManager/UpdateCategoryMovie.vue';

const categories = ref([]);
const isLoading = ref(true);
const searchTerm = ref('');
const activeCategory = ref(null);

const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${urlBase}/api/categories`
    );

    if (!response.data) {
      throw new Error(`No data returned from the server`);
    }

    categories.value = response.data;
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

const toggleCategory = (categoryId) => {
  if (activeCategory.value === categoryId) {
    activeCategory.value = null;
  } else {
    activeCategory.value = categoryId;
  }
};

onMounted(fetchCategories);
</script>

<template>
  <h1>Categories page</h1>
  
  <div class="category">
    <form class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Rechercher des catégories..." @input="searchCategories">
    </form>
    <div class="addEntity">
      <div>
        <button @click="AddCategory.methods.openModalAdd()">Ajouter une catégories</button>
      </div>
      <AddCategory/>
    </div>
    <div>
      <div class="loading" v-if="isLoading">
        Chargement...
      </div>
      <div v-if="categories" v-for="category in categories['hydra:member']" :key="category.id" :class="'categoryCard-' + category.id">
        <div>
          <UpdateCategory :category="category" />
          <UpdateCategoryMovie :category="category" />
          <RemoveCategory :categoryId="category.id" :hasMovies="category.movies"/>
          <h3 class="category-name">
            <div class="expand-button" :class="{ active: activeCategory === category.id }" @click="toggleCategory(category.id)">
              <span class="gesture expand material-symbols-outlined">
                expand_more
              </span>
              {{ category.name }}
            </div>
            <div class="category-gesture">
              <button class="gesture remove material-symbols-outlined" v-on:click="UpdateCategoryMovie.methods.openModalAddMovie(category.id)">
                add
              </button>
              <button class="gesture edit material-symbols-outlined" v-on:click="UpdateCategory.methods.openModalEdit(category.id)">
                edit
              </button>
              <button class="gesture remove material-symbols-outlined" v-on:click="RemoveCategory.methods.openModalRemove(category.id)">
                delete
              </button>
            </div>
          </h3>
        </div>
        <ul class="item-listing">
          <li class="card card-movie" v-for="movie in category.movies" :key="movie.id"  v-if="activeCategory === category.id && !isLoading">
            <MovieCard :movie="movie" callerComponent="CategoriesView" v-if="movie" />
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
