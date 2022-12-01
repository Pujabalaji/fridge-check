<!-- Form for creating a listing (block style) -->
<template>
    <form @submit.prevent="submit">
        <h3>Create Listing:</h3>
        <article>
            <div><label>Name: {{$store.state.currentFood.name}}</label></div>
            <br>
            <div><label>Expiration: {{$store.state.currentFood.expiration}} </label></div>
            <br>
            <div><label>Quantity: </label> <input v-model="quantity" :placeholder="$store.state.currentFood.quantity"/></div>
            <br>
            <div><label>Price: </label> <input v-model="price" placeholder='$0'/></div>
            <br>
        </article>
        <button type="submit" :disabled="!(enableSubmit().status == 'ok')">
            Create listing
        </button>
        <div class="disabledsubmit" v-if="!(enableSubmit().status == 'ok')">
            {{ enableSubmit().errorToDisplay }}
        </div>
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
            const quantityRegex = /^[1-9][0-9]*$/;
            if (!quantityRegex.test(this.quantity)) {
                errorToDisplay = "Quantity must be an integer greater than 0.";
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
                body: JSON.stringify({ name: this.$store.state.currentFood.name, quantity: this.quantity, expiration: this.$store.state.currentFood.rawExpiration, price: this.price, email: this.$store.state.user.email }),
                message: "Successfully created listing",
                callback: () => {
                    this.$set(this.alerts, "Successfully created listing", "success");
                    setTimeout(() => this.$delete(this.alerts, "Successfully created listing"), 3000);
                },
            };

            try {
                const r = await fetch('/api/listings', options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                this.$store.commit('clearCurrentFood');
                options.callback();
                this.name = "";
                this.quantity = "";
                this.expiration = "";
                this.price = "";
                this.$router.push({ name: 'My Listings' });
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