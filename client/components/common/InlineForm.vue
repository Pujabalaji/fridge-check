<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <input v-model="value" type="text" :placeholder="placeholder" />
    <button type="submit">
      {{ button }}
    </button>
    <BAlert
      v-for="(status, alert, index) in alerts"
      :key="index"
      :variant="status === 'error' ? 'danger' : 'success'"
      show
    >
      {{ alert }}
    </BAlert>
  </form>
</template>

<script>
import {
  BAlert,
} from "bootstrap-vue";
export default {
  name: 'InlineForm',
  components: {BAlert},
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {value: '', alerts: {}};
  }
};
</script>

<style scoped>
form {
  display: flex;
  position: relative;
}

input {
  padding: 0 5px;
  min-width: 200px;
}
</style>
