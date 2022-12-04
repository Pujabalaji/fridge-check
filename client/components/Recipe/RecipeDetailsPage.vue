<!-- Page for viewing recipe ingredient details -->

<template>
  <main>
    <div v-if="$store.state.username">
      <h2>Showing recipe details:</h2>
      <RecipeDetailsComponent :recipe="this.$store.state.selectedRecipe" />
    </div>
    <div v-else>
      <h2>
        <router-link to="/login">Sign in</router-link>
        to view recipe details.
      </h2>
    </div>
  </main>
</template>

<script>
import RecipeDetailsComponent from "@/components/Recipe/RecipeDetailsComponent.vue";

export default {
  name: "RecipeDetailsPage",
  components: { RecipeDetailsComponent },
};
</script>