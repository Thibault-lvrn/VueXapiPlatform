<script setup>
import RemoveActor from '@/components/entityManager/RemoveActor.vue';
import UpdateActor from '@/components/entityManager/UpdateActor.vue';
import AddActor from '@/components/entityManager/AddActor.vue';

defineProps({
  actor: {
    type: Object,
    required: true
  },
  callerComponent: {
    type: String,
    default: '',
  },
})
</script>
<template v-if="actor">
  <div class="card-content">
    <h4>{{ actor.firstName }} {{ actor.lastName }}</h4>
    <div>
      <span>Nationalitée : </span>
      <span>{{ actor.nationality.name }}</span>
    </div>
    <div class="card-footer">
      <router-link :to="{ name: 'FicheActor', params: { id: actor.id } }">
        <button>
          Voir plus
        </button>
      </router-link>
    </div>
    <div class="card_gesture" v-if="callerComponent === 'MoviesView'">
        <button class="gesture edit material-symbols-outlined" v-on:click="UpdateActor.methods.openModalEdit(actor.id)">
          edit
        </button>
        <button class="gesture remove material-symbols-outlined" v-on:click="RemoveActor.methods.openModalRemove(actor.id)">
          delete
        </button>
      </div>
  </div>
    <!-- modifications modals -->
    <template v-if="callerComponent === 'MoviesView'">
      <UpdateActor :actor="actor"/>
      <RemoveActor :actorId="actor.id"/>
      <AddActor/>
    </template>
    <!-- end -->
</template>
