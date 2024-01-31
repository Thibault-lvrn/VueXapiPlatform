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
  const response = await fetch(`${urlBase}/api/categories/${id}`);
  categoryInfo.value = await response.json()
})
</script>

<template>
  <h1>{{ categoryInfo.name }}</h1>

  <div class="actors">
    <div>
      <ul>
        <li class="card" v-for="movie in categoryInfo.movies" :key="movie.id">
          <div class="card-content">
            <pre>{{movie}}</pre>
            <MovieCard :movie="movie" v-if="movie" />
            
            <div class="card-footer">
              <button>
                <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
                  Voir plus
                </router-link>
              </button>
            </div>
          </div>
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
