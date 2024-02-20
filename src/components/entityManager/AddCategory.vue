<script>
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { urlBase } from '@/main.js';
import getMovie from '@/components/entityManager/GetMovie.vue';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const CategoryName = ref('');
    const movies = ref([]);
    const emptyCategory = ref(false);
    const emptyMovie = ref(false);

    onMounted(async () => {
      try {
        const response = await getMovie.methods.getMovies();
        // console.log(response);
        movies.value = response['hydra:member'];
      } catch (error) {
        console.error(error);
      }
    });

    return {
      token,
      CategoryName,
      movies,
      emptyCategory,
      emptyMovie,
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
      // console.log('openModalAdd');
      
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
    addMovieField() {
      const moviesContainer = document.getElementById('moviesContainer');

      const newSelect = document.createElement('select');
      newSelect.name = 'movie';
      newSelect.id = 'movie';
      newSelect.className = 'movieSelect';

      // Ajouter une option par défaut "Sélectionner un film"
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.text = '--choisir une catégorie--';
      newSelect.appendChild(defaultOption);

      for (const movie of this.movies) {
        const option = document.createElement('option');
        option.value = movie.id;
        option.text = movie.title;
        newSelect.appendChild(option);
      }

      moviesContainer.appendChild(newSelect);
    },
    removeLastMovieField() {
      const moviesContainer = document.getElementById('moviesContainer');
      const selects = moviesContainer.querySelectorAll('.movieSelect');
      if (selects.length > 1) {
        moviesContainer.removeChild(selects[selects.length - 1]);
      }
    },
    getSelectedMovieIds() {
      const moviesContainer = document.getElementById('moviesContainer');
      const selects = moviesContainer.querySelectorAll('.movieSelect');
      const selectedActorIds = [];

      
      selects.forEach(select => {
        
        console.log("select",select.value);
        if (select.value) {
          console.log("select.value",select.value);
          selectedActorIds.push(`/WRA506/index.php/api/movies/${select.value}`);
        } else {
          
        }
      });

      return selectedActorIds;
    },
    async addCategory() {
      event.preventDefault();

      const selectedActorIds = this.getSelectedMovieIds();

      if (!this.CategoryName) {
        this.emptyCategory = true;
      } else {
        this.emptyCategory = false;
      }

      if (selectedActorIds.length === 0) {
        console.log("empty movie");
        this.emptyMovie = true;
      } else {
        this.emptyMovie = false;
      }

      if (this.emptyCategory || this.emptyMovie) {
        return;
      }

      try {
        const response = await axios.post(`${urlBase}/api/categories`, {
          name: this.CategoryName,
          movies: selectedActorIds
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie :', error);
      }
    }
  }
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
              <input type="text" id="categoryName" name="categoryName" v-model="CategoryName">
              <span class="error" :class="{ active: emptyCategory }">Ce champ est requis</span>
            </div>
            <div class="form-input">
              <label for="categoryMovies">Ajouter des films</label>
              <div id="moviesContainer" v-if="movies">
                <select name="categories" id="categoryMovies" @input="updateCategoryNameMovie" class="movieSelect" required>
                    <option value="">--choisir une catégorie--</option>
                    <option v-for="movie in movies" :value="movie.id">{{ movie.title }}</option>
                </select>
                <span class="error" :class="{ active: emptyMovie }">Ce champ est requis</span>
              </div>
              <div class="little-button-container">
                <button type="button" @click="addMovieField">+</button>
                <button type="button" @click="removeLastMovieField">-</button>
              </div>
            </div>
            <button type="submit" @click="addCategory()">Ajouter</button>
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