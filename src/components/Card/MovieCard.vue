<script setup>
import DateFormatter from '@/components/entityManager/DateFormatter.vue'; // Assurez-vous de spécifier le chemin correct

defineProps({
  movie: {
    type: Object,
    required: true,
  }
})

</script>
<template>
    <h4 v-if="movie">{{ movie.title }}</h4>
    <span v-if="movie">{{ movie.description }}</span>
    <pre>{{ movie.releaseDate }}</pre>
    <span v-if="movie">{{ DateFormatter.methods.formatDateFR(movie.releaseDate) }}</span>
</template>
