<script>
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue';
import GetNationality from '@/components/entityManager/GetNationality.vue';
import { urlBase } from '@/main.js';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const formFirstName = ref('');
    const formLastName = ref('');
    const formNationality = ref('');
    const formReward = ref('');
    const nationality = ref([]);

    onMounted(async () => {
      try {
        const response = await GetNationality.methods.getNationality();
        nationality.value = response['hydra:member'];
      } catch (error) {
        console.error(error);
      }
    });

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

    const addActor = async () => {
      event.preventDefault();


      console.log("add Actor")

      try {
        const response = await axios.post(`${urlBase}/api/actors`, {
          firstName: formFirstName.value,
          lastName: formLastName.value,
          nationality: `/WRA506/index.php/api/nationalities/${formNationality.value}`,
          reward: formReward.value
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'acteur :', error);
      }
    };

    return {
      token,
      formFirstName,
      formLastName,
      formNationality,
      formReward,
      closeModalAdd,
      openModalAdd,
      addActor,
      nationality,
    };
  },
};
</script>

<template>
  <div class="modal-actor modal modal-add">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModalAdd()">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <h2>Ajouter un acteur</h2>
          <form>
            <div class="form-input">
              <label for="firstName">Prénom</label>
              <input type="text" id="firstName" name="firstName" v-model="formFirstName">
            </div>
            <div class="form-input">
              <label for="lastName">Nom</label>
              <input type="text" id="lastName" name="lastName" v-model="formLastName">
            </div>
            <div class="form-input">
              <label for="director">nationalité</label>
              <div v-if="nationality">
                <select name="nationality" id="nationality" @change="formNationality = $event.target.value">
                  <option v-for="nation in nationality" :value="nation.id">{{ nation.name }}</option>
                </select>
              </div> 
            </div>
            <div class="form-input">
              <label for="reward">Récompense</label>
              <input type="text" id="reward" name="reward" v-model="formReward">
            </div>
            <button @click="addActor()">Ajouter</button>
          </form>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour ajouter un acteur</h3>
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
