<!-- Default page that also displays stockpile -->

<template>
    <main v-if="$store.state.username">
        <section>
            <header>
                <h2>My Stockpile</h2>
            </header>
            <br>
            <div class="row">
                <div class="column">
                    <h3>Expired</h3>
                    <section v-if="$store.state.expired.length">
                        <FoodComponent v-for="food in $store.state.expired" :key="food._id" :food="food" />
                    </section>
                    <article v-else>
                        <h4>No expired food in your fridge :)</h4>
                    </article>
                    <br>
                    <h3>Expiring</h3>
                    <section v-if="$store.state.expiring.length">
                        <FoodComponent v-for="food in $store.state.expiring" :key="food._id" :food="food" />
                    </section>
                    <article v-else>
                        <h4>No food about to expire :)</h4>
                    </article>
                    <br>
                    <h3>Food not expiring soon</h3>
                    <section v-if="$store.state.remainingFoods.length">
                        <FoodComponent v-for="food in $store.state.remainingFoods" :key="food._id" :food="food" />
                    </section>
                    <article v-else>
                        <h4>There is no food in your stockpile.</h4>
                    </article>
                </div>
                <div v-if="$store.state.currentFood" class="column">
                    <CreateListingForm />
                    <CreateFoodForm />
                </div>
                <div v-else class="column">
                    <CreateFoodForm />
                </div>
            </div>
        </section>
    </main>
    <main v-else>
        <section>
            <article>
                <h3>
                    <router-link to="/login">
                        Sign in
                    </router-link>
                    to track your stockpile and search recipes.
                </h3>
            </article>
        </section>
    </main>
</template>
  
<script>
import FoodComponent from '@/components/Stockpile/FoodComponent.vue';
import CreateFoodForm from '@/components/Stockpile/CreateFoodForm.vue';
import CreateListingForm from '@/components/Listings/CreateListingForm.vue';

export default {
    name: 'StockpilePage',
    components: { FoodComponent, CreateFoodForm, CreateListingForm },
    created() {
        if (this.$store.state.username) {
            this.$store.dispatch("refreshStockpile");
        }
    }
};
</script>
  
<style scoped>
section {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    gap: 1em;
}

.column {
    flex: 1;
}
</style>