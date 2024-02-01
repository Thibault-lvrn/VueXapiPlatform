<script>
export default {
  methods: {
    closeModalAdd() {
    },
    openModalAdd() {
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
    },
    closeModalAdd() {
      const specificModal = document.querySelector(`.modal-add`);
      const body = document.querySelector(`body`);
      if (specificModal) {
        body.classList.remove('noScroll');
        specificModal.classList.remove('active');
      }
    },
  },
};
</script>

<template>
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
</template>