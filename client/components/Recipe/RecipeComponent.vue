<!-- Reusable component representing a single recipe and its actions -->

<template>
  <article class="recipe">
    <header>
      <h4>{{ recipe.name }}</h4>
    </header>
    <p>Uses a total of {{ recipe.ingredients.length }} ingredients</p>
    <p>How many are expiring?</p>
    <button>Select recipe and search for missing ingredients</button>
  </article>
</template>

<script>
export default {
  name: "RecipeComponent",
  props: {
    // Data from the stored recipe
    recipe: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.recipe {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    margin: 0.5em 0em;
    background-color: #eee;
}
</style>