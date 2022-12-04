<!-- Default page that also displays stockpile -->

<template>
  <main>
    <section>
      <header>
        <h2>My Listings</h2>
      </header>
      <div v-if="$store.state.username">
        <section v-if="$store.state.listings.length" class="listing-container">
          <ListingComponent
            v-for="listing in $store.state.listings"
            :key="listing._id"
            :listing="listing"
          />
        </section>
        <article v-else>
          <h3>No listings</h3>
        </article>
      </div>
      <div v-else>
        <h3>
          <router-link to="/login">Sign in</router-link>
          to track your listings.
        </h3>
      </div>
    </section>
  </main>
</template>
  
<script>
import ListingComponent from "@/components/Listings/ListingComponent.vue";

export default {
  name: "MyListingsPage",
  components: { ListingComponent },
  created() {
    if (this.$store.state.username) {
      this.$store.dispatch("refreshMyListings");
    }
  },
};
</script>
  
<style scoped>
.listing-container {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>