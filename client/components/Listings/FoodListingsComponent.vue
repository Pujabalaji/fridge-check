<template>
  <div>
    <BButton @click="fetchListings(ingredient)" variant="info"
      ><BIconClipboard /> <span>View Listings</span></BButton
    >
    <div v-if="currentIngredientId == ingredient._id && listings.length" class="listings">
      <ListingComponent
        v-for="listing in listings"
        :key="listing._id"
        :listing="listing"
      />
    </div>
    <p v-else-if="currentIngredientId == ingredient._id" class="no-margin">
      No listings found
    </p>
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
      currentIngredientId: "",
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
button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

div {
  display: flex;
  align-items: center;
  gap: 1em;
}

.listings {
  flex-wrap: wrap;
  gap: 0em;
}

.listings > * {
  flex: 33.33%;
  padding: 0.5em;
}

.no-margin {
  margin-bottom: 0em;
}
</style>