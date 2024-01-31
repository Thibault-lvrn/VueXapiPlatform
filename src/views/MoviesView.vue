<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';
import axios from 'axios';
import DateFormatter from '@/components/DateFormatter.vue';

const movies = ref([]);
const pageNumber = ref(parseInt(localStorage.getItem('moviePageNumber')) || 1);
const itemsPerPage = ref(9);
const numberOfPages = ref('');
const lastPageUrl = ref("");
const loading = ref(false);
const modalOpen = ref(false);
const movie = ref({});
const noScroll = ref(false)

const fetchMovie = async (page) => {
  if (page) {
    pageNumber.value = page;
  }

  try {
    const response = await axios.get(`${urlBase}/api/movies?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}`);
    movies.value = response.data;
    lastPageUrl.value = movies.value['hydra:view']["hydra:last"];
    getNumberOfPages();
  } catch (error) {
    console.error(error);
  }
};

const getNumberOfPages = async () => {
  const dernierChiffre = lastPageUrl.value.match(/\d+$/);
  numberOfPages.value = dernierChiffre ? parseInt(dernierChiffre[0], 10) : 0;
}

const nextPage = () => {
  if (pageNumber.value >= numberOfPages.value) {
    pageNumber.value = numberOfPages.value;
  } else {
    pageNumber.value++;
    localStorage.setItem('moviePageNumber', pageNumber.value);
  }
  fetchMovie();
}

const previousPage = () => {
  if (pageNumber.value <= 1) {
    pageNumber.value = 1;
  } else {
    pageNumber.value--;
    localStorage.setItem('moviePageNumber', pageNumber.value);
  }
  fetchMovie();
}

const openModalEdit = (id) => {
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
}

const closeModal = (id) => {
  const body = document.querySelector(`body`);
  const specificModal = document.querySelector(`.modal-${id}`);

  if (specificModal) {
    body.classList.remove('noScroll');
    specificModal.classList.remove('active');
  }
}

const openModalRemove = (id) => {
  const modals = document.querySelectorAll('.modal');
  const body = document.querySelector(`body`);

  modals.forEach((modal) => {
    modal.classList.remove('active');
  });

  const specificModal = document.querySelector(`.modal-remove-${id}`);
  if (specificModal) {
    body.classList.add('noScroll');
    specificModal.classList.add('active');
  }
}

const closeModalRemove = (id) => {
  const specificModal = document.querySelector(`.modal-remove-${id}`);
  const body = document.querySelector(`body`);
  if (specificModal) {
    noScroll.value = false;
    body.classList.remove('noScroll');
    specificModal.classList.remove('active');
  }
}

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
const closeModalAdd = () => {
  const specificModal = document.querySelector(`.modal-add`);
  const body = document.querySelector(`body`);
  if (specificModal) {
    noScroll.value = false;
    body.classList.remove('noScroll');
    specificModal.classList.remove('active');
  }
};

onMounted(() => {
  fetchMovie();
});
</script>

