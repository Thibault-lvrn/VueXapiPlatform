<script>
import axios from 'axios';
import { urlBase } from '@/main.js';

export default {
  methods: {
    getNationality() {

      return axios.get(`${urlBase}/api/nationalities`)
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
