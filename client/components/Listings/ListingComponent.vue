<!-- Reusable component representing a single food and its actions -->

<template>
  <article>
    <BCard class="listing">
      <div v-if="!editing">
        <div>
          <header>
            <h2 class="name">
              {{ listing.name + quantityUnitText }}
            </h2>
          </header>
          <p>Price: {{ listing.price }}</p>
          <div v-if="listing.username !== $store.state.user?.username" class="user-info">
            <p>User: {{ listing.username }}</p>
            <p>Community: {{ listing.community }}</p>
            <p>Email {{ listing.email }} to claim</p>
          </div>
          <p>Expires on: {{ listing.expiration }}</p>
        </div>
        <div v-if="listing.username === $store.state.user?.username" class="actions">
          <BButton @click="startEditing" variant="info">
            <BIconstack>
              <BIconClipboard stacked />
              <BIconPencil scale="0.50" shift-v="-1" stacked />
            </BIconstack>
            <span>Edit Quantity or Price</span>
          </BButton>
          <BButton @click="callDeleteListing" variant="info">
            <BIconClipboardX /> <span>Delete Listing</span>
          </BButton>
        </div>
      </div>
      <header v-else>
        <h3 class="name">
          {{ listing.name }} (x
          <BFormInput v-if="editing" class="quantity" type="number" min="0" :max="listing.foodId.quantity" step="0.01"
            v-model="draft.quantity" :state="!showErrors || isValidQuantity ? null : false" />
          {{ listing.unit }}) Price:
          <BFormInput v-if="editing" class="price" type="text" v-model="draft.price"
            :state="!showErrors || isValidPrice ? null : false" />
          Expires on: {{ listing.expiration }}
        </h3>

        <p v-if="showErrors && !isValidQuantity" class="feedback">Quantity must be greater than 0 and less than what is
          in the stockpile. </p>
        <p v-if="showErrors && !isValidPrice" class="feedback">Price must contain at least one character. </p>

        <div class="actions">
          <BButton v-if="editing" @click="submitEdit" variant="info">
            <BIconCheck2 /> <span>Save changes</span>
          </BButton>
          <BButton v-if="editing" @click="stopEditing" variant="info">
            <BIconX /> <span>Discard changes</span>
          </BButton>
          <BButton @click="callDeleteListing" variant="info">
            <BIconClipboardX /> <span>Delete Listing</span>
          </BButton>
        </div>
      </header>
    </BCard>
    <BAlert v-for="(status, alert, index) in alerts" :key="index" :variant="status === 'error' ? 'danger' : 'success'"
      show>
      {{ alert }}
    </BAlert>
  </article>
</template>
  
<script>
export default {
  name: "ListingComponent",
  props: {
    listing: {
      type: Object,
      required: true,
    },
    myListings: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this object is in edit mode
      alerts: {}, // Displays success/error messages encountered during object modification
      draft: { quantity: this.listing.quantity, price: this.listing.price },
      showErrors: false,
    };
  },
  computed: {
    quantityUnitText() {
      return " (x"+this.listing.quantity+((this.listing.unit) ? (" " + this.listing.unit) : "")+")";
    },
    isValidQuantity() {
      const quantityRegex =
        /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
      if (!quantityRegex.test(this.draft.quantity)) {
        return false;
      }

      if (this.draft.quantity > this.listing.foodId.quantity) {
        return false;
      }
      return true;
    },
    isValidPrice() {
      if (this.draft.price.length == 0) {
        return false;
      }
      return true;
    },
    shouldSubmit() {
      return this.isValidQuantity && this.isValidPrice;
    }
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this object.
       */
      this.editing = true; // Keeps track of if a object is being edited
      this.draft = {
        quantity: this.listing.quantity,
        price: this.listing.price,
      }; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this object.
       */
      this.editing = false;
      this.draft = {
        quantity: this.listing.quantity,
        price: this.listing.price,
      };
    },
    callDeleteListing() {
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete this listing.', {
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
              this.deleteListing();
            }
          })
          .catch(err => {
            // An error occurred
          })
    },
    deleteListing() {
      /**
       * Deletes this object.
       */
      this.$bvModal.hide('bv-modal-deletelisting');
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted listing!",
            status: "success",
          });
        },
      };
      const r = this.request(params);
      this.$store.dispatch("refreshStockpile");
    },
    submitEdit() {
      /**
       * Updates object to have the submitted draft content.
       */
      if (!this.shouldSubmit) {
        this.showErrors = true;
        return;
      }

      const quantityRegex =
        /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
      if (!quantityRegex.test(this.draft.quantity)) {
        const error =
          "Error: Edited food quantity should be greater than 0. If you have eaten the food delete it instead.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const params = {
        method: "PATCH",
        message: "Successfully edited listing!",
        body: JSON.stringify({
          quantity: this.draft.quantity,
          price: this.draft.price,
        }),
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
        const r = await fetch(`/api/listings/${this.listing._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.editing = false;
        this.showErrors = false;
        if (this.myListings) {
          this.$store.dispatch("refreshMyListings");
        } else {
          this.$store.dispatch("refreshAllListings");
        }
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

.listing {
  background-color: #d0ebff;
}

.name {
  font-size: 1.25em;
}

.actions {
  display: flex;
  gap: 1em;
}

p+p,
.user-info,
.user-info+p {
  margin-top: -1em;
}

input {
  display: inline;
  width: 10em;
}

.feedback {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: red;
  font-size: 80%;
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