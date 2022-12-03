<!-- Form for creating a listing (block style) -->
<template>
    <form @submit.prevent="submit">
        <h3>Create Listing:</h3>
        <article>
            <div><label>Name: {{ $store.state.currentFood.name }}</label></div>
            <br>
            <div><label>Expiration: {{ $store.state.currentFood.expiration }} </label></div>
            <br>
            <div><label>Quantity: </label> <input v-model="quantity" :placeholder="$store.state.currentFood.quantity" />
            </div>
            <br>
            <div><label>Units: {{ ($store.state.currentFood.unit == '') ? 'None' : $store.state.currentFood.unit
            }}</label></div>
            <br>
            <div><label>Price: </label> <input v-model="price"
                    placeholder='examples: $0, free, $2 for 1 or $4 for all, $3 each, $10 total' /></div>
            <br>
        </article>
        <button type="submit" :disabled="!(enableSubmit().status == 'ok')">
            Create listing
        </button>
        <div class="disabledsubmit" v-if="!(enableSubmit().status == 'ok')">
            {{ enableSubmit().errorToDisplay }}
        </div>
        <button type="submit" @click="cancel">
            Cancel
        </button>
        <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </form>
</template>
  
<script>
export default {
    name: "CreateListingForm",
    data() {
        return {
            name: "",
            expiration: "",
            quantity: "",
            price: "",
            alerts: {},
            callback: null,
            refreshFoods: true
        }
    },
    methods: {
        enableSubmit() {
            let status = "ok";
            let errorToDisplay = "";
            const quantityRegex = /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
            if (!quantityRegex.test(this.quantity)) {
                errorToDisplay = "Quantity must be a number greater than 0.";
                status = "error";
            }
            if (this.quantity > this.$store.state.currentFood.quantity) {
                errorToDisplay = "You cannot list a greater quantity than you have in your stockpile.";
                status = "error";
            }
            return { status: status, errorToDisplay: errorToDisplay };
        },
        async submit() {
            /**
             * Submits a form with the specified options from data().
             */
            const options = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin", // Sends express-session credentials with request
                body: JSON.stringify({ foodId: this.$store.state.currentFood._id, name: this.$store.state.currentFood.name, quantity: this.quantity, unit: this.$store.state.currentFood.unit, expiration: this.$store.state.currentFood.rawExpiration, price: this.price }),
                message: "Successfully created listing",
                callback: () => {
                    this.$store.commit('alert', {
                        message: "Successfully created listing", status: 'success'
                    });
                },
            };

            try {
                const r = await fetch('/api/listings', options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                options.callback();
                this.$store.commit('clearCurrentFood');
                this.$store.dispatch('refreshStockpile');
                this.name = "";
                this.quantity = "";
                this.expiration = "";
                this.price = "";
            } catch (e) {
                console.log(e);
                this.$set(this.alerts, e, "error");
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }

        },
        cancel() {
            this.$store.commit('clearCurrentFood');
        },
    },
};
</script>
  
<style scoped>
form {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 14px;
    position: relative;
    background-color: rgb(238, 238, 238);
    box-shadow: 0 12px 12px rgba(0, 0, 0, 0.2);
}

article>div {
    display: flex;
    flex-direction: column;
}

form>article p {
    margin: 0;
}

form h3,
form>* {
    margin: 0.3em 0;
}

form h3 {
    margin-top: 0;
}

textarea {
    font-family: inherit;
    font-size: inherit;
}
</style>