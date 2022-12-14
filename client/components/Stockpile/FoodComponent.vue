<!-- Reusable component representing a single food and its actions -->

<template>
  <BCard class="food">
    <header v-if="!editing">
      <h3 class="name">
        {{ food.name + quantityUnitText }}
      </h3>
      <p>
        Expires on: {{ food.expiration }}
      </p>

      <div class="actions">
        <BButton @click="startEditing" variant="info">
          <BIconPencilFill /> <span>Edit Quantity</span>
        </BButton>
        <BButton @click="callThrowAway" variant="info">
          <BIconTrash /> <span>Thrown Away</span>
        </BButton>
        <BButton @click="callDeleteFood" variant="info">
          <img src="../../public/apple-core.svg" width="25" height="25" /> <span>Eaten</span>
        </BButton>
        <BButton v-if="enableCreateListing && showListingButton" @click="createListing" variant="info">
          <BIconClipboardPlus /> <span>Create Listing</span>
        </BButton>
        <BButton v-else-if="$store.state.foodIdsWithListings.includes(food._id) && showListingButton" @click="viewListing" variant="info">
          <BIconClipboard /> <span>View Listing</span>
        </BButton>
      </div>
    </header>
    <header v-else>
      <h3 class="name">
        {{ food.name }} (x
        <BFormInput v-if="editing" class="quantity" type="number" min="0" step="0.01"
            v-model="draft" :state="!showErrors || isValidQuantity ? null : false" /> {{food.unit}})
        Expires on: {{ food.expiration }}
      </h3>
      <div class="actions">
        <BButton v-if="editing" @click="submitEdit" variant="info">
          <BIconCheck2 /> <span>Save changes</span>
        </BButton>
        <BButton v-if="editing" @click="stopEditing" variant="info">
          <BIconX /> <span>Discard changes</span>
        </BButton>
        <BButton @click="callThrowAway" variant="info">
          <BIconTrash /> <span>Thrown Away</span>
        </BButton>
        <BButton @click="callDeleteFood" variant="info">
          <img src="../../public/apple-core.svg" width="25" height="25" /> <span>Eaten</span>
        </BButton>
        <BButton v-if="enableCreateListing && showListingButton" variant="info" @click="createListing">
          <span>Create Listing</span>
        </BButton>
        <BButton v-else-if="$store.state.foodIdsWithListings.includes(food._id) && showListingButton"
          @click="viewListing" variant="info">
          <BIconClipboard /> <span>View Listing</span>
        </BButton>
      </div>
    </header>
    <BAlert v-for="(status, alert, index) in alerts" :key="index" :variant="status === 'error' ? 'danger' : 'success'"
      show>
      {{ alert }}
    </BAlert>
  </BCard>
</template>
  
<script>
export default {
  name: "FoodComponent",
  props: {
    food: {
      type: Object,
      required: true,
    },
    showListingButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this object is in edit mode
      alerts: {}, // Displays success/error messages encountered during object modification
      draft: this.food.quantity,
      thrownAway: false,
    };
  },
  methods: {
    callDeleteFood() {
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete food.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            if (value) {
              this.thrownAway = false;
              this.deleteFood();
            }
          })
          .catch(err => {
            // An error occurred
          })

      // this.deleteFood();
    },
    callThrowAway() {
      this.$bvModal.msgBoxConfirm('Please confirm that you want to throw away food.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            if (value) {
              this.thrownAway = true;
              this.deleteFood();
            }
          })
          .catch(err => {
            // An error occurred
          })

      // this.deleteFood();
    },
    async deleteFood() {
      /**
       * Deletes this food and any associated listings.
       */
      this.$bvModal.hide('bv-modal-deletefood');
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted food!",
            status: "success",
          });
        },
        body: JSON.stringify({ thrownAway: this.thrownAway }),
      };
      const r = this.request(params);
      this.$store.commit("clearRecipes");
      this.$store.commit("updateShowSuggested", false);
      this.$store.commit("updateShowByName", false);
      if (this.$store.state.foodIdsWithListings.includes(this.food._id)) {
        this.$store.dispatch("refreshMyListings");
      }
    },
    startEditing() {
      /**
       * Enables edit mode on this object.
       */
      this.editing = true; // Keeps track of if a object is being edited
      this.draft = this.food.quantity; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this object.
       */
      this.editing = false;
      this.draft = this.food.quantity;
    },
    isValidQuantity() {
      const quantityRegex =
        /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
      if (!quantityRegex.test(this.draft)) {
        return false;
      }
      return true;
    },
    async createListing() {
      this.$emit('createListing');
      this.$store.commit("enableCreateListing", this.food);
    },
    viewListing() {
      this.$router.push({ name: "My Listings" });
    },
    submitEdit() {
      /**
       * Updates object to have the submitted draft content.
       */
      const quantityRegex =
        /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
      if (this.food.quantity === this.draft) {
        const error =
          "Error: Edited food quantity should be different than current food quantity.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      } else if (!quantityRegex.test(this.draft)) {
        const error =
          "Error: Edited food quantity should be greater than 0. If you have eaten the food delete it instead.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited quantity!",
        body: JSON.stringify({ quantity: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the object's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/foods/${this.food._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.editing = false;
        this.$store.dispatch("refreshStockpile");
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
  computed: {
    quantityUnitText() {
      return " (x" + this.food.quantity + ((this.food.unit) ? (" " + this.food.unit) : "") + ")";
    },
    enableCreateListing() {
      const foodsExpiredOrListingExists = [];
      for (const foodId of this.$store.state.foodIdsWithListings) {
        foodsExpiredOrListingExists.push(foodId);
      }
      for (const food of this.$store.state.expired) {
        foodsExpiredOrListingExists.push(food._id);
      }
      return (
        !this.food.prepared &&
        !foodsExpiredOrListingExists.includes(this.food._id)
      );
    },
  },
};
</script>
  
<style scoped>
p {
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 1em;
}

.food {
  background-color: #d0ebff;
}

.name {
  font-size: 1.25em;
}

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

input {
  display: inline;
  width: 10em;
}

.danger {
  border-color: red;
  background-color: red;
}

.buttons {
  gap: 0.25em;
  display: flex;
  align-items: center;
}
</style>