<script setup>
import { ref } from 'vue';
import ActorCard from '@/components/Card/ActorCard.vue';
import { urlBase } from '@/main.js';

let actors = ref([]);

const fetchActors = async () => {
  const response = await fetch(`${urlBase}/api/actors?page=1`);
  actors.value = await response.json();
}

fetchActors();

</script>

<template>
  <h1>Actors page</h1>

  <div class="actors">
    <ul>
      <li class="card" v-for="actor in actors['hydra:member']" :key="actor.id">
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
