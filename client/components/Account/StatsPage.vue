<template>
    <main>
        <section>
            <header>
                <h2>Stats for @{{ $store.state.username }}</h2>
            </header> <br>
            <h4>You have added {{ $store.state.user.numFood }} foods to your stockpile to date.</h4><br>
            <h4>You have thrown away {{ $store.state.user.thrownAway }} foods to date.</h4><br>
            <h4 v-if="$store.state.user.numFood > 0">You have discarded {{ Math.round(($store.state.user.thrownAway / $store.state.user.numFood) * 1000) / 10
            }}% of foods added to your stockpile.</h4>
            <h4 v-else>You have discarded 0% of foods added to your stockpile.</h4>
        </section>
    </main>
</template>
  
<script>

export default {
    name: 'StatsPage',
    beforeCreate() {
        this.$store.dispatch('refreshUser');
    }
};
</script>
  