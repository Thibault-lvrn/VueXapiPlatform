<script>
import { urlBase } from '@/main.js';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

export default {
  props: {
    movieId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    openModalRemove(id) {
      const modals = document.querySelectorAll('.modal');
      const body = document.querySelector(`body`);

      modals.forEach((modal) => {
        modal.classList.remove('active');
      });

      const specificModal = document.querySelector(`.modal-remove-${id}`);
      if (specificModal) {
        body.classList.add('noScroll');
        specificModal.classList.add('active');
      }
    },
    closeModalRemove(id) {
      const specificModal = document.querySelector(`.modal-remove-${id}`);
      const body = document.querySelector(`body`);
      if (specificModal) {
        body.classList.remove('noScroll');
        specificModal.classList.remove('active');
      }
    },
    async deleteMovie(id) {
      const url = `${urlBase}/api/movies/${id}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };
      axios.delete(url, {
        headers: headers,
      })
      .then(response => {
        window.location.reload()
      })
      .catch(error => {
        router.push('/login')
      });
    },
  },
};
</script>

<template>
  <div class="modal-movie modal" :class="'modal-remove-' + movieId">
    <div class="modal-content modal-content-remove">
      <div class="modal-header">
        <span class="close" v-on:click="closeModalRemove(movieId)">&times;</span>
      </div>
      <div class="modal-body">
        <p>Etes vous sûr de vouloir supprimer le film</p>
        <div class="btns">
          <button @click="deleteMovie(movieId)">Oui</button>
          <button @click="closeModalRemove(movieId)">Non</button>
        </div>
      </div>
    </div>
    <div class="click-outsise" @click="closeModalRemove(movieId)"></div>
  </div>
</template>