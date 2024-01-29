<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';
import axios from 'axios';
import DateFormatter from '@/components/DateFormatter.vue';

const movies = ref([]);
const pageNumber = ref(parseInt(localStorage.getItem('moviePageNumber')) || 1);
const itemsPerPage = ref(9);
const numberOfPages = ref(5);
const lastPageUrl = ref("");
const loading = ref(false);
const modalOpen = ref(false);
const movie = ref({});
const movieDate = ref('2023-04-11');

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

const openModal = (id) => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    modal.classList.remove('active');
  });

  const specificModal = document.querySelector(`.modal-${id}`);
  if (specificModal) {
    specificModal.classList.add('active');
  }
}

const closeModal = (id) => {
  const specificModal = document.querySelector(`.modal-${id}`);
  if (specificModal) {
    specificModal.classList.remove('active');
  }
}

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
  },
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

    <ul>
      
      <li class="card" v-for="movie in movies['hydra:member']" :key="movie.id">
        <div class="card-content">

          <MovieCard :movie="movie" v-if="movie" />
          <div class="card-footer">
            <button v-on:click="openModal(movie.id)">Modifier</button>
            <button>
              <router-link :to="{ name: 'FicheMovie', params: { id: movie.id } }">
                Voir plus
              </router-link>
            </button>
          </div>
        </div>

        <div class="modal-movie modal" :class="'modal-' + movie.id">
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

@media (min-width: 1024px) {
  .about {
    display: flex;
  }

  .pagination {
    margin-bottom: 60px;
  }

  .card button {
    width: 100%;
  }
}
</style>
