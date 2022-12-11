<!-- Reusable component showing used ingredients -->

<template>
  <div>
    <div class="listing-container">
    <p>
      {{ ingredient.amount }} {{ ingredient.unit }} of
      {{ ingredient.name[0] }}
    </p>
    <FoodListingsComponent :ingredient="ingredient" />
    </div>
    <FoodComponent
      v-if="
        ingredient.stockpileMatches.some((item) => item in $store.state.foods)
      "
      :food="
        $store.state.foods[
          ingredient.stockpileMatches.find((item) => item in $store.state.foods)
        ]
      "
      :showListingButton="false"
    />
    <BButton v-else variant="info" @click="$router.push({ name: 'Stockpile' })"
      ><span>Search in Stockpile</span></BButton
    >
  </div>
</template>

<script>
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";
import FoodListingsComponent from "@/components/Listings/FoodListingsComponent.vue";

export default {
  name: "UsedIngredientComponent",
  components: { FoodComponent, FoodListingsComponent },
  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      listings: [],
      currentIngredientId: null,
    };
  },
  methods: {
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
.match {
  margin-bottom: 0.75em;
}

.match-container {
  padding-left: 5px;
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.5em;
}

.match-container > p {
  margin-bottom: 0em;
}

.listing-container {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.5em;
}

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

p {
  margin-bottom: 0em;
  flex-shrink: 0;
}
</style>