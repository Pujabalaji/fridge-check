<!-- Reusable component representing recipe ingredient details -->

<template>
  <BCard class="ingredientDetails">
    <div class="container-details">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p>
          This recipe uses {{ recipe.usedCount }} ingredients in your stockpile.
        </p>
        <p>{{ recipe.expiringCount }} of these items are expiring this week.</p>
        <BButton @click="showDetails" variant="info">Show recipe details</BButton>
      </div>
    </div>
    <section>
      <h5>You have {{ recipe.usedCount }} ingredients:</h5>
      <IngredientMatchComponent
        v-for="ingredient in usedIngredients"
        :key="ingredient._id"
        :ingredient="ingredient"
        class="ingredient"
      />
    </section>
    <section v-if="missingCount">
      <h5>You need {{ missingCount }} ingredients:</h5>
      <div
        v-for="ingredient in missingIngredients"
        :key="ingredient._id"
        class="container-ingredient"
      >
        <p class="no-margin">
          {{ ingredient.amount }} {{ ingredient.unit }} of
          {{ ingredient.name[0] }}
        </p>
        <FoodListingsComponent :ingredient="ingredient"/>
      </div>
    </section>
    <h3>Want to make this recipe?</h3>
    <p>
      We suggest removing/adjusting the quantities of the following food items:
    </p>
    <div class="container-food">
      <div v-for="(ingredient, index) in usedIngredients" :key="index">
      <FoodComponent
        v-if="ingredient.stockpileMatches.some(item => item in $store.state.foods)"
        :key="ingredient.stockpileMatches.find(item => item in $store.state.foods)"
        :food="$store.state.foods[ingredient.stockpileMatches.find(item => item in $store.state.foods)]"
      />
      </div>
    </div>
  </BCard>
</template>

<script>
import IngredientMatchComponent from "@/components/Ingredient/IngredientMatchComponent.vue";
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";
import FoodListingsComponent from "@/components/Listings/FoodListingsComponent.vue"

export default {
  name: "IngredientDetailsComponent",
  components: { IngredientMatchComponent, FoodComponent, FoodListingsComponent },
  props: {
    // Data from the stored recipe
    recipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      listings: [],
      currentIngredientId: "",
    };
  },
  computed: {
    usedIngredients() {
      return this.recipe.ingredients.filter(
        (ingredient) => ingredient.status === "used"
      );
    },
    missingIngredients() {
      return this.recipe.ingredients.filter(
        (ingredient) => ingredient.status === "missing"
      );
    },
    missingCount() {
      return this.missingIngredients.length;
    },
  },
  methods: {
    showDetails() {
      this.$router.push({ path: "/recipe/details" });
    },
    async fetchListings(ingredient) {
      this.listings = [];
      let recipeIngredientNames =
        ingredient.name !== ingredient.nameClean && ingredient.nameClean
          ? [ingredient.name, ingredient.nameClean]
          : [ingredient.name];
      this.currentIngredientId = ingredient._id;
      const listingsResponse = await fetch("/api/follows/listings").then(
        async (r) => r.json()
      );
      const listings = [];
      for (const listing of listingsResponse) {
        if (
          recipeIngredientNames.some(
            (recipeIngredientName) =>
              recipeIngredientName[0].includes(listing.name.toLowerCase()) ||
              listing.name.toLowerCase().includes(recipeIngredientName[0])
          )
        ) {
          listings.push(listing);
        }
      }
      this.listings = listings;
    },
  },
};
</script>

<style scoped>
.ingredientDetails {
  background-color: #e7f5ff;
}

.ingredient {
  margin-bottom: 1em;
}

div {
  margin-left: 0em;
  margin-right: 0em;
}

.container-details {
  display: flex;
  align-items: flex-start;
  gap: 1em;
}

.container-ingredient {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.5em;
}

.container-food {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.no-margin {
  margin-bottom: 0em;
}

h3 {
  margin-top: 0.5em;
}

img {
  flex: 1;
  object-fit: contain;
  width: 12em;
  margin-bottom: 1em;
}

.column {
  flex: 3;
  margin-top: 1em;
}

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}
</style>