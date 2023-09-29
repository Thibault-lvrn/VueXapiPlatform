<script setup>
defineProps({
  film: {
    type: String,
    required: true
  }
})
// let urlBase = "http://localhost:8088"

// const test = async (film) => {
//   // console.log(film);
//   const response = await fetch(`${urlBase}${film}`);
//   const lefilm = await response.json();
//   return lefilm?.title;
// }

</script>
<template>
    <!-- <span v-if="test(film)">{{ test(film) }}</span> -->
    <span v-if="film">{{ film.title }}</span>
    <br>
    <span v-if="film">{{ film.description }}</span>
    <br>
    <span v-if="film">{{ film.releaseDate }}</span>
</template>