<!-- Reusable component showing ingredient matches -->

<template>
  <div>
    <p>
      {{ ingredient.amount }} {{ ingredient.unit }} of
      {{ ingredient.name[0] }}
    </p>
    <FoodComponent
      v-if="
        ingredient.stockpileMatches.some((item) => item in $store.state.foods)
      "
      :food="
        $store.state.foods[
          ingredient.stockpileMatches.find((item) => item in $store.state.foods)
        ]
      "
    />
    <BButton v-else variant="info" @click="$router.push({ name: 'Stockpile' })"
      ><span>Search in Stockpile</span></BButton
    >
  </div>
</template>

<script>
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";

export default {
  name: "IngredientMatchComponent",
  components: { FoodComponent },
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

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}
</style>