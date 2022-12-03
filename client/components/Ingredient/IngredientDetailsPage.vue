<!-- Page for viewing recipe ingredient details -->

<template>
  <main>
    <div v-if="$store.state.username">
    <h2>Showing ingredient details:</h2>
      <IngredientDetailsComponent :recipe="this.$store.state.selectedRecipe" />
    </div>
    <div v-else>
      <h2>
        <router-link to="/login">Sign in</router-link>
        to view recipe suggestions.
      </h2>
    </div>
  </main>
</template>

<script>
import IngredientDetailsComponent from "@/components/Ingredient/IngredientDetailsComponent.vue";

export default {
  name: "IngredientDetailsPage",
  components: { IngredientDetailsComponent },
};
</script>