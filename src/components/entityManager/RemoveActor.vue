<script>
import { urlBase } from '@/main.js';
import axios from 'axios';
import { useRouter } from 'vue-router';

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
        window.location.reload()
      })
      .catch(error => {
        console.error(error);
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
          <p>Etes vous sûr de vouloir supprimer le film</p>
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