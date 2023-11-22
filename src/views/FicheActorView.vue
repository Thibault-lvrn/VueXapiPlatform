<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { urlBase } from '@/main.js';
import ActorCard from '@/components/ActorCard.vue';

const route = useRoute()
let actorInfo = ref('')

onMounted(async () => {
  const id = route.params.id
  console.log(id)
  const response = await fetch(`${urlBase}/api/actors/${id}`);
  actorInfo.value = await response.json()
  console.log(actorInfo)
})
</script>

<template>
  <div class="about">
    <h1>This is the info page</h1>
  </div>

  <div class="actors">
    <h2>Hello Actor</h2>
    <div>
      <ActorCard :actor="actorInfo" v-if="actorInfo" />

      <h3>Les Films de l'Acteur : </h3>
      <ul v-for="movie in actorInfo.movies" :key="actor">
        <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
          <li>
            {{ movie.title }}
          </li>
        </router-link>
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
