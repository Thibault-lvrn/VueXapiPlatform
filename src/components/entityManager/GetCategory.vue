<script>
import axios from 'axios';
import { urlBase } from '@/main.js';

export default {
  methods: {
    getCategory() {
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      };

      return axios.get(`${urlBase}/api/categories`, config)
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
