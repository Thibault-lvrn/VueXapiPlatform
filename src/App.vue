<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const user = ref(localStorage.getItem('username') || '');
const username = ref('');
let showLoginLink = ref(true);

const checkToken = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  user.value = localStorage.getItem('user') || '';
  extractUserName();
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isAuthenticated.value = false;
  user.value = '';
};


const extractUserName = () => {
  let emailInput = user.value;
  let regexPattern = /([^@]+)(?:@([^\.]+)\.)?(.*)/;
  let match = emailInput.match(regexPattern);

  if (match) {
      username.value = match[1];
  }
}

onMounted(() => {
  checkToken();
  watchEffect(() => {
    checkToken();
  });
});

const router = useRouter();

router.beforeEach((to, from, next) => {
  checkToken();
  next();
});
</script>

<template>
  <header>

    <div class="wrapper navigation">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/movies">Movies</RouterLink>
        <RouterLink to="/actors">Actors</RouterLink>
        <RouterLink to="/categories">Categories</RouterLink>
      </nav>
      
      <div class="secondary-nav">
        <router-link v-if="!isAuthenticated" class="link-nav-menu" to="/login">Login</router-link>
        <RouterLink v-if="isAuthenticated" @click="logout" class="link-nav-menu" to="/">Logout</RouterLink>
        <RouterLink v-if="isAuthenticated" class="link-nav-menu" to="/account">{{username}}</RouterLink>
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
