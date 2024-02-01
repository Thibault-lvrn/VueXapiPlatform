<script setup>
import { urlBase } from '@/main.js';
import axios from 'axios';
import DateFormatter from '@/components/entityManager/DateFormatter.vue';
import { useRouter } from 'vue-router';
import { resolveDirective } from 'vue';

const token = localStorage.getItem('token');

</script>
<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formTitle: "",
      formDescription: "",
      formReleaseDate: "",
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
    updateFormTitle(event) {
      this.formTitle = event.target.value;
    },
    updateFormDescription(event) {
      this.formDescription = event.target.value;
    },
    updateFormReleaseDate(event) {
      this.formReleaseDate = event.target.value;
    },
    async submitForm(id) {
      event.preventDefault();

      const title = this.formTitle;
      const description = this.formDescription;
      const releaseDate = this.formReleaseDate;

      const myHeaders = {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };

      const data = {};

      if (title !== '') {
        data.title = title;
      }

      if (description !== '') {
        data.description = description;
      }

      if (releaseDate !== '') {
        data.releaseDate = releaseDate;
      }

      const requestOptions = {
        method: 'patch',
        url: `${urlBase}/api/movies/${id}`,
        headers: myHeaders,
        data: data,
      };

      try {
        const response = await axios(requestOptions);

        window.location.reload()

      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>

  <div class="modal-movie modal" :class="'modal-' + movie.id">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModal(movie.id)">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <h2>Modifier le film</h2>
          <form>
            <div class="form-input">
              <label for="title">Titre</label>
              <input type="text" id="title" name="title" :value="movie.title" @input="updateFormTitle">
            </div>
            <div class="form-input">
              <label for="description">Description</label>
              <textarea type="textarea" id="description" name="description" :value="movie.description" @input="updateFormDescription"></textarea>
            </div>
            <div class="form-input">
              <label for="releaseDate" >Date de sortie</label>
              <input type="date" id="releaseDate" name="releaseDate" :value="DateFormatter.methods.formatDateEN(movie.releaseDate)" @input="updateFormReleaseDate">
            </div>
            <button @click="submitForm(movie.id)">Modifier</button>
          </form>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour modifier un film</h3>
            <router-link to="/login">
            <button>Se connecter</button>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="click-outsise" @click="closeModal(movie.id)"></div>
  </div>
</template>