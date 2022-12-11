<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <BForm @submit.prevent="submit">
    <BFormGroup :label="label" label-for="search-input">
      <BInputGroup>
        <BFormInput id="search-input" v-model="value" type="text" :placeholder="placeholder" />
        <BInputGroupAppend>
          <BButton type="submit" variant="primary">
            <BIconSearch /> <span>{{ button }} </span>
          </BButton>
        </BInputGroupAppend>
      </BInputGroup>
    </BFormGroup>
    <BAlert
      v-for="(status, alert, index) in alerts"
      :key="index"
      :variant="status === 'error' ? 'danger' : 'success'"
      show
    >
      {{ alert }}
    </BAlert>
  </BForm>
</template>

<script>
export default {
  name: "InlineForm",
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    button: {
      type: String,
      default: "Submit",
    },
    label: {
      type: String,
      default: "",
    }
  },
  data() {
    return { value: "", alerts: {} };
  },
};
</script>

<style scoped>
button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

</style>
