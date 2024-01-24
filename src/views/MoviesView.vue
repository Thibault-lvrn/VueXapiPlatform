<script setup>
import { ref } from 'vue';
import MovieCard from '@/components/MovieCard.vue';
import { urlBase } from '@/main.js';
import { onMounted } from 'vue';
import axios from 'axios';

const movies = ref([]);
const pageNumber = ref(parseInt(localStorage.getItem('moviePageNumber')) || 1);
const itemsPerPage = ref(9);
const numberOfPages = ref(5);
const lastPageUrl = ref("");
const loading = ref(false);
const modalOpen = ref(false);
const movie = ref({});

const fetchMovie = async (page) => {
  if (page) {
    pageNumber.value = page;
  }

  try {
    const response = await axios.get(`${urlBase}/api/movies?page=${pageNumber.value}&itemsPerPage=${itemsPerPage.value}`);
    movies.value = response.data;
//    const newmovies = response.data['hydra:member'];
//    movies.value.splice(0, movies.value.length, ...newmovies);
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

const submitForm = async (id) => {
  event.preventDefault();

  const myHeaders = {
    'Content-Type': 'application/merge-patch+json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };

  const data = {
    title: movie.title,
    description: movie.description,
    releaseDate: movie.releaseDate
  };

  const requestOptions = {
    method: 'patch',
    url: `${urlBase}/api/movies/${id}`,
    headers: myHeaders,
    data: data,
  };

  try {
    const response = await axios(requestOptions);
    console.log(response.data);
  } catch (error) {
    console.error('error', error);
  }
};

</script>
<!-- <script>
export default {
  data() {
    return {
      movie: {
        title: '',
        description: '',
        releaseDate: '',
        // Add other form fields here
      }
    };
  },
  methods: {
    submitForm(id) {
      event.preventDefault();
      // Use formData in your Axios request
      const myHeaders = {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      };

      // Define data
      const data = {
        title: this.movie.title,
        description: this.movie.description,
        releaseDate: this.movie.releaseDate
      };
      // Define Axios request configuration
      const requestOptions = {
        method: 'patch', // Note that HTTP methods are lowercase in Axios
        url: `http://localhost:8088/WRA506/index.php/api/movies/${id}`,
        headers: myHeaders,
        data: data,
      };

      // Make the Axios request
      const response = axios(requestOptions)
        console.log(response)
        .then(response => console.log(response.data))
        .catch(error => console.error('error', error));
    },
  },
};
</script> -->

<template>
  <div class="about">
    <h1>This is the Movies page</h1>
  </div>

  <div class="movies">
    <h2>Movies</h2>
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
                <label for="title">Titre</label>
                <input type="text" id="title" name="title" v-model="movie.title">
                <label for="description">Description</label>
                <textarea type="textarea" id="description" name="description" v-model="movie.description"></textarea>
                <label for="releaseDate" >Date de sortie</label>
                <input type="date" id="releaseDate" name="releaseDate" v-model="movie.releaseDate">
                <button v-on:click="submitForm(movie.id)">Modifier</button>
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
