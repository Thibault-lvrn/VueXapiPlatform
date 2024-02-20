<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { urlBase } from '@/main.js';
import ActorCard from '@/components/Card/ActorCard.vue';

const route = useRoute()
let actorInfo = ref('')

onMounted(async () => {
  const id = route.params.id
  const response = await fetch(`${urlBase}/api/actors/${id}`);
  actorInfo.value = await response.json()
})
</script>

<template v-if="actorInfo">
  <h1>{{ actorInfo.firstName }} {{ actorInfo.lastName }}</h1>

  <div class="actors">
    <div>
      <div style="display: flex; justify-content: center; flex-direction: row; gap: 2rem;">
        <div>
          <img src="../assets/img/silhouette.jpg" alt="silhouette" width="300">
        </div>
        <div>
          <p><span style="text-transform: uppercase; font-weight: 700;">Prénom : </span> {{ actorInfo.firstName }}</p>
          <p><span style="text-transform: uppercase; font-weight: 700;">Nom : </span> {{ actorInfo.lastName }}</p>
          <p v-if="actorInfo.nationality"><span style="text-transform: uppercase; font-weight: 700;">Nationalitée : </span> {{ actorInfo.nationality.name }}</p>
          <div>
            <span style="text-transform: uppercase; font-weight: 700;">Films : </span>
            <ul class="list">
              <li v-for="movie in actorInfo.movies" :key="movie.id">
                <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
                  {{ movie.title }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
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
