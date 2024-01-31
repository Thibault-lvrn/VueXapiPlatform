<script setup>
import DateFormatter from '@/components/DateFormatter.vue'; // Assurez-vous de spécifier le chemin correct

defineProps({
  movie: {
    type: String,
    required: true,
  }
})
</script>
<template>
    <span v-if="movie">{{ movie.title }}</span>
    <br>
    
    <span v-if="movie">{{ movie.description }}</span>
    <br>
    <span v-if="movie">{{ DateFormatter.methods.formatDateFR(movie.releaseDate) }}</span>
</template>