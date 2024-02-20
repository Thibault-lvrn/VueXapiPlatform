<script>
export default {
  props: {
    inputDate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formattedDate: this.formatDate(this.inputDate),
    };
  },
  methods: {
    formatDateFR(isoDate) {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    formatDateEN(isoDate) {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<template>
  <span>{{ formattedDate }}</span>
</template>