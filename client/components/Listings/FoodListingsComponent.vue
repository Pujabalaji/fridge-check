<template>
  <div class="listings-component">
    <BContainer v-if="listings.length">
      <BRow cols="3">
        <BCol v-for="listing in listings" :key="listing._id" class="column">
          <ListingComponent :listing="listing" />
        </BCol>
      </BRow>
    </BContainer>
    <p v-else class="no-margin">No listings found</p>
  </div>
</template>

<script>
import ListingComponent from "@/components/Listings/ListingComponent.vue";

export default {
  name: "FoodListingsComponent",
  components: { ListingComponent },
  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      listings: [],
    };
  },
  mounted() {
    this.fetchListings(this.ingredient);
  },
  methods: {
    async fetchListings(ingredient) {
      this.listings = [];
      let recipeIngredientNames =
        ingredient.name !== ingredient.nameClean && ingredient.nameClean
          ? [ingredient.name, ingredient.nameClean]
          : [ingredient.name];
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
      this.showingListings = true;
    },
  },
};
</script>

<style scoped>
button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

.listings-component {
  display: flex;
  align-items: center;
  gap: 1em;
  width: 100%;
}

.no-margin {
  margin-bottom: 0em;
  padding: 15px;
}

.column {
  padding: 0.5em;
}

.container {
  margin: 0em;
}
</style>