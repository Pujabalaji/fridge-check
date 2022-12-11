<!-- Form for creating a listing (block style) -->
<template>
  <BForm @submit.prevent="submit" @reset.prevent="cancel">
    <h3>Create Listing:</h3>
    <article>
      <BFormGroup id="listing-name" label="Name" label-for="listing-name">
        <BFormInput
          id="listing-name"
          v-model="$store.state.currentFood.name"
          type="text"
          :disabled="true"
        />
      </BFormGroup>
      <BFormGroup
        id="listing-expiration"
        label="Expiration"
        label-for="listing-expiration"
      >
        <BFormInput
          id="listing-expiration"
          v-model="$store.state.currentFood.expiration"
          type="text"
          label-for="listing-expiration"
          :disabled="true"
        />
      </BFormGroup>
      <BFormGroup
        id="listing-quantity"
        label="Quantity"
        label-for="listing-quantity"
        :invalid-feedback="isValidQuantity.display"
        :state="!showErrors || isValidQuantity.valid ? null : false"
      >
        <BInputGroup :append="$store.state.currentFood.unit">
          <BFormInput
            id="listing-quantity"
            type="number"
            min="0"
            :max="$store.state.currentFood.quantity"
            step="0.01"
            v-model="quantity"
            label-for="listing-quantity"
            :state="!showErrors || isValidQuantity.valid ? null : false"
          />
        </BInputGroup>
      </BFormGroup>
      <BFormGroup id="listing-price" label="Price" label-for="listing-price">
        <BFormInput
          id="listing-price"
          v-model="price"
          type="text"
          placeholder="examples: $0, free, $2 for 1 or $4 for all, $3 each, $10 total"
          :state="!showErrors || isValidPrice.valid  ? null : false"
        />
        <BFormInvalidFeedback>
          {{ isValidPrice.display }}
        </BFormInvalidFeedback>
      </BFormGroup>
    </article>
    <div class="container">
      <BButton type="submit" variant="primary">
        Create listing
      </BButton>
      <BButton type="reset" variant="danger">Cancel</BButton>
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
  name: "CreateListingForm",
  data() {
    return {
      name: "",
      expiration: "",
      quantity: this.$store.state.currentFood.quantity,
      price: "",
      alerts: {},
      callback: null,
      refreshFoods: true,
      showErrors: false,
    };
  },
  computed: {
    isValidQuantity() {
      const quantityRegex =
        /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
      if (!quantityRegex.test(this.quantity)) {
        return {
          valid: false,
          display: "Quantity must be a number greater than 0",
        };
      }

      if (this.quantity > this.$store.state.currentFood.quantity) {
        return {
          valid: false,
          display: "Quantity must be less than what is in the stockpile.",
        };
      }
      return { valid: true, display: "" };
    },
    isValidPrice() {
      if (this.price.length == 0) {
        return {
          valid: false,
          display: "Price must contain at least one character",
        };
      }
      return {
        valid: true,
        display: "",
      };
    },
    enableSubmit() {
      return this.isValidQuantity.valid && this.isValidPrice.valid;
    },
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */

      if (!this.enableSubmit) {
        this.showErrors = true;
        return;
      }

      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
        body: JSON.stringify({
          name: this.$store.state.currentFood.name,
          quantity: this.quantity,
          unit: this.$store.state.currentFood.unit,
          expiration: this.$store.state.currentFood.rawExpiration,
          price: this.price,
        }),
        message: "Successfully created listing",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully created listing",
            status: "success",
          });
        },
      };

      try {
        const r = await fetch(
          `/api/listings/${this.$store.state.currentFood._id}`,
          options
        );
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        options.callback();
        this.$store.commit("clearCurrentFood");
        this.$store.dispatch("refreshStockpile");
        this.name = "";
        this.quantity = "";
        this.expiration = "";
        this.price = "";
        this.showErrors = false;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    cancel() {
      this.$store.commit("clearCurrentFood");
    },
  },
};
</script>

<style scoped>
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