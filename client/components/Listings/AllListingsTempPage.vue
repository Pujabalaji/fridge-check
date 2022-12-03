<!-- Default page that also displays stockpile -->

<template>
    <main>
        <section>
            <header>
                <h2>All Listings - Temporary, for testing only </h2>
            </header>
            <div>
                <section v-if="$store.state.allListingsTemp.length">
                    <ListingComponent v-for="listing in $store.state.allListingsTemp" :key="listing._id"
                        :listing="listing" />
                </section>
            </div>
        </section>
    </main>
</template>
  
<script>
import ListingComponent from '@/components/Listings/ListingComponent.vue';

export default {
    name: 'AllListingsTempPage',
    components: { ListingComponent },
    beforeCreate() {
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
</style>