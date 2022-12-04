<!-- Form for creating a food (block style) -->
<template>
  <BForm @submit.prevent="submit">
    <h3>Create a Food:</h3>
    <article>
      <BFormGroup id="name" label="Name" label-for="name">
        <BFormInput id="name" v-model="name" type="text" :state="isValidName" />
        <BFormInvalidFeedback>
          Food name must be a nonempty string
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="expiration" label="Expiration" label-for="expiration">
        <BFormInput
          id="expiration"
          v-model="expiration"
          type="date"
          :state="isValidDate"
        />
        <BFormInvalidFeedback>
          Date must be a mm/dd/yyyy format.
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="quantity" label="Quantity" label-for="quantity">
        <BFormInput
          id="quantity"
          v-model="quantity"
          type="number"
          min="0"
          step="0.01"
          :state="isValidQuantity"
        />
        <BFormInvalidFeedback>
          Quantity must be a number greater than zero with up to two decimal
          places
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormInvalidFeedback>
        Quantity must be an integer greater than 0
      </BFormInvalidFeedback>
      <BFormGroup id="unit" label="Units" label-for="unit">
        <BFormSelect id="unit" v-model="unit" :options="unitOptions" />
      </BFormGroup>
      <BFormCheckbox
        id="prepared"
        v-model="prepared"
        name="prepared"
        :value="true"
        :unchecked-value="false"
        >Is this leftovers of a food you made?</BFormCheckbox
      >
    </article>
    <BButton type="submit" variant="primary" :disabled="!enableSubmit">
      Create food
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
  name: "CreateFoodForm",
  data() {
    return {
      name: "",
      expiration: "",
      quantity: "",
      unit: "",
      unitOptions: [
        { value: "", text: "" },
        { value: "sticks", text: "Sticks" },
        { value: "oz", text: "Oz" },
        { value: "g", text: "g" },
        { value: "tsps", text: "Tsp" },
        { value: "tbsps", text: "Tbsp" },
        { value: "cups", text: "Cups" },
        { value: "pints", text: "Pints" },
        { value: "quarts", text: "Quarts" },
        { value: "gallons", text: "Gallons" },
      ],
      prepared: false,
      alerts: {},
      callback: null,
      refreshFoods: true,
    };
  },
  computed: {
    isValidName() {
      if (this.name.length == 0) {
        return false;
      }
      return true;
    },
    isValidDate() {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(this.expiration)) {
        return false;
      }
      return true;
    },
    isValidQuantity() {
      const quantityRegex =
        /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
      if (!quantityRegex.test(this.quantity)) {
        return false;
      }
      return true;
    },
    enableSubmit() {
      return this.isValidName && this.isValidDate && this.isValidQuantity;
    },
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
        body: JSON.stringify({
          name: this.name,
          quantity: this.quantity,
          expiration: this.expiration,
          unit: this.unit,
          prepared: this.prepared,
        }),
        message: "Successfully created food",
        callback: () => {
          this.$set(this.alerts, "Successfully created food", "success");
          setTimeout(
            () => this.$delete(this.alerts, "Successfully created food"),
            3000
          );
        },
      };

      try {
        const r = await fetch("/api/foods", options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.$store.dispatch("refreshStockpile");
        options.callback();
        this.name = "";
        this.quantity = "";
        this.expiration = "";
        this.unit = "";
        this.prepared = false;
        this.$store.commit("clearRecipes");
        this.$store.commit("updateShowSuggested", false);
        this.$store.commit("updateShowByName", false);
      } catch (e) {
        console.log(e);
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
article {
  margin-bottom: 1em;
}
</style>