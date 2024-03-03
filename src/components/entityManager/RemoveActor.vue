<script>
import { urlBase } from '@/main.js';
import axios from 'axios';

export default {
  props: {
    actorId: {
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
    async deleteactor(id) {
      const url = `${urlBase}/api/actors/${id}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };
      axios.delete(url, {
        headers: headers,
      })
      .then(response => {
        const specificActor = document.querySelector(`.actorCard-${id}`);
        this.closeModalRemove(id);
        specificActor.remove();
      })
      .catch(error => {
        if (error.response.statusText === "Unauthorized") {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeModalAdd();
          this.router.push(`/login`)
        } else {
          console.error('Erreur lors de la supréssion de l\'acteur :', error);
        }
      });
    },
  },
};
</script>

<template>
  <div class="modal-actor modal" :class="'modal-remove-' + actorId">
    <div class="modal-content modal-content-remove">
      <div class="modal-header">
        <span class="close" v-on:click="closeModalRemove(actorId)">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <p>Etes vous sûr de vouloir supprimer l'acteur</p>
          <div class="btns">
            <button @click="deleteactor(actorId)">Oui</button>
            <button @click="closeModalRemove(actorId)">Non</button>
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
    <div class="click-outsise" @click="closeModalRemove(actorId)"></div>
  </div>
</template>