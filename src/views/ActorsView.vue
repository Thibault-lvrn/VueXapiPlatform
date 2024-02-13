<script setup>
import { ref, onMounted } from 'vue';
import ActorCard from '@/components/Card/ActorCard.vue';
import { urlBase } from '@/main.js';

const actors = ref([]);
const isLoading = ref(true);

const fetchActors = async () => {
  try {
    const response = await fetch(`${urlBase}/api/actors?page=1`);
    
    if (!response.ok) {
      throw new Error(`Error fetching actors. Status: ${response.status}`);
    }

    actors.value = await response.json();
    isLoading.value = false;
  } catch (error) {
    console.error('An error occurred while fetching actors:', error);
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchActors();
});

</script>

<template>
  <h1>Actors page</h1>

  <div class="actors">
    <ul>
      <div v-if="isLoading">
        Chargement...
      </div>
      <li v-if="!isLoading" class="card" v-for="actor in actors['hydra:member']" :key="actor.id">
        <div class="card-content">
          <ActorCard :actor="actor" v-if="actor" />
          <div class="card-footer">
            <router-link :to="{ name: 'FicheActor', params: { id: actor.id } }">
              <button>
                Voir plus
              </button>
            </router-link>
          </div>
        </div>
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
