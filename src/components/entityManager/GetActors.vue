<script>
import axios from 'axios';

export default {
  methods: {
    fetchDataWithAuthorization() {
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      };

      return axios.get('http://localhost:8088/WRA506/index.php/api/actors', config)
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.error(error);
          throw error; // relancer l'erreur pour la gérer ailleurs si nécessaire
        });
    }
  }
};
</script>
