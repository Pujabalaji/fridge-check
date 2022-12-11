<!-- Default page that also displays stockpile -->

<template>
    <main>
        <section>
            <header>
                <h2 v-if="$store.state.listingFilter">All Listings Filtered by "{{ $store.state.listingFilter }}"</h2>
                <h2 v-else>All Listings</h2>
                <p class="explanation">Follow communities to view the listings from that community.</p>
            </header>
        </section>
        <section>
                <section>
                    <GetListingsForm ref="GetListingsForm" value="foodName"
                        placeholder="Search" button="Get listings" label="Filter Listings by Food Name"/>
                </section>
            <section v-if="$store.state.allListings.length" class="listing-container">
                <ListingComponent v-for="listing in $store.state.allListings" :key="listing._id" :listing="listing" />
            </section>
            <article v-else>
                <h3>No listings found.</h3>
            </article>
        </section>
    </main>
</template>
  
<script>
import ListingComponent from '@/components/Listings/ListingComponent.vue';
import GetListingsForm from '@/components/Listings/GetListingsForm.vue';

export default {
    name: 'AllListingsPage',
    components: { ListingComponent, GetListingsForm },
    beforeCreate() {
        this.$store.commit('updateListingFilter', null);
        this.$store.dispatch('refreshAllListings');
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

.listing-container {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>