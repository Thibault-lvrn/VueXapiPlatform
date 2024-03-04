<script>
import axios from 'axios';
import { urlBase } from '@/main.js';

export default {
  methods: {
    getCategory() {
      return axios.get(`${urlBase}/api/categories`)
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
