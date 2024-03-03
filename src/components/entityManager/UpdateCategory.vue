<script setup>
import { urlBase } from '@/main.js';
</script>
<script>
import { urlBase } from '@/main.js';
import axios from 'axios';

export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    const token = localStorage.getItem('token');

    return {
      token,
      formTitle: "",
      formDescription: "",
      formReleaseDate: "",
      selectedImage: null,
    };
  },
  methods: {
    openModalEdit(id) {
      const modals = document.querySelectorAll('.modal');
      const body = document.querySelector(`body`);

      modals.forEach((modal) => {
        modal.classList.remove('active');
      });

      const specificModal = document.querySelector(`.modal-${id}`);
      if (specificModal) {
        body.classList.add('noScroll');
        specificModal.classList.add('active');
      }
    },
    closeModal(id) {
      const body = document.querySelector(`body`);
      const specificModal = document.querySelector(`.modal-${id}`);

      if (specificModal) {
        body.classList.remove('noScroll');
        specificModal.classList.remove('active');
      }
    },
    updateFormName(event) {
      this.formName = event.target.value;
    },
    async submitForm(id) {
      event.preventDefault();

      const name = this.formName;

      const myHeaders = {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };

      const data = {};

      if (name !== '') {
        data.name = name;
      }

      const requestOptions = {
        method: 'patch',
        url: `${urlBase}/api/categories/${id}`,
        headers: myHeaders,
        data: data,
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
          console.error('Erreur lors de la supréssion de la categorie :', error);
        }
      }
    },
  },
};
</script>

<template>

  <div class="modal-category modal" :class="'modal-' + category.id">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModal(category.id)">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <h2>Modifier la catégorie</h2>
          <form>
            <div class="form-input">
              <label for="title">Nom</label>
              <input type="text" id="title" name="title" :value="category.name" @input="updateFormName">
            </div>
            <button @click="submitForm(category.id)" class="card-button">Modifier</button>
          </form>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour modifier une categorie</h3>
            <router-link to="/login">
            <button>Se connecter</button>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="click-outsise" @click="closeModal(category.id)"></div>
  </div>
</template>