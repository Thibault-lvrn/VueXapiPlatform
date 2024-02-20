<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core'

const isAuthenticated = ref(false);
const user = ref(localStorage.getItem('username') || '');
const username = ref('');
const UserCard = ref(false)
const navWrapper = ref(false)
const showLoginLink = ref(true);
const target = ref(null)

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

const showUserCard = () => {
  UserCard.value = !UserCard.value;
}

onClickOutside(
  target,
  (event) => {
    UserCard.value = false;
  },
)

const showNavigation = () => {
  navWrapper.value = !navWrapper.value;
}

onMounted(() => {
  checkToken();
  watchEffect(() => {
    checkToken();
    navWrapper.value = false;
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
      <div class="burger-icon" @click="showNavigation()">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="main-navigation" :class="{ mobileActive: navWrapper }">
        <div>
          <nav>
            <span class="mobile-nav-close material-symbols-outlined" @click="showNavigation()">close</span>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/movies">Movies</RouterLink>
            <RouterLink to="/actors">Actors</RouterLink>
            <RouterLink to="/categories">Categories</RouterLink>
          </nav>
        </div>
      </div>
      
      <div class="secondary-nav" ref="target">
        <img class="icon" src="./assets/img/account.png" alt="account" @click="showUserCard()">
        <div class="dropdown" :class="{ active: UserCard }">
          <router-link v-if="!isAuthenticated" class="link-nav-menu" to="/login">Login</router-link>
          <RouterLink v-if="isAuthenticated" @click="logout" class="link-nav-menu" to="/">Logout</RouterLink>
          <RouterLink v-if="isAuthenticated" class="link-nav-menu" to="/account">My account</RouterLink>
        </div>
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
