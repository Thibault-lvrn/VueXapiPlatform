<script setup>
import { ref, onMounted } from 'vue';
import ActorCard from '@/components/Card/ActorCard.vue';
import AddActor from '@/components/entityManager/AddMovie.vue';
import { urlBase } from '@/main.js';
import axios from 'axios';

console.log(AddActor);

const actors = ref([]);
const pageNumber = ref(parseInt(localStorage.getItem('actorPageNumber')) || 1);
const isLoading = ref(true);
const numberOfPages = ref('');
const lastPageUrl = ref('');
const itemsPerPage = ref(8);
const searchTerm = ref('');

const fetchActors = async (page) => {
  if (page) {
    pageNumber.value = page;
  }
  try {
    const response = await axios.get(
      `${urlBase}/api/actors?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}`
    );
    actors.value = response.data;
    lastPageUrl.value = actors.value['hydra:view']['hydra:last'];
    getNumberOfPages();
    isLoading.value = false;
  } catch (error) {
    console.error('An error occurred while fetching actors:', error);
    isLoading.value = false;
  }
}

const searchActors = async () => {
  pageNumber.value = 1;
  if (!searchTerm.value) {
    fetchActors();
    return;
  }
  try {
    const response = await axios.get(`${urlBase}/api/actors?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}&firstName=${searchTerm.value}`);
    if (response.data['hydra:totalItems'] === 0) {
      const lastNameResponse = await axios.get(`${urlBase}/api/actors?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}&lastName=${searchTerm.value}`);
      actors.value = lastNameResponse.data;
    } else {
      actors.value = response.data;
    }
    lastPageUrl.value = actors.value['hydra:view']['hydra:last'];
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
    localStorage.setItem('actorPageNumber', pageNumber.value);
  }
  fetchActors();
};

const previousPage = () => {
  if (pageNumber.value <= 1) {
    pageNumber.value = 1;
  } else {
    pageNumber.value--;
    localStorage.setItem('actorPageNumber', pageNumber.value);
  }
  fetchActors();
};

onMounted(() => {
  fetchActors();
});

</script>

<template>
  <h1>Actors page</h1>
  
  <div class="actors">
    <form class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Rechercher des films..." @input="searchActors">
    </form>
    <div>
      <ul class="pagination">
        <button class="pagination_btn" @click="previousPage()">&lt;</button>
        <template v-for="page in numberOfPages">
          <button class="pagination_btn" :class="{ active: pageNumber === page }" @click="fetchActors(page)">
            <span>{{ page }}</span>
          </button>
        </template>
        <button class="pagination_btn" @click="nextPage()">></button>
      </ul>
    </div>
    <div class="addEntity">
      <div>
        <button @click="AddActor.methods.openModalAdd()">Ajouter un acteur</button>
      </div>
    </div>
    <ul class="item-listing">
      <div class="loading" v-if="isLoading">
        Chargement...
      </div>
      <li v-if="!isLoading" class="card" v-for="actor in actors['hydra:member']" :key="actor.id">
        <ActorCard :actor="actor" callerComponent="MoviesView" v-if="actor" />
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