<script>
export default {
  components: {
    DateFormatter,
  },
  data() {
    return {
      formTitle: "",
      formDescription: "",
      formReleaseDate: "",
    };
  },
  methods: {
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
    async deleteMovie(id) {
      const url = `${urlBase}/api/movies/${id}`;
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        username: ` ${localStorage.getItem('user')}`,
        password: `${localStorage.getItem('token')}`
      };

      axios.delete(url, {
        headers: headers,
        data: data
      })
      .then(response => {
        window.location.reload()
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
    async uploadFile(file) {
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Cookie': 'sf_redirect=%7B%22token%22%3A%22b9f283%22%2C%22route%22%3A%22_api_%5C%2Fmedia_objects%7B._format%7D_post%22%2C%22method%22%3A%22POST%22%2C%22controller%22%3A%22App%5C%5CController%5C%5CCreateMediaObjectAction%22%2C%22status_code%22%3A201%2C%22status_text%22%3A%22Created%22%7D',
      };

      const formData = new FormData();
      formData.append('file', file, 'banner_linkedin_EN.jpg');

      try {
        const response = await axios.post('http://localhost:8088/WRA506/index.php/api/media_objects', formData, {
          headers: headers,
        });

        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la requête:', error);
      }
    },
  }
};

</script>

<template>
  <h1>Movies page</h1>

  <div class="movies">
    <div>
      <ul class="pagination">
        <button @click="previousPage()">&lt;</button>
        <templat v-for="page in numberOfPages">
          <button :class="{ active: pageNumber === page }" @click="fetchMovie(page)">
            <span>{{ page }}</span>
          </button>
        </templat>
        <button @click="nextPage()">></button>
      </ul>
    </div>
    <div class="addMovie">
      <button @click="openModalAdd()">Ajouter un film</button>
    </div>
    <ul>
      
      <li class="card" v-for="movie in movies['hydra:member']" :key="movie.id">
        <div class="card-content">

          <MovieCard :movie="movie" v-if="movie" />
          <div class="card-footer">
            <button>
              <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
                Voir plus
              </router-link>
            </button>
            <div class="card_gesture">
              <button class="edit material-symbols-outlined" v-on:click="openModalEdit(movie.id)">edit</button>
              <button class="remove material-symbols-outlined" v-on:click="openModalRemove(movie.id)">delete</button>
            </div>
          </div>
        </div>

        <div class="modal-movie modal" :class="'modal-' + movie.id" @click="test()">
          <div class="modal-content">
            <div class="modal-header">
              <span class="close" v-on:click="closeModal(movie.id)">&times;</span>
            </div>
            <div class="modal-body">
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
            </div>
          </div>
          <div class="click-outsise" @click="closeModal(movie.id)"></div>
        </div>

        <div class="modal-movie modal" :class="'modal-remove-' + movie.id">
          <div class="modal-content modal-content-remove">
            <div class="modal-header">
              <span class="close" v-on:click="closeModalRemove(movie.id)">&times;</span>
            </div>
            <div class="modal-body">
              <p>Etes vous sûr de vouloir supprimer le film</p>
              <div class="btns">
                <button @click="deleteMovie(movie.id)">Oui</button>
                <button @click="closeModalRemove(movie.id)">Non</button>
              </div>
            </div>
          </div>
          <div class="click-outsise" @click="closeModalRemove(movie.id)"></div>
        </div>

        <div class="modal-movie modal modal-add">
          <div class="modal-content">
            <div class="modal-header">
              <span class="close" v-on:click="closeModalAdd()">&times;</span>
            </div>
            <div class="modal-body">
              <h2>Ajouter un film</h2>
              <form>
                <div class="form-input">
                  <label for="title">Titre</label>
                  <input type="text" id="title" name="title" @input="updateFormAddDescription">
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
                  <input type="text" id="notation" name="notation" @input="updateFormAddNotation">
                </div>
                <div class="form-input">
                  <label for="entries">Nombres d'entrées</label>
                  <input type="number" id="entries" name="entries" @input="updateFormAddDescription">
                </div>
                <div class="form-input">
                  <label for="budget">Budget</label>
                  <input type="budget" id="budget" name="budget" @input="updateFormAddBudget">
                </div>
                <div class="form-input">
                  <label for="director">Directeur</label>
                  <input type="text" id="director" name="director" @input="updateFormAddDirector">
                </div>
                <div class="form-input">
                  <label for="director">Image</label>
                  <input type="file" id="director" name="director" @input="updateFormAddDirector">
                </div>
                <button @click="addMovie(movie.id)">Ajouter</button>
              </form>
            </div>
          </div>
          <div class="click-outsise" @click="closeModalAdd()"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>

.card-footer {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  height: 100%;
}

.pagination {
  margin-bottom: 60px;
}

.pagination .active {
  background-color: rgb(58, 58, 58);;
  color: white;
}

.form-input {
  width: 100%;
} 

.form-input  label {
  display: block;
  width: 100%;
}

.noScroll {
  overflow: hidden;
}

.addMovie {
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}

@media (min-width: 1024px) {
  .about {
    display: flex;
  }
}
</style>
