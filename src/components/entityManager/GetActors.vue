<script>
import axios from 'axios';
import { urlBase } from '@/main.js';

export default {
  methods: {
    getActors() {
      return axios.get(`${urlBase}/api/actors`)
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
