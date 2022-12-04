<!-- Form for changing dietary restrictions (block style) -->
<template>
  <BForm @submit.prevent="submit">
    <h3>Change dietary restrictions</h3>
    <article>
      <BFormGroup
        id="other"
        label="Other dietary restrictions"
        label-for="other"
      >
        <BFormCheckboxGroup id="other" v-model="selectedOtherRestrictions">
          <BFormCheckbox value="Vegetarian">Vegetarian</BFormCheckbox>
          <BFormCheckbox value="Vegan">Vegan</BFormCheckbox>
          <BFormCheckbox value="Pescetarian">Pescatarian</BFormCheckbox>
        </BFormCheckboxGroup>
      </BFormGroup>
    </article>
    <BButton type="submit" variant="primary" block>
      Change dietary restrictions
    </BButton>
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
  name: "ChangeDietaryRestrictionsForm",
  data() {
    return {
      selectedOtherRestrictions:
        this.$store.state.user?.otherDietaryRestrictions,
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
        body: JSON.stringify({
          otherDietaryRestrictions: this.selectedOtherRestrictions,
        }),
        callback: () => {
          this.$set(
            this.alerts,
            "Successfully updated dietary restrictions",
            "success"
          );
          setTimeout(
            () =>
              this.$delete(
                this.alerts,
                "Successfully updated dietary restrictions"
              ),
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
        options.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>