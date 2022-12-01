<!-- Default page that displays communities -->

<template>
    <main v-if="$store.state.username">
        <section>
            <header>
                <h2>Communities</h2>
            </header>
        </section>
    </main>
</template>

<script>

export default {
    name: 'CommunityPage'
};
</script>