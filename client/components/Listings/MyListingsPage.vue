<!-- Default page that also displays stockpile -->

<template>
    <main v-if="$store.state.username">
        <section>
            <header>
                <h2>My Listings</h2>
            </header>
            <div>
                <section v-if="$store.state.listings.length">
                    <ListingComponent v-for="listing in $store.state.listings" :key="listing._id" :listing="listing" />
                </section>
                <article v-else>
                    <h3>No listings</h3>
                </article>
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
                    to track your listings.
                </h3>
            </article>
        </section>
    </main>
</template>
  
<script>
import ListingComponent from '@/components/Listings/ListingComponent.vue';

export default {
    name: 'MyListingsPage',
    components: { ListingComponent },
    created() {
        if (this.$store.state.username) {
            this.$store.dispatch("refreshMyListings");
        }
    }
};
</script>
  
<style scoped>
section {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    gap: 1em;
}

.column {
    flex: 1;
}
</style>