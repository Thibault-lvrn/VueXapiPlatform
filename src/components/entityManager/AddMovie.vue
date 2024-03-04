<script>
import axios from 'axios';
import { urlBase } from '@/main.js';
import GetActors from '@/components/entityManager/GetActors.vue';
import GetCategory from '@/components/entityManager/GetCategory.vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const formTitle = ref('');
    const actors = ref([]);
    const category = ref([]);
    const emptytitle = ref(false);
    const emptyDescription = ref(false);
    const emptyReleaseDate = ref(false);
    const emptyDuration = ref(false);
    const emptyCategory = ref(false);
    const emptyAddEntries = ref(false);
    const emptyAddBudget = ref(false);
    const emptyAddDirector = ref(false);
    const emptyAddWebSite = ref(false);
    const emptyAddImage = ref(false);
    const emptyNotation = ref(false);
    const emptyActor = ref(false);
    const activeNotation = ref(null);
    const router = useRouter();

    onMounted(async () => {
      try {
        const response = await GetActors.methods.getActors();
        actors.value = response['hydra:member'];
      } catch (error) {
        console.error(error);
      }
    });

    onMounted(async () => {
      try {
        const response = await GetCategory.methods.getCategory();
        category.value = response['hydra:member'];
      } catch (error) {
        console.error(error);
      }
    });

    const updateActiveNotation = (note) => {
      activeNotation.value = note;
      emptyNotation.value = false;
    };

    return {
      token,
      formTitle,
      actors,
      category,
      emptytitle,
      emptyDescription,
      emptyReleaseDate,
      emptyDuration,
      emptyCategory,
      emptyAddEntries,
      emptyAddBudget,
      emptyAddDirector,
      emptyAddWebSite,
      emptyAddImage,
      emptyNotation,
      emptyActor,
      activeNotation,
      updateActiveNotation,
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
        selectedActorIds.push(`/MovieProject/Api/WRA506-ApiPlatform-films/public/index.php/api/actors/${select.value}`);
      });

      return selectedActorIds;
    },
    updateFormAddTitle(event) {
      this.formTitle = event.target.value;
      this.emptytitle = false;
    },
    updateFormAddDescription(event) {
      this.formDescription = event.target.value;
      this.emptyDescription = false;
    },
    updateFormAddreleaseDate(event) {
      this.formReleaseDate = event.target.value;
      this.emptyReleaseDate = false;
    },
    updateFormAddDuration(event) {
      this.formDuration = event.target.value;
      this.emptyDuration = false;
    },
    updateFormAddNotation(note) {
      this.formNotation = note;
      this.updateActiveNotation(note);
      this.emptyNotation = false;
    },
    updateFormAddEntries(event) {
      this.formEntries = event.target.value;
      this.emptyAddEntries = false;
    },
    updateFormAddBudget(event) {
      this.formBudget = event.target.value;
      this.emptyAddBudget = false;
    },
    updateFormAddDirector(event) {
      this.formDirector = event.target.value;
      this.emptyAddDirector = false;
    },
    updateFormAddCategory(event) {
      this.formCategory = event.target.value;
      this.emptyCategory = false;
    },
    updateFormAddWebSite(event) {
      this.formWebSite = event.target.value;
      this.emptyAddWebSite = false;
    },
    updateFormAddImage(event) {
      this.formImage = event.target.value;
      this.addImage(this.formImage);
      this.emptyAddImage = false;
    },
    updateFormAddActor(event) {
      this.formActor = event.target.value;
      this.emptyActor = false;
    },
    async addImage(event) {
      const fileInput = event.target.files[0];
      const myHeaders = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const formData = new FormData();
      formData.append('file', fileInput, 'images.jpeg');

      try {
        const response = await axios.post(`${urlBase}/api/media_objects`, formData, {
          headers: myHeaders,
        });
        if (response.data['@id']) {
          this.imageId = response.data['@id'];
        }
      } catch (error) {
        if (error.response.statusText === "Unauthorized") {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeModalAdd();
          this.router.push(`/login`)
        } else {
          console.error('Erreur lors de l\'ajout de l\'image :', error);
        }
      }
    },
    async addMovie() {
      event.preventDefault();
      
      if (!this.formTitle) {
        this.emptytitle = true;
      }
      if (!this.formDescription) {
        this.emptyDescription = true;
      }
      if (!this.formReleaseDate) {
        this.emptyReleaseDate = true;
      }
      if (!this.formDuration) {
        this.emptyDuration = true;
      }
      if (!this.formCategory) {
        this.emptyCategory = true;
      } else if (this.formCategory === "--choisir une catégorie--") {
        this.emptyCategory = true;
      }
      if (!this.formEntries) {
        this.emptyAddEntries = true;
      }
      if (!this.formBudget) {
        this.emptyAddBudget = true;
      }
      if (!this.formDirector) {
        this.emptyAddDirector = true;
      }
      if (!this.formWebSite) {
        this.emptyAddWebSite = true;
      }
      if (!this.imageId) {
        this.emptyAddImage = true;
      }
      if (!this.formNotation) {
        this.emptyNotation = true;
      }
      if (!this.formActor) {
        this.emptyActor = true;
      } else if (this.formActor === "--choisir un acteur--") {
        this.emptyActor = true;
      }
      if (this.emptytitle || this.emptyDescription || this.emptyReleaseDate || this.emptyDuration || this.emptyCategory || this.emptyAddEntries || this.emptyAddBudget || this.emptyAddDirector || this.emptyAddWebSite || this.emptyAddImage || this.emptyNotation || this.emptyActor ) {
        return;
      }


      const selectedActorIds = this.getSelectedActorsIds();

      try {
        const response = await axios.post(`${urlBase}/api/movies`, {
          category: `/MovieProject/Api/WRA506-ApiPlatform-films/public/index.php/api/categories/${this.formCategory}`,
          actor: selectedActorIds,
          title: this.formTitle,
          description: this.formDescription,
          releaseDate: this.formReleaseDate,
          duration: parseInt(this.formDuration),
          note: parseFloat(this.formNotation),
          entries: parseInt(this.formEntries),
          budget: parseInt(this.formBudget),
          director: this.formDirector,
          website: this.formWebSite,
          file: [
            this.imageId
          ]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        this.closeModalAdd();
        this.router.push(`/FicheMovie/${response.data.id}`)
      } catch (error) {
        if (error.response.statusText === "Unauthorized") {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeModalAdd();
          this.router.push(`/login`)
        } else {
          console.error('Erreur lors de l\'ajout du film :', error);
        }
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
              <span class="error" :class="{ active: emptytitle }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="description">Description</label>
              <textarea type="textarea" id="description" name="description" @input="updateFormAddDescription"></textarea>
              <span class="error" :class="{ active: emptyDescription }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="releaseDate" >Date de sortie</label>
              <input type="date" id="releaseDate" name="releaseDate" @input="updateFormAddreleaseDate">
              <span class="error" :class="{ active: emptyReleaseDate }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="duration" >Durée du film</label>
              <input type="number" id="duration" name="duration" @input="updateFormAddDuration">
              <span class="error" :class="{ active: emptyDuration }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="notation" >Note</label>
              <div class="star-notation-container">
                <button v-for="i in 10" :key="i" type="button" class="star-notation" :class="{ active: activeNotation === i }" @click="updateFormAddNotation(i)">{{ i }}</button>
              </div>
              <span class="error" :class="{ active: emptyNotation }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="entries">Nombres d'entrées</label>
              <input type="number" id="entries" name="entries" @input="updateFormAddEntries">
              <span class="error" :class="{ active: emptyAddEntries }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="budget">Budget</label>
              <input type="number" id="budget" name="budget" @input="updateFormAddBudget">
              <span class="error" :class="{ active: emptyAddBudget }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="director">Directeur</label>
              <input type="text" id="director" name="director" @input="updateFormAddDirector">
              <span class="error" :class="{ active: emptyAddDirector }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="actors">Acteurs</label> 
              <div id="actorsContainer" v-if="actors">
                <select name="actors" id="actors" class="actorSelect" @input="updateFormAddActor">
                  <option>--choisir un acteur--</option>
                  <option v-for="actor in actors" :value="actor.id">{{ actor.firstName }} {{ actor.lastName }}</option>
                </select>
                <span class="error" :class="{ active: emptyActor }">Ce champ est requis</span>
              </div>
              <div class="little-button-container">
                <button type="button" @click="addActorField">+</button>
                <button type="button" @click="removeLastActorField">-</button>
              </div>
            </div>
            <div class="form-input">
              <label for="director">categories</label>
              <div v-if="category">
                <select name="categories" id="categories" @input="updateFormAddCategory">
                  <option>--choisir une catégorie--</option>
                  <option v-for="cat in category" :value="cat.id">{{ cat.name }}</option>
                </select>
                <span class="error" :class="{ active: emptyCategory }">Ce champ est requis</span>
              </div> 
            </div>
            <div class="form-input">
              <label for="director">Site web</label>
              <input type="text" id="webSite" name="website" @input="updateFormAddWebSite">
              <span class="error" :class="{ active: emptyAddWebSite }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="director">Image</label>
              <input type="file" id="director" name="director" @change="addImage">
            </div>
            <button class="card-button" @click="addMovie()">Ajouter</button>
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