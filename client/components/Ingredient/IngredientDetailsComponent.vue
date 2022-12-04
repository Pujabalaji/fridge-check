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
        <BButton @click="fetchListings(ingredient)" variant="info"
          ><BIconClipboard /> <span>View Listings</span></BButton
        >
        <div v-if="currentIngredientId == ingredient._id">
          <div v-if="listings.length">
            <ListingComponent
              v-for="listing in listings"
              :key="listing._id"
              :listing="listing"
            />
          </div>
          <p v-else class="no-margin">No listings found</p>
        </div>
      </div>
    </section>
    <h3>Want to make this recipe?</h3>
    <p>
      We suggest removing/adjusting the quantities of the following food items:
    </p>
    <div class="container-food">
      <FoodComponent
        v-for="ingredient in usedIngredients"
        :key="ingredient.stockpileMatches[0]._id"
        :food="ingredient.stockpileMatches[0]"
      />
    </div>
  </BCard>
</template>

<script>
import IngredientMatchComponent from "@/components/Ingredient/IngredientMatchComponent.vue";
import ListingComponent from "@/components/Listings/ListingComponent.vue";
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";

export default {
  name: "IngredientDetailsComponent",
  components: { IngredientMatchComponent, ListingComponent, FoodComponent },
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
  background-color: #d3f9d8;
}

.ingredient {
  margin-bottom: 1em;
}

div {
  margin-left: 0em;
  margin-right: 0em;
}

.container {
  display: flex;
  align-items: flex-start;
  gap: 1em;
}

.container-ingredient {
  padding-left: 5px;
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