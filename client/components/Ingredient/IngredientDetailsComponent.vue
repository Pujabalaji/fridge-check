<!-- Reusable component representing recipe ingredient details -->

<template>
  <article>
    <div class="container">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p>
          This recipe uses {{ recipe.usedCount }} ingredients in your stockpile.
        </p>
        <p>{{ recipe.expiringCount }} of these items are expiring this week.</p>
        <button @click="showDetails">Show recipe details</button>
      </div>
    </div>
    <h5>You have {{ recipe.usedCount }} ingredients:</h5>
    <IngredientMatchComponent v-for="ingredient in usedIngredients" :key="ingredient._id" :ingredient="ingredient" />
    <div v-if="missingCount">
      <h5>You need {{ missingCount }} ingredients:</h5>
      <div v-for="ingredient in missingIngredients" :key="ingredient._id" class="container">
        <p>
          {{ ingredient.amount }} {{ ingredient.unit }} of
          {{ ingredient.name[0] }}
        </p>
        <button @click="fetchListings(ingredient)">Show Listings</button>
        <div v-if="currentIngredientId == ingredient._id">
          <ListingComponent v-if="listings.length" v-for="listing in listings" :key="listing._id" :listing="listing" />
          <p v-else> No listings found </p>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import IngredientMatchComponent from "@/components/Ingredient/IngredientMatchComponent.vue";
import ListingComponent from "@/components/Listings/ListingComponent.vue";

export default {
  name: "IngredientDetailsComponent",
  components: { IngredientMatchComponent, ListingComponent },
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
article {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  margin: 0.5em 0em;
  background-color: #eee;
}

.container {
  display: flex;
  align-items: center;
  gap: 1em;
}

h4 {
  margin-top: 0.25em;
}

img {
  flex: 1;
  object-fit: contain;
  width: 12em;
}

.column {
  flex: 3;
}
</style>