<script setup>
import { ref } from 'vue';
import ActorCard from '@/components/ActorCard.vue';
import { urlBase } from '@/main.js';

let actors = ref([]);

const fetchActors = async () => {
  const response = await fetch(`${urlBase}/S5-TD1/index.php/api/actors?page=1`);
  actors.value = await response.json();
  console.log(actors);
}

fetchActors();

</script>

<template>
  <div class="about">
    <h1>This is the Actors page</h1>
  </div>

  <pre>{{ actors.member }}</pre>

  <div class="actors">
    <h2>Actors</h2>
    <ul>
      <li v-for="actor in actors['hydra:member']" :key="actor.id">
        <!-- {{ actor.lastName }}
        {{ actor.firstName }} -->
        <ActorCard :actor="actor" v-if="actor" />
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
