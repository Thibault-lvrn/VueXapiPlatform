<script>
import { urlBase } from '@/main.js';
import axios from 'axios';

export default {
  props: {
    movieId: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const token = localStorage.getItem('token');

    return {
      token,
    };
  },
  methods: {
    openModalRemoveMovie(id) {
      const modals = document.querySelectorAll('.modal');
      const body = document.querySelector(`body`);

      modals.forEach((modal) => {
        modal.classList.remove('active');
      });

      const specificModal = document.querySelector(`.modalRemoveMovie-${id}`);
      if (specificModal) {
        body.classList.add('noScroll');
        specificModal.classList.add('active');
      }
    },
    closeModal(id) {
      const body = document.querySelector(`body`);
      const specificModal = document.querySelector(`.modalRemoveMovie-${id}`);

      if (specificModal) {
        body.classList.remove('noScroll');
        specificModal.classList.remove('active');
      }
    },
    async deleteMovieCategorie(id) {
      event.preventDefault();

      const myHeaders = {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };
      const requestOptions = {
        method: 'patch',
        url: `${urlBase}/api/movies/${id}`,
        headers: myHeaders,
        data: {
          category: null,
        },
      };

      try {
        const response = await axios(requestOptions);
        window.location.reload()
      } catch (error) {
        if (error.response.statusText === "Unauthorized") {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeModalAdd();
          this.router.push(`/login`)
        } else {
          console.error('Erreur lors de la supréssion du film :', error);
        }
      }
    }
  },
};
</script>

<template>

  <div class="modal-category modal" :class="'modalRemoveMovie-' + movieId">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModal(movieId)">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <p>Etes vous sûr de vouloir supprimer ce film de cette catégorie ?</p>
          <div class="btns">
            <button @click="deleteMovieCategorie(movieId)">Oui</button>
            <button @click="closeModal(movieId)">Non</button>
          </div>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour supprimer un film</h3>
            <router-link to="/login">
            <button>Se connecter</button>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="click-outsise" @click="closeModal(movieId)"></div>
  </div>
</template>