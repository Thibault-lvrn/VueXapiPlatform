<script setup>
import axios from 'axios'
import { urlBase } from '@/main.js';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const username = ref(localStorage.getItem('user'));

</script>

<template>
  <h1>Login page</h1>

  <div class="category">
    <div class="category_container">
      <h3>Hello {{ username }}</h3>
    </div>
  </div>
</template>
