<script>
import axios from 'axios';
import { urlBase } from '@/main.js';

export default {
  methods: {
    getMovies() {

      return axios.get(`${urlBase}/api/movies`)
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.error(error);
          throw error; 
        });
    }
  }
};
</script>
