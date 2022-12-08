<!-- Default page that also displays stockpile -->

<template>
    <main>
        <header v-if="$store.state.stockpileFilter">
            <h2>My Stockpile Filtered by "{{ $store.state.stockpileFilter }}"</h2>
        </header>
        <header v-else>
            <h2>My Stockpile</h2>
        </header><br>
        <div v-if="$store.state.username" class="container">
            <div>
                <GetFoodsForm ref="GetFoodsForm" value="foodName" placeholder="🔍 Filter by food name (optional)"
                    button="🔄 Get foods" />
                <h3>Expired</h3>
                <section v-if="$store.state.expired.length" class="food-container">
                    <FoodComponent v-for="food in $store.state.expired" :key="food._id" :food="food" />
                </section>
                <article v-else>
                    <h4>No expired food in your fridge :)</h4>
                </article><br>
                <h3>Expiring</h3>
                <section v-if="$store.state.expiring.length" class="food-container">
                    <FoodComponent v-for="food in $store.state.expiring" :key="food._id" :food="food" />
                </section>
                <article v-else>
                    <h4>No food about to expire :)</h4>
                </article><br>
                <h3>Food not expiring soon</h3>
                <section v-if="$store.state.remainingFoods.length" class="food-container">
                    <FoodComponent v-for="food in $store.state.remainingFoods" :key="food._id" :food="food" />
                </section>
                <article v-else>
                    <h4>There is no food in your stockpile.</h4>
                </article>
            </div>
            <div>
                <CreateListingForm v-if="$store.state.currentFood" />
                <CreateFoodForm />
            </div>
        </div>
        <section v-else>
            <article>
                <h3>
                    <router-link to="/login">Sign in</router-link>
                    to track your stockpile and search recipes.
                </h3>
            </article>
        </section>
    </main>
</template>
  
<script>
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";
import CreateFoodForm from "@/components/Stockpile/CreateFoodForm.vue";
import CreateListingForm from "@/components/Listings/CreateListingForm.vue";
import GetFoodsForm from "@/components/Stockpile/GetFoodsForm.vue";

export default {
    name: "StockpilePage",
    components: { FoodComponent, CreateFoodForm, CreateListingForm, GetFoodsForm },
    created() {
        if (this.$store.state.username) {
            this.$store.commit('updateStockpileFilter', null);
            this.$store.dispatch("refreshStockpile");
        }
    },
};
</script>
  
<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    gap: 1em;
}

.container>* {
    flex: 1;
}

.food-container {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

div {
    margin-left: 0em;
    margin-right: 0em;
}

section+h3 {
    margin-top: 0.5em;
}
</style>