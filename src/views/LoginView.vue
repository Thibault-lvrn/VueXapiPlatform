<script setup>
import axios from 'axios'
import { urlBase } from '@/main.js';
import { ref } from 'vue'
import { useRouter } from 'vue-router'; // Import the useRouter function

let router = useRouter(); // Use the useRouter function to get the router instance
let username = ref('');
let password = ref('');

function login(e) {
  e.preventDefault();

  console.log(username.value)
  console.log(password.value)

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
    console.log(JSON.stringify(response.data));
    // if (response) {
      console.log(response.data)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', username.value);
      router.push('/')
      alert('Login successful');
    // }
  })
  .catch((error) => {
    alert('Login failed');
  });
}

</script>

<template>
  <div class="about">
    <h1>This is the Login page</h1>
  </div>

  <div class="category">
    <h2>Login</h2>
    <div class="category_container">
      <form  @submit.prevent="login">
        <input type="email" name="mail" placeholder="mail" v-model="username" required>
        <input type="text" name="name" placeholder="password" v-model="password">
        <button>Login</button>
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
</style>
