<script>
import { urlBase } from '@/main.js';
import axios from 'axios';

export default {
  props: {
    categoryId: {
      type: Number,
      required: true,
    },
    hasMovies: {
      type: Object,
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
    async deletecategory(id) {
      const url = `${urlBase}/api/categories/${id}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };
      axios.delete(url, {
        headers: headers,
      })
      .then(response => {
        const specificcategory = document.querySelector(`.categoryCard-${id}`);
        this.closeModalRemove(id);
        specificcategory.remove();
      })
      .catch(error => {
        if (error.response.statusText === "Unauthorized") {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeModalAdd();
          this.router.push(`/login`)
        } else {
          console.error('Erreur lors de la supréssion de la catégorie :', error);
        }
      });
    },
  },
};
</script>

<template>
  <div class="modal-category modal" :class="'modal-remove-' + categoryId">
    <div class="modal-content modal-content-remove">
      <div class="modal-header">
        <span class="close" v-on:click="closeModalRemove(categoryId)">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token, !hasMovies.length">
          <p>Etes vous sûr de vouloir supprimer cette categorie</p>
          <div class="btns">
            <button @click="deletecategory(categoryId)">Oui</button>
            <button @click="closeModalRemove(categoryId)">Non</button>
          </div>
        </template>
        <template v-if="token">
          <div v-if="hasMovies.length">
            <p>Vous ne pouvez pas supprimer une catégorie possédant des films</p>
            <div class="btns">
              <button @click="closeModalRemove(categoryId)">Fermer</button>
            </div>
          </div>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour supprimer une catégorie</h3>
            <router-link to="/login">
            <button>Se connecter</button>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="click-outsise" @click="closeModalRemove(categoryId)"></div>
  </div>
</template>