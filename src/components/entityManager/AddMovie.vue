<script>
import axios from 'axios';
import { ref } from 'vue';
import GetActors from '@/components/entityManager/GetActors.vue';
import { onMounted } from 'vue';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const formTitle = ref('');
    const actors = ref([]);

    onMounted(async () => {
      try {
        const response = await GetActors.methods.fetchDataWithAuthorization();
        actors.value = response['hydra:member'];
      } catch (error) {
        console.error(error);
      }
    });

    return {
      token,
      formTitle,
      actors,
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
    addActorField() {
      const actorsContainer = document.getElementById('actorsContainer');

      const newSelect = document.createElement('select');
      newSelect.name = 'actors';
      newSelect.id = 'actors';
      newSelect.className = 'actorSelect';

      for (const actor of this.actors) {
        const option = document.createElement('option');
        option.value = actor.id;
        option.text = `${actor.firstName} ${actor.lastName}`;
        newSelect.appendChild(option);
      }

      actorsContainer.appendChild(newSelect);
    },
    removeLastActorField() {
      const actorsContainer = document.getElementById('actorsContainer');
      const selects = actorsContainer.querySelectorAll('.actorSelect');
      if (selects.length > 1) {
        actorsContainer.removeChild(selects[selects.length - 1]);
      }
    },
    getSelectedActorsIds() {
      const actorsContainer = document.getElementById('actorsContainer');
      const selects = actorsContainer.querySelectorAll('.actorSelect');
      const selectedActorIds = [];

      selects.forEach(select => {
        selectedActorIds.push(`/WRA506/index.php/api/actors/${select.value}`);
      });

      return selectedActorIds;
    },
    updateFormAddTitle(event) {
      this.formTitle = event.target.value;
    },
    updateFormAddDescription(event) {
      this.formDescription = event.target.value;
    },
    updateFormAddreleaseDate(event) {
      this.formReleaseDate = event.target.value;
    },
    updateFormAddDuration(event) {
      this.formDuration = event.target.value;
    },
    updateFormAddNotation(note) {
      this.formNotation = note;
    },
    updateFormAddEntries(event) {
      this.formEntries = event.target.value;
    },
    updateFormAddBudget(event) {
      this.formBudget = event.target.value;
    },
    updateFormAddDirector(event) {
      this.formDirector = event.target.value;
    },
    async addMovie() {
      event.preventDefault();
      
      const selectedActorIds = this.getSelectedActorsIds();

      const myHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };

      const data = {
        category: "/WRA506/index.php/api/categories/2",
        actor: selectedActorIds,
        title: this.formTitle,
        description: this.formDescription,
        releaseDate: this.formReleaseDate,
        duration: this.formDuration,
        note: this.formNotation,
        entries: parseInt(this.formEntries),
        budget: this.formBudget,
        director: this.formDirector,
        website: "http://maillard.fr/recusandae-distinctio-et-ut-est-voluptas-libero-reiciendis"
      };

      const requestOptions = {
        method: 'post',
        url: 'http://localhost:8088/WRA506/index.php/api/movies',
        headers: myHeaders,
        data: data
      };

      try {
        const response = await axios.post('http://localhost:8088/WRA506/index.php/api/movies', {
          category: "/WRA506/index.php/api/categories/2",
          actor: [
            "/WRA506/index.php/api/actors/3",
            "/WRA506/index.php/api/actors/9"
          ],
          title: this.formTitle,
          description: this.formDescription,
          releaseDate: this.formReleaseDate,
          duration: parseInt(this.formDuration),
          note: parseFloat(this.formNotation),
          entries: parseInt(this.formEntries),
          budget: parseInt(this.formBudget),
          director: this.formDirector,
          website: "http://maillard.fr/recusandae-distinctio-et-ut-est-voluptas-libero-reiciendis"
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        window.location.reload()
      } catch (error) {
        console.error('Erreur lors de l\'ajout du film :', error);
      }
    }
  }
};
</script>

<template>
  <div class="modal-movie modal modal-add">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModalAdd()">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <h2>Ajouter un film</h2>
          <form>
            <div class="form-input">
              <label for="title">Titre</label>
              <input type="text" id="title" name="title" @input="updateFormAddTitle">
            </div>
            <div class="form-input">
              <label for="description">Description</label>
              <textarea type="textarea" id="description" name="description" @input="updateFormAddDescription"></textarea>
            </div>
            <div class="form-input">
              <label for="releaseDate" >Date de sortie</label>
              <input type="date" id="releaseDate" name="releaseDate" @input="updateFormAddreleaseDate">
            </div>
            <div class="form-input">
              <label for="duration" >Durée du film</label>
              <input type="number" id="duration" name="duration" @input="updateFormAddDuration">
            </div>
            <div class="form-input">
              <label for="notation" >Note</label>
              <div class="star-notation-container">
                <button type="button" class="star-notation" @click="updateFormAddNotation(1)">1</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(2)">2</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(3)">3</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(4)">4</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(5)">5</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(6)">6</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(7)">7</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(8)">8</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(9)">9</button>
                <button type="button" class="star-notation" @click="updateFormAddNotation(10)">10</button>
              </div>
            </div>
            <div class="form-input">
              <label for="entries">Nombres d'entrées</label>
              <input type="number" id="entries" name="entries" @input="updateFormAddEntries">
            </div>
            <div class="form-input">
              <label for="budget">Budget</label>
              <input type="number" id="budget" name="budget" @input="updateFormAddBudget">
            </div>
            <div class="form-input">
              <label for="director">Directeur</label>
              <input type="text" id="director" name="director" @input="updateFormAddDirector">
            </div>
            <div class="form-input">
              <label for="actors">Acteurs</label> 
              <div id="actorsContainer" v-if="actors">
                <select name="actors" id="actors" class="actorSelect">
                  <option v-for="actor in actors" :value="actor.id">{{ actor.firstName }} {{ actor.lastName }}</option>
                </select>
              </div>
              <button type="button" @click="addActorField">Ajouter un autre acteur</button>
              <button type="button" @click="removeLastActorField">Supprimer un acteur</button>
            </div>
            <div class="form-input">
              <label for="director">categories</label> 
              <select name="categories" id="categories">
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                <option value="3">Category 3</option>
                <option value="4">Category 4</option>
              </select>
            </div>
            <!-- <div class="form-input">
              <label for="director">Image</label>
              <input type="file" id="director" name="director" @input="updateFormAddImage">
            </div> -->
            <button @click="addMovie()">Ajouter</button>
          </form>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour ajouter un film</h3>
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