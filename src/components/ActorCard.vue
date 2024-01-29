<script setup>
defineProps({
  actor: {
    type: String,
    required: true
  }
})
</script>
<template>
    <span v-if="actor">{{ actor.lastName }}</span>
    <span v-if="actor">{{ actor.firstName }}</span>
</template>