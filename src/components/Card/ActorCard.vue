<script setup>
defineProps({
  actor: {
    type: Object,
    required: true
  }
})
</script>
<template v-if="actor">
    <div>
      <span>{{ actor.firstName }} <span class="upercase">{{ actor.lastName }}</span></span>
    </div>
    <div>
      <span>Nationalitée : </span>
      <span>{{ actor.nationality.name }}</span>
    </div>
</template>
