<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { urlBase } from '@/main.js';
import MovieCard from '@/components/MovieCard.vue';


const route = useRoute()
let categoryInfo = ref('')

onMounted(async () => {
  const id = route.params.id
  console.log(id)
  const response = await fetch(`${urlBase}/S5-TD1/index.php/api/categories/${id}`);
  categoryInfo.value = await response.json()
  console.log(categoryInfo)
})
</script>

<template>
  <div class="about">
    <h1>This is the info page</h1>
  </div>

  <div class="actors">
    <h2>Hello {{ categoryInfo.name }}</h2>
    <div>
      <!-- <ActorCard :actor="categoryInfo" v-if="categoryInfo" /> -->
      <li v-for="film in categoryInfo.movies" :key="film.id">
        <router-link :to="{ name: 'FicheMovie', params: { id: film.id } }">
          <MovieCard :film="film" v-if="film" />
        </router-link>
          <!-- {{ film }} -->
        <!-- <pre>{{ film }}</pre> -->
      </li>
      <!-- <ul v-for="movie in categoryInfo.movies" :key="actor">
        <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
          <li>
            {{ movie.title }}
          </li>
        </router-link>
      </ul> -->
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
