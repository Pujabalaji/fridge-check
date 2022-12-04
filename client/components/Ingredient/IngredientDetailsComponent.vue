<!-- Reusable component representing recipe ingredient details -->

<template>
  <BCard class="ingredientDetails">
    <div class="container">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p>
          This recipe uses {{ recipe.usedCount }} ingredients in your stockpile.
        </p>
        <p>{{ recipe.expiringCount }} of these items are expiring this week.</p>
        <BButton @click="showDetails">Show recipe details</BButton>
      </div>
    </div>
    <h5>You have {{ recipe.usedCount }} ingredients:</h5>
    <IngredientMatchComponent v-for="ingredient in usedIngredients" :key="ingredient._id" :ingredient="ingredient" />
    <br>
    <div v-if="missingCount">
      <h5>You need {{ missingCount }} ingredients:</h5>
      <div v-for="ingredient in missingIngredients" :key="ingredient._id" class="containeringredient">
        <p>
          {{ ingredient.amount }} {{ ingredient.unit }} of
          {{ ingredient.name[0] }}
        </p>
        <BButton @click="fetchListings(ingredient)">Show Listings</BButton>
        <div v-if="currentIngredientId == ingredient._id">
          <p v-if="listings.length">
            <ListingComponent v-for="listing in listings" :key="listing._id" :listing="listing" />
          </p>
          <p v-else>
            No listings found </p>
        </div>
      </div>
    </div>
    <br>
    <h3> Want to make this recipe? </h3>
    <p> We suggest removing/adjusting the quantities of the following food items: </p>
    <FoodComponent v-for="ingredient in usedIngredients" :key="ingredient.stockpileMatches[0]._id"
      :food="ingredient.stockpileMatches[0]" />
  </BCard>
</template>

<script>
import IngredientMatchComponent from "@/components/Ingredient/IngredientMatchComponent.vue";
import ListingComponent from "@/components/Listings/ListingComponent.vue";
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";
import {
  BCard,
  BButton,
} from "bootstrap-vue";

export default {
  name: "IngredientDetailsComponent",
  components: { IngredientMatchComponent, ListingComponent, FoodComponent, BCard, BButton },
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
      return this.recipe.ingredients.length - this.recipe.usedCount;
    },
  },
  methods: {
    showDetails() {
      this.$router.push({ path: "/recipe/details" });
    },
    async fetchListings(ingredient) {
      this.listings = [];
      let recipeIngredientNames = (ingredient.name !== ingredient.nameClean && ingredient.nameClean) ? [ingredient.name, ingredient.nameClean] : [ingredient.name];
      this.currentIngredientId = ingredient._id;
      const listingsResponse = await fetch('/api/follows/listings').then(async r => r.json());
      const listings = [];
      for (const listing of listingsResponse) {
        if (recipeIngredientNames.some((recipeIngredientName) => (recipeIngredientName[0].includes(listing.name.toLowerCase()) || listing.name.toLowerCase().includes(recipeIngredientName[0])))) {
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
  background-color: rgb(250, 250, 250);
}

.container {
  display: flex;
  align-items: center;
  gap: 1em;
}

.containeringredient {
  padding-left: 5px;
  display: flex;
  align-items: left;
  gap: 1em;
}


h4 {
  margin-top: 0.25em;
}

img {
  flex: 1;
  object-fit: contain;
  width: 12em;
  margin-bottom: 1em;
}

.column {
  flex: 3;
}
</style>