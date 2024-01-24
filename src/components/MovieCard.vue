<script setup>
defineProps({
  movie: {
    type: String,
    required: true
  }
})
</script>
<template>
    <span v-if="movie">{{ movie.title }}</span>
    <br>
    <span v-if="movie">{{ movie.description }}</span>
    <br>
    <span v-if="movie">{{ movie.releaseDate }}</span>
</template>