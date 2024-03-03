<script>
import axios from 'axios';
import { urlBase } from '@/main.js';
import GetNationality from '@/components/entityManager/GetNationality.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const formFirstName = ref('');
    const formLastName = ref('');
    const formNationality = ref('');
    const formReward = ref('');
    const nationality = ref([]);
    const emptyFirstName = ref(false);
    const emptyLastName = ref(false);
    const emptyNationality = ref(false);
    const emptyReward = ref(false); 
    const router = useRouter();

    onMounted(async () => {
      try {
        const response = await GetNationality.methods.getNationality();
        nationality.value = response['hydra:member'];
      } catch (error) {
        console.error(error);
      }
    });
    
    return {
      token,
      formFirstName,
      formLastName,
      formNationality,
      formReward,
      nationality,
      emptyFirstName,
      emptyLastName,
      emptyNationality,
      emptyReward,
      router
    };
  },
  methods: {
    closeModalAdd() {
      const specificModal = document.querySelector(`.modal-add`);
      const body = document.querySelector(`body`);
      if (specificModal) {
        body.classList.remove('noScroll');
        specificModal.classList.remove('active');
      }
    },
    openModalAdd() {
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
    },
    async addActor() {
      event.preventDefault();

      if (this.formFirstName === '') {
        this.emptyFirstName = true;
      } else {
        this.emptyFirstName = false;
      }

      if (this.formLastName === '') {
        this.emptyLastName = true;
      } else {
        this.emptyLastName = false;
      }

      if (this.formNationality === '') {
        this.emptyNationality = true;
      } else {
        this.emptyNationality = false;
      }

      if (this.formReward === '') {
        this.emptyReward = true;
      } else {
        this.emptyReward = false;
      }

      if (!this.formFirstName || !this.formLastName || !this.formNationality || !this.formReward) {
        return;
      }

      try {
        const response = await axios.post(`${urlBase}/api/actors`, {
          firstName: this.formFirstName,
          lastName: this.formLastName,
          nationality: `/MovieProject/Api/WRA506-ApiPlatform-films/public/index.php/api/nationalities/${this.formNationality}`,
          reward: this.formReward
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        this.closeModalAdd();
        this.router.push(`/FicheActor/${response.data.id}`)
      } catch (error) {
        if (error.response.statusText === "Unauthorized") {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeModalAdd();
          this.router.push(`/login`)
        } else {
          console.error('Erreur lors de l\'ajout de l\'acteur :', error);
        }
      }
    }
  }
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
              <span class="error" :class="{ active: emptyFirstName }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="lastName">Nom</label>
              <input type="text" id="lastName" name="lastName" v-model="formLastName">
              <span class="error" :class="{ active: emptyLastName }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="director">nationalité</label>
              <div v-if="nationality">
                <select name="nationality" id="nationality" @change="formNationality = $event.target.value">
                  <option>--choisir une nationalitée--</option>
                  <option v-for="nation in nationality" :value="nation.id">{{ nation.name }}</option>
                </select>
                <span class="error" :class="{ active: emptyNationality }">Ce champ est requis</span>
              </div> 
            </div>
            <div class="form-input">
              <label for="reward">Récompense</label>
              <input type="text" id="reward" name="reward" v-model="formReward">
              <span class="error" :class="{ active: emptyReward }">Ce champ est requis</span>
            </div>
            <button @click="addActor()" class="card-button">Ajouter</button>
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
