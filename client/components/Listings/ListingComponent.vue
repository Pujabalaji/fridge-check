<!-- Reusable component representing a single food and its actions -->

<template>
    <article class="listing">
        <header v-if="!editing">
            <h3 class="name">
                {{ listing.name }} ( x{{ listing.quantity }} {{ listing.unit }})
                
                Expires on: {{ listing.expiration }}

                Price: {{ listing.price }}
            </h3>

            <div class="actions">
                <button @click="startEditing">
                    ✏️ Edit Quantity or Price
                </button>
                <button @click="deleteListing">
                    🗑️ Delete Listing
                </button>
            </div>
        </header>
        <header v-else>
            <h3 class="name">
                {{ listing.name }} (x
                <textarea v-if="editing" class="quantity" :value="draft.quantity" @input="draft.quantity = $event.target.value" /> {{ listing.unit }})
                Price: 
                <textarea v-if="editing" class="price" :value="draft.price" @input="draft.price = $event.target.value" />
                Expires on: {{ listing.expiration }}
            </h3>

            <div class="actions">
                <button v-if="editing" @click="submitEdit">
                    ✅ Save changes
                </button>
                <button v-if="editing" @click="stopEditing">
                    🚫 Discard changes
                </button>
                <button @click="deleteListing">
                    🗑️ Delete Listing
                </button>
            </div>
        </header>
        <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
</template>
  
<script>

export default {
    name: 'ListingComponent',
    components: {},
    props: {
        listing: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editing: false, // Whether or not this object is in edit mode
            alerts: {}, // Displays success/error messages encountered during object modification
            draft: {quantity: this.listing.quantity, price: this.listing.price}
        };
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this object.
             */
            this.editing = true; // Keeps track of if a object is being edited
            this.draft = {quantity: this.listing.quantity, price: this.listing.price}; // The content of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this object.
             */
            this.editing = false;
            this.draft = {quantity: this.listing.quantity, price: this.listing.price};
        },
        deleteListing() {
            /**
             * Deletes this object.
             */
            const params = {
                method: 'DELETE',
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully deleted listing!', status: 'success'
                    });
                }
            };

            const r = this.request(params);
            console.log(r);
        },
        submitEdit() {
            /**
             * Updates object to have the submitted draft content.
             */
            const quantityRegex = /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
            if (!quantityRegex.test(this.draft.quantity)) {
                const error = 'Error: Edited food quantity should be greater than 0. If you have eaten the food delete it instead.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }
            const params = {
                method: 'PATCH',
                message: 'Successfully edited listing!',
                body: JSON.stringify({ quantity: this.draft.quantity, price: this.draft.price }),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
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
                method: params.method, headers: { 'Content-Type': 'application/json' }
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
                this.$store.dispatch("refreshMyListings");
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>
  
<style scoped>
.listing {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    background-color: #eee;
}
</style>