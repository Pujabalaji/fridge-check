<!-- Reusable component representing a single recipe details -->

<template>
  <article>
    <img :src="recipe.imageUrl" />
    <h4>{{ recipe.name }}</h4>
    <p v-if="recipe.usedCount"><b>You have:</b> {{ usedIngredientsStr }}</p>
    <div v-if="recipe.ingredients.length - recipe.usedCount">
      <p><b>You need:</b> {{ missingIngredientsStr }}</p>
      <h5>Suggested Listings:</h5>
      <p>TODO: Insert Listings here</p>
    </div>
  </article>
</template>

<script>
export default {
  name: "RecipeDetailsComponent",
  props: {
    // Data from the stored recipe
    recipe: {
      type: Object,
      required: true,
    },
  },
  computed: {
    usedIngredientsStr() {
      return this.recipe.usedNames.reduce((prev, curr) => prev + ", " + curr);
    },
    missingIngredients() {
      return this.recipe.ingredients.filter(
        (ingredient) => {
          for (const name of ingredient.name) {
            if (this.recipe.usedNames.some(used => used.includes(name))) {
              return false;
            }
          }
          return true;
        }
      ).map((ingredient) => ingredient.name[0]);
    },
    missingIngredientsStr() {
      return this.missingIngredients.reduce((prev, curr) => prev + ", " + curr);
    },
  },
};
</script>

<style scoped>
article {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  margin: 0.5em 0em;
  background-color: #eee;
}
</style>