<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <BForm @submit.prevent="submit">
    <BFormInput v-model="value" type="text" :placeholder="placeholder" />
    <BButton type="submit" variant="primary"> {{ button }} </BButton>
    <BAlert v-for="(status, alert, index) in alerts" :key="index" :variant="status === 'error' ? 'danger' : 'success'"
      show>
      {{ alert }}
    </BAlert>
  </BForm>
</template>

<script>
export default {
  name: 'InlineForm',
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
    return { value: '', alerts: {} };
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
