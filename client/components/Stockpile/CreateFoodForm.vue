<!-- Form for registering an account (block style) -->
<template>
    <form @submit.prevent="submit">
        <h3>Create a Food:</h3>
        <article>
            <div><label>Name: </label> <input v-model="name" placeholder=""/></div>
            <br>
            <div><label>Expiration (MM/DD/YYYY): </label> <input v-model="expiration"  placeholder=""/></div>
            <br>
            <div><label>Quantity: </label> <input v-model="quantity" placeholder=""/></div>
            <br>
        </article>
        <button type="submit" :disabled="!(enableSubmit().status == 'ok')">
            Create food
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
    name: "CreateFoodForm",
    data() {
        return {
            name: "",
            expiration: "",
            quantity: "",
            alerts: {},
            callback: null,
            refreshFoods:true
        }
    },
    methods: {
        enableSubmit() {
            let status = "ok";
            let errorToDisplay = "";
            const nameRegex = /^\w+$/i;
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;;
            if (!nameRegex.test(this.name)) {
                errorToDisplay = "Food name must be a nonempty alphanumeric string.";;
                status = "error";
            } else if (!dateRegex.test(this.expiration)) {
                errorToDisplay = "Date must be a MM/DD/YYYY format.";
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
                body: JSON.stringify({ name: this.name, quantity: this.quantity, expiration: this.expiration }),
                message: "Successfully created food",
                callback: () => {
                    this.$set(this.alerts, "Successfully created food", "success");
                    setTimeout(() => this.$delete(this.alerts, "Successfully created food"), 3000);
                },
            };

            try {
                const r = await fetch('/api/foods', options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                this.$store.dispatch("refreshStockpile");
                options.callback();
                this.name="";
                this.quantity="";
                this.expiration="";
                this.$router.push({name: 'Stockpile'});
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