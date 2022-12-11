<!-- Form for creating a food (block style) -->
<template>
  <BForm @submit.prevent="submit" @reset.prevent="reset">
    <h3>Add a Food:</h3>
    <article>
      <BFormGroup id="name" label="Name" label-for="name">
        <BFormInput
          id="name"
          v-model="name"
          type="text"
          :state="!showErrors || isValidName ? null : false"
        />
        <BFormInvalidFeedback>
          Food name must be a nonempty string
        </BFormInvalidFeedback>
      </BFormGroup>
      <div class="form-row">
        <BFormGroup id="expiration" label="Expiration" label-for="expiration">
          <BFormInput
            id="expiration"
            v-model="expiration"
            type="date"
            :state="!showErrors || isValidDate ? null : false"
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
            :state="!showErrors || isValidQuantity ? null : false"
          />
          <BFormInvalidFeedback>
            Quantity must be a number greater than zero with up to two decimal
            places
          </BFormInvalidFeedback>
        </BFormGroup>
        <BFormGroup id="unit" label="Units" label-for="unit">
          <BFormSelect id="unit" v-model="unit" :options="unitOptions" />
        </BFormGroup>
      </div>
      <BFormGroup
        id="prepared"
        label="Is this leftovers of a meal you made or purchased?"
        label-cols="5"
      >
        <BFormRadioGroup>
          <BFormRadio
            v-model="prepared"
            :prepared="prepared"
            name="prepared"
            value="true"
            >Yes</BFormRadio
          >
          <BFormRadio
            v-model="prepared"
            :prepared="prepared"
            name="prepared"
            value="false"
            >No</BFormRadio
          >
          <BFormInvalidFeedback
            :state="!showErrors || isValidPreparedFoodCheck ? null : false"
          >
            You must indicate whether or not this is a prepared food
          </BFormInvalidFeedback>
        </BFormRadioGroup>
      </BFormGroup>
    </article>
    <div class="container-buttons">
      <BButton type="submit" variant="primary"> Create food </BButton>
      <BButton type="reset" variant="danger"> Cancel </BButton>
    </div>
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
        { value: "", text: "None" },
        { value: "sticks", text: "Sticks" },
        { value: "oz", text: "Oz" },
        { value: "g", text: "g" },
        { value: "lbs", text: "lbs" },
        { value: "tsps", text: "Tsp" },
        { value: "tbsps", text: "Tbsp" },
        { value: "cups", text: "Cups" },
        { value: "pints", text: "Pints" },
        { value: "quarts", text: "Quarts" },
        { value: "gallons", text: "Gallons" },
      ],
      prepared: "",
      alerts: {},
      callback: null,
      refreshFoods: true,
      showErrors: false,
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
    isValidPreparedFoodCheck() {
      return this.prepared !== "";
    },
    enableSubmit() {
      return (
        this.isValidName &&
        this.isValidDate &&
        this.isValidQuantity &&
        this.isValidPreparedFoodCheck
      );
    },
  },
  methods: {
    reset() {
      this.name = "";
      this.quantity = "";
      this.expiration = "";
      this.unit = "";
      this.prepared = "";
      this.showErrors = false;
      this.$emit('hide');
    },
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      if (!this.enableSubmit) {
        this.showErrors = true;
        return;
      }

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
        reset();
        this.$store.commit("clearRecipes");
        this.$store.commit("updateShowSuggested", false);
        this.$store.commit("updateShowByName", false);
      } catch (e) {
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

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 1em;
}

.form-row > * {
  flex: 1;
}

div {
  margin-left: 0;
  margin-right: 0;
}

.custom-radio {
  margin-right: 0.5em;
}

.container-buttons {
  display: flex;
  gap: 1em;
  padding-right: 0em;
  padding-left: 0em;
}

.container-buttons > * {
  flex: 1;
}
</style>