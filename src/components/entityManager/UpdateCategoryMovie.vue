<script>
import { urlBase } from '@/main.js';
import axios from 'axios';
import getMovie from '@/components/entityManager/GetMovie.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';

export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const token = localStorage.getItem('token');
    const movies = ref([]);
    const emptyMovie = ref(false);

    onMounted(async () => {
      try {
        const response = await getMovie.methods.getMovies();
        movies.value = response['hydra:member'];

      } catch (error) {
        console.error(error);
      }
    });

    return {
      token,
      formTitle: "",
      formDescription: "",
      formReleaseDate: "",
      selectedImage: null,
      movies,
      emptyMovie,
    };
  },
  methods: {
    openModalAddMovie(id) {
      const modals = document.querySelectorAll('.modal');
      const body = document.querySelector(`body`);

      modals.forEach((modal) => {
        modal.classList.remove('active');
      });

      const specificModal = document.querySelector(`.modalAddMovie-${id}`);
      if (specificModal) {
        body.classList.add('noScroll');
        specificModal.classList.add('active');
      }
    },
    closeModal(id) {
      const body = document.querySelector(`body`);
      const specificModal = document.querySelector(`.modalAddMovie-${id}`);

      if (specificModal) {
        body.classList.remove('noScroll');
        specificModal.classList.remove('active');
      }
    },
    addMovieField(id) {
      const moviesAddContainer = document.getElementById('moviesAddContainer-' + id);

      const newSelect = document.createElement('select');
      newSelect.name = 'movies';
      newSelect.id = 'movies';
      newSelect.className = 'movieSelect';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.text = '--choisir un film--';
      newSelect.appendChild(defaultOption);

      for (const movie of this.movies) {
        const option = document.createElement('option');
        option.value = movie.id;
        option.text = movie.title;
        newSelect.appendChild(option);
      }

      moviesAddContainer.appendChild(newSelect);
    },
    removeLastMovieField(id) {
      const moviesAddContainer = document.getElementById('moviesAddContainer-' + id);
      const selects = moviesAddContainer.querySelectorAll('.movieSelect');
      if (selects.length > 1) {
        moviesAddContainer.removeChild(selects[selects.length - 1]);
      }
    },
    getSelectedMovieIds(id) {
      const moviesContainer = document.getElementById('moviesAddContainer-' + id);
      const selects = moviesContainer.querySelectorAll('.movieSelect');
      const selectedActorIds = [];
      this.noActors = false;
      
      if (selects.length === 0) {
        this.noActors = true;
      }
      selects.forEach(select => {
        
        if (select.value) {
          selectedActorIds.push(`/api/movies/${select.value}`);
        } else {
          
        }
      });

      return selectedActorIds;
    },
    updateFormName(event) {
      this.formName = event.target.value;
    },
    async submitForm(id) {
      event.preventDefault();

      const myHeaders = {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };

      const movieData = this.getSelectedMovieIds(this.category.id);

      if (movieData.length === 0) {
        this.emptyMovie = true;
        return;
      } else {
        this.emptyMovie = false;
      }

      const requests = movieData.map(async element => {
        const requestOptions = {
          method: 'patch',
          url: `${urlBase}${element}`,
          headers: myHeaders,
          data: {
            category: `/MovieProject/Api/WRA506-ApiPlatform-films/public/index.php/api/categories/${id}`,
          },
        };

        try {
          const response = await axios(requestOptions);
          return response;
        } catch (error) {
          console.error(error);
          throw error; 
        }
      });

      try {
        await Promise.all(requests);
        window.location.reload();
      } catch (error) {
        if (error.response.statusText === "Unauthorized") {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.closeModalAdd();
          this.router.push(`/login`)
        } else {
          console.error('Erreur lors de la l\'ajout du film :', error);
        }
      }
    }
  },
};
</script>

<template>

  <div class="modal-category modal" :class="'modalAddMovie-' + category.id">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" v-on:click="closeModal(category.id)">&times;</span>
      </div>
      <div class="modal-body">
        <template v-if="token">
          <h2>Ajouter des films à la catégorie</h2>
          <form>
            <div class="form-input">
              <label for="movies">Film</label> 
              <div :id="'moviesAddContainer-' + category.id" class="moviesAddContainer" v-if="movies">
                <select name="movies" id="movies" class="movieSelect">
                  <option value="">--choisir un film--</option>
                  <option v-for="movie in movies" :value="movie.id">{{ movie.title }}</option>
                </select>
                <span class="error" :class="{ active: emptyMovie }">Ce champ est requis</span>
              </div>
              <div class="little-button-container">
                <button type="button" @click="addMovieField(category.id)">+</button>
                <button type="button" @click="removeLastMovieField(category.id)">-</button>
              </div>
            </div>
            <button @click="submitForm(category.id)" class="card-button">Ajouter</button>
          </form>
        </template>
        <template v-if="!token">
          <div>
            <h3>Vous devez être connecté pour modifier les films d'une categorie</h3>
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