<script setup>
import { defineProps } from 'vue';
import { urlBase } from '@/main.js';
import { urlImgBase } from '@/main.js';
import AddMovie from '@/components/entityManager/AddMovie.vue';
import RemoveMovie from '@/components/entityManager/RemoveMovie.vue';
import UpdateMovie from '@/components/entityManager/UpdateMovie.vue';
import RemoveCategoryMovie from '@/components/entityManager/RemoveCategoryMovie.vue';

defineProps({
  movie: {
    type: Object,
    required: true,
  },
  callerComponent: {
    type: String,
    default: '',
  },
});
</script>

<template v-if="callerComponent != 'FicheMovieView'">
  <div class="card-content movie-card">
    <img class="card_background_img" v-if="movie.file[0]" :src="'http://89.234.182.9/MovieProject/Api/WRA506-ApiPlatform-films/public/uploads/' + movie.file[0]['filePath']" :alt="movie.title" width="100" height="100">
    <div class="content-text">
      <h4 v-if="movie">{{ movie.title }}</h4>
      <div class="card-footer" v-if="callerComponent === 'MoviesView' || callerComponent === 'HomeView' || callerComponent === 'CategoriesView'">
        <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
          <button class="card-button">
            Voir plus
          </button>
        </router-link>
      </div>
      <div class="card_gesture" v-if="callerComponent === 'MoviesView'">
        <button class="gesture edit material-symbols-outlined" v-on:click="UpdateMovie.methods.openModalEdit(movie.id)">
          edit
        </button>
        <button class="gesture remove material-symbols-outlined" v-on:click="RemoveMovie.methods.openModalRemove(movie.id)">
          delete
        </button>
      </div>
      <div class="card_gesture" v-if="callerComponent === 'CategoriesView'">
        <button class="gesture remove material-symbols-outlined" v-on:click="RemoveCategoryMovie.methods.openModalRemoveMovie(movie.id)">
          delete
        </button>
      </div>
    </div>
  </div>
  <!-- modifications modals -->
  <template v-if="callerComponent === 'MoviesView'">
    <UpdateMovie :movie="movie"/>
    <RemoveMovie :movieId="movie.id"/>
  </template>
  <template v-if="callerComponent === 'CategoriesView'">
    <RemoveCategoryMovie :movieId="movie.id"/>
  </template>
  <!-- end -->
</template>
