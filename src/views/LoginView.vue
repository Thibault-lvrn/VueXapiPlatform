<script setup>
import axios from 'axios'
import { urlBase } from '@/main.js';
import { ref } from 'vue'
import { useRouter } from 'vue-router'; // Import the useRouter function

let router = useRouter(); // Use the useRouter function to get the router instance
let username = ref('');
let password = ref('');
let loading = ref(false);
const isError = ref(false);

function login(e) {
  e.preventDefault();

  isError.value = false;
  
  loading.value = true;

  let data = JSON.stringify({
    "username": username.value,
    "password": password.value
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${urlBase}/api/login_check`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    loading.value = false;
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', username.value);
    router.push('/')
  })
  .catch((error) => {
    loading.value = false;
    isError.value = true;
  });
}

</script>

<template>
  <h1>Login page</h1>

  <div class="category">
    <div class="category_container">
      <form  @submit.prevent="login">
        <input type="email" name="mail" placeholder="mail" v-model="username" required>
        <input type="text" name="name" placeholder="password" v-model="password">
        <button>
          <template v-if="!loading">
            Login
          </template>
          <template v-if="loading">
            <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </template>
        </button>
        <template v-if="isError">
            <span style="color: red;">Le mail ou le mot de passe est incorrect</span>
        </template>
      </form>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
  }
}

.lds-default {
  display: inline-block;
  position: absolute;
  width: 85px;
  height: 20px;
  top: 50%;
  right: 50%;
  transform: translate(50%, 9%) scale(-0.4);
}
.lds-default div {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 37px;
  left: 66px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 22px;
  left: 62px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 11px;
  left: 52px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 7px;
  left: 37px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 11px;
  left: 22px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 22px;
  left: 11px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 37px;
  left: 7px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 52px;
  left: 11px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 62px;
  left: 22px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 66px;
  left: 37px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 62px;
  left: 52px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 52px;
  left: 62px;
}
@keyframes lds-default {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}

</style>