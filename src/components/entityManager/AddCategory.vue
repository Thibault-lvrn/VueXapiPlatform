<script>
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { urlBase } from '@/main.js';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const formCategory = ref('');

    const closeModalAdd = () => {
      const specificModal = document.querySelector(`.modal-add`);
      const body = document.querySelector(`body`);
      if (specificModal) {
        body.classList.remove('noScroll');
        specificModal.classList.remove('active');
      }
    };

    const openModalAdd = () => {
      const modals = document.querySelectorAll('.modal');
      const body = document.querySelector(`body`);

      modals.forEach((modal) => {
        modal.classList.remove('active');
      });

      const specificModal = document.querySelector(`.modal-add`);
      if (specificModal) {
        body.classList.add('noScroll');
        specificModal.classList.add('active');
      }
    };

    const addCategory = async () => {
      event.preventDefault();
    
      try {
        const response = await axios.post(`${urlBase}/api/categories`, {
          name: formCategory.value
          // Ajoutez d'autres champs de catégorie si nécessaire
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie :', error);
      }
    };

    return {
      token,
      formCategory,
      closeModalAdd,
      openModalAdd,
      addCategory,
    };
  },
};
</script>

<template>
  <div class="modal-category modal modal-add">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModalAdd()">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <h2>Ajouter une catégorie</h2>
          <form>
            <div class="form-input">
              <label for="categoryName">Nom de la catégorie</label>
              <input type="text" id="categoryName" name="categoryName" v-model="formCategory">
            </div>
            <button @click="addCategory()">Ajouter</button>
          </form>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour ajouter une catégorie</h3>
            <router-link to="/login">
              <button>Se connecter</button>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="click-outsise" @click="closeModalAdd()"></div>
  </div>
</template>