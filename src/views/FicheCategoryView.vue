<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { urlBase } from '@/main.js';
import MovieCard from '@/components/Card/MovieCard.vue';

const route = useRoute()
let categoryInfo = ref('')

onMounted(async () => {
  const id = route.params.id
  const response = await fetch(`${urlBase}/api/categories/${id}`);
  categoryInfo.value = await response.json()
})
</script>

<template>
  <h1>{{ categoryInfo.name }}</h1>

  <div class="actors">
    <div>
      <ul>
        <li class="card card-movie" v-for="movie in categoryInfo.movies" :key="movie.id">
          <MovieCard :movie="movie" callerComponent="CategoriesView" v-if="movie" />
        </li>
      </ul>
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
