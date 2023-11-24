<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const user = ref(localStorage.getItem('username') || '');
let showLoginLink = ref(true);

const checkToken = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  user.value = localStorage.getItem('user') || '';
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isAuthenticated.value = false;
  user.value = '';
};


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
        <!-- <template v-if="!showLogin">
          <p class="logout">{{ user }}</p>
        </template>
        <template v-if="showLogin">
          <RouterLink to="/login">Login</RouterLink>
        </template>
        <template v-if="!showLogin">
          <button @click="logout()">Logout</button>
        </template> -->
        <!-- <button @click="test()">test</button>
        <p v-text="showLogin"></p> -->
        <router-link v-if="!isAuthenticated" class="link-nav-menu" to="/login">Login</router-link>
        <router-link v-if="isAuthenticated" @click="logout" class="link-nav-menu" to="/">Logout</router-link>
        <router-link v-if="isAuthenticated" class="link-nav-menu" to="/account">{{user}}</router-link>
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
