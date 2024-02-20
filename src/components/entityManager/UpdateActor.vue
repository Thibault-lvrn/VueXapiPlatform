<script setup>
import { urlBase } from '@/main.js';
</script>
<script>
import { urlBase } from '@/main.js';
import { ref } from 'vue';
import axios from 'axios';
import DateFormatter from '@/components/entityManager/DateFormatter.vue';

export default {
  props: {
    actor: {
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
    updateFormfirstName(event) {
      this.formfirstName = event.target.value;
    },
    updateFormlastName(event) {
      this.formlastName = event.target.value;
    },
    updateFormReward(event) {
      this.formReward = event.target.value;
    },
    // updateFormReleaseDate(event) {
    //   this.formReleaseDate = event.target.value;
    // },
    async submitForm(id) {
      event.preventDefault();

      const firstName = this.formfirstName;
      const lastName = this.formlastName;
      const reward = this.formReward;

      const myHeaders = {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };

      const data = {};

      if (firstName !== '') {
        data.firstName = firstName;
      }

      if (lastName !== '') {
        data.lastName = lastName;
      }

      if (reward !== '') {
        data.reward = reward;
      }

      const requestOptions = {
        method: 'patch',
        url: `${urlBase}/api/actors/${id}`,
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

  <div class="modal-actor modal" :class="'modal-' + actor.id">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModal(actor.id)">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <h2>Modifier le film</h2>
          <form>
            <div class="form-input">
              <label for="title">Nom</label>
              <input type="text" id="title" name="title" :value="actor.lastName" @input="updateFormlastName">
            </div>
            <div class="form-input">
              <label for="description">Prénom</label>
              <input type="text" id="description" name="description" :value="actor.firstName" @input="updateFormfirstName" />
            </div>
            <div class="form-input">
              <label for="reward">Récompense</label>
              <input type="text" id="reward" name="reward" :value="actor.reward" @input="updateFormReward">
            </div>
            <!-- <div class="form-input">
              <label for="releaseDate" >Nationalitée</label>
              <input type="date" id="releaseDate" name="releaseDate" :value="DateFormatter.methods.formatDateEN(actor.releaseDate)" @input="updateFormReleaseDate">
            </div> -->
            <button @click="submitForm(actor.id)">Modifier</button>
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
    <div class="click-outsise" @click="closeModal(actor.id)"></div>
  </div>
</template>