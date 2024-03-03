<script>
import axios from 'axios';
import { urlBase } from '@/main.js';

export default {
  methods: {
    getActors() {
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      };

      return axios.get(`${urlBase}/api/actors`, config)
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
