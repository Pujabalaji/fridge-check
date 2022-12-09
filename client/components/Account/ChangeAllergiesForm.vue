<!-- Form for changing allergies (block style) -->
<template>
  <BForm @submit.prevent="submit">
    <h3>Change allergies</h3>
    <article>
      <BFormGroup id="allergies" label="Allergies" label-for="allergies">
        <BFormCheckboxGroup id="allergies" v-model="selectedAllergies">
          <BFormCheckbox value="Peanut">Peanuts</BFormCheckbox>
          <BFormCheckbox value="Tree Nut">Tree Nuts</BFormCheckbox>
          <BFormCheckbox value="Seafood">Seafood</BFormCheckbox>
          <BFormCheckbox value="Shellfish">Shellfish</BFormCheckbox>
          <BFormCheckbox value="Soy">Soy</BFormCheckbox>
          <BFormCheckbox value="Dairy">Dairy</BFormCheckbox>
          <BFormCheckbox value="Egg">Egg</BFormCheckbox>
          <BFormCheckbox value="Gluten">Gluten</BFormCheckbox>
        </BFormCheckboxGroup>
      </BFormGroup>
    </article>
    <BButton type="submit" variant="primary" block>Change allergies</BButton>
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
  name: "ChangeAllergiesForm",
  data() {
    return {
      selectedAllergies: this.$store.state.user?.allergies,
      alerts: {},
      callback: null,
    };
  },
  methods: {
    async submit() {
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
        body: JSON.stringify({ allergies: this.selectedAllergies }),
        callback: () => {
          this.$set(this.alerts, "Successfully updated allergies", "success");
          setTimeout(
            () => this.$delete(this.alerts, "Successfully updated allergies"),
            3000
          );
        },
      };

      try {
        const r = await fetch("/api/users", options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.$store.commit("setUser", res.user ? res.user : null);
        this.$store.commit("clearRecipes");
        this.$store.commit("updateShowSuggested", false);
        this.$store.commit("updateShowByName", false);
        options.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>