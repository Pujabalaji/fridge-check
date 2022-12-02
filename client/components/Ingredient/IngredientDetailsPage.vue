<!-- Page for viewing recipe ingredient details -->

<template>
  <main>
    <h2>Showing ingredient details:</h2>
      <IngredientDetailsComponent :recipe="this.$store.state.selectedRecipe" />
  </main>
</template>

<script>
import IngredientDetailsComponent from "@/components/Ingredient/IngredientDetailsComponent.vue";

export default {
  name: "IngredientDetailsPage",
  components: { IngredientDetailsComponent },
};
</script>