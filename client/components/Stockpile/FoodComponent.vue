<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article class="food">
        <header v-if="!editing">
            <h3 class="name">
                {{ food.name }} (x{{ food.quantity }}) Expires on: {{food.expiration}}
            </h3>

            <div class="actions">
                <button @click="startEditing">
                    ✏️ Edit Quantity
                </button>
                <button @click="deleteFood">
                    🗑️ Delete
                </button>
                <button @click="createListing">
                    Create Listing
                </button>
            </div>
        </header>
        <header v-else>
            <h3 class="name">

                {{ food.name }} (x
                <textarea v-if="editing" class="quantity" :value="draft" @input="draft = $event.target.value" />)
                Expires on: {{food.expiration}}
            </h3>
            
            <div class="actions">
                <button v-if="editing" @click="submitEdit">
                    ✅ Save changes
                </button>
                <button v-if="editing" @click="stopEditing">
                    🚫 Discard changes
                </button>
                <button @click="deleteFood">
                    🗑️ Delete
                </button>
                <button @click="createListing">
                    Create Listing
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
    name: 'FoodComponent',
    components: {},
    props: {
        food: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editing: false, // Whether or not this freet is in edit mode
            alerts: {}, // Displays success/error messages encountered during freet modification
            draft: this.food.quantity,
        };
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.draft = this.food.quantity; // The content of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.draft = this.food.quantity;
        },
        deleteFood() {
            /**
             * Deletes this freet.
             */
            const params = {
                method: 'DELETE',
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully deleted food!', status: 'success'
                    });
                }
            };

            const r = this.request(params);
            console.log(r);
        },
        createListing() {
            pass
        },
        submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            if (this.food.quantity === this.draft) {
                const error = 'Error: Edited food quantity should be different than current food quantity.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }

            const params = {
                method: 'PATCH',
                message: 'Successfully edited quantity!',
                body: JSON.stringify({ quantity: this.draft }),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params);
        },
        async request(params) {
            /**
             * Submits a request to the freet's endpoint
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
                console.log(options);
                const r = await fetch(`/api/foods/${this.food._id}`, options);
                console.log(r);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                this.editing = false;
                this.$store.dispatch("refreshStockpile");
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
.food {
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