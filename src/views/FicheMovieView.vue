<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { urlBase } from '@/main.js';
import MovieCard from '@/components/MovieCard.vue';

const route = useRoute()
let filmInfo = ref('')

onMounted(async () => {
  const id = route.params.id
  console.log(id)
  const response = await fetch(`${urlBase}/S5-TD1/index.php/api/movies/${id}`);
  filmInfo.value = await response.json()
  console.log(filmInfo)
})
</script>

<template>
  <div class="about">
    <h1>This is the info page</h1>
  </div>

  <div class="actors">
    <h2>Hello Movies</h2>
    <div v-if="filmInfo">
      <MovieCard :film="filmInfo" v-if="filmInfo" />
      
      <h3>La Catégorie du film : </h3>
      <router-link :to="{ name: 'FicheCategory', params: { id: filmInfo.category.id } }">
        <p>{{ filmInfo.category.name }}</p>
      </router-link>

      <h3>Les Acteurs du film : </h3>
      <ul v-for="actor in filmInfo.Actors" :key="film">
        <router-link :to="{ name: 'FicheActor', params: { id: actor.id } }">
          <li>
            {{ actor.firstName }}
            {{ actor.lastName }}
          </li>
        </router-link>
      </ul>
      
      <!-- <router-link :key="id" :to="{ name: 'FicheMovie', params: { id: 201 } }">
        <li>
          bonjour
        </li>
      </router-link> -->
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
