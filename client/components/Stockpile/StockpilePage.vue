<!-- Default page that also displays freets -->

<template>
    <main v-if="$store.state.username">
        <section>
            <h2>My Stockpile</h2>
            <div class="row">
  <div class="column">
  <h2>Expired</h2>
                    <section v-if="$store.state.expired.length">
                        <FoodComponent v-for="food in $store.state.expired" :key="food._id" :food="food" />
                    </section>
                    <article v-else>
                        <h3>No expired food in you fridge :)</h3>
                    </article>
                    <h2>Expiring</h2>
                    <section v-if="$store.state.expiring.length">
                        <FoodComponent v-for="food in $store.state.expiring" :key="food._id" :food="food" />
                    </section>
                    <article v-else>
                        <h3>No food about to expire :)</h3>
                    </article>
                    <h2>Stockpile</h2>
                    <section v-if="$store.state.remainingFoods.length">
                        <FoodComponent v-for="food in $store.state.remainingFoods" :key="food._id" :food="food" />
                    </section>
                    <article v-else>
                        <h3>There is no food in your stockpille.</h3>
                    </article>
                </div>
  <div class="column"><CreateFoodForm /></div>
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

export default {
    name: 'StockpilePage',
    components: { FoodComponent, CreateFoodForm },
    created(){
        this.$store.dispatch("refreshStockpile");
    }
};
</script>
  
<style scoped>
section {
    display: flex;
    flex-direction: column;

}

header,
header>* {
    display: flex;
    justify-content: space-between;
    align-items: center;

}

button {
    margin-right: 10px;
}

section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;

}

section .createfreetform {
    background-color: #eee;

}
.row {
  display: flex;
}

.column {
  flex: 50%;
}
</style>