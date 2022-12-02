<!-- Page for viewing recipe ingredient details -->

<template>
  <main>
    <h2>Showing recipe details:</h2>
    <RecipeDetailsComponent :recipe="this.$store.state.selectedRecipe" />
  </main>
</template>

<script>
import RecipeDetailsComponent from "@/components/Recipe/RecipeDetailsComponent.vue";

export default {
  name: "RecipeDetailsPage",
  components: { RecipeDetailsComponent },
};
</script>