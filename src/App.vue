<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'


let user = localStorage.getItem('user');

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/')
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper navigation">
      <!-- <HelloWorld msg="You did it!" /> -->

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/movies">Movies</RouterLink>
        <RouterLink to="/actors">Actors</RouterLink>
        <RouterLink to="/categories">Categories</RouterLink>
      </nav>
      
      <div class="secondary-nav">
        <div class="logout">{{ user }}</div>
        <template v-if="!user">
          <RouterLink to="/login">Login</RouterLink>
        </template>
        <template v-if="user">
          <button @click="logout()">Logout</button>
        </template>
      </div>
    </div>
  </header>

  <RouterView :key="$router.path"/>
</template>

<style scoped>
header {
  line-height: 1;
  max-height: 100vh;
  padding: 20px 0
}
</style>
