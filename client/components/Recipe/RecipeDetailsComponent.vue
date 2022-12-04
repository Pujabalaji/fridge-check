<!-- Reusable component representing recipe details -->
<template>
  <BCard class="recipeDetails">
    <div class="container">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p v-if="recipe.prepTime >= 0">
          Prep Time: {{ recipe.prepTime }} minutes
        </p>
        <p v-if="recipe.cookTime >= 0">
          Cooking Time: {{ recipe.cookTime }} minutes
        </p>
      </div>
    </div>
    <h5>Ingredients:</h5>
    <ul>
      <li v-for="ingredient in recipe.ingredients" :key="ingredient._id">
        {{ ingredient.amount }} {{ ingredient.unit }} of
        {{ ingredient.name[0] }}
      </li>
    </ul>
    <h5>Instructions:</h5>
    <ol>
      <li v-for="(step, index) in recipe.instructions" :key="index">
        {{ step }}
      </li>
    </ol>
    <a :href="recipe.source" target="_blank">Open Recipe Source in new tab</a>
  </BCard>
</template>

<script>
import { BCard, BButton } from "bootstrap-vue";

export default {
  name: "RecipeDetailsComponent",
  components: { BCard, BButton },
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
.recipeDetails {
  background-color: #eee;
}

.container {
  display: flex;
  align-items: center;
  gap: 1em;
}

h4 {
  margin-top: 0.25em;
}

img {
  margin-bottom: 1em;
  flex: 1;
  object-fit: contain;
  width: 12em;
}

.column {
  flex: 3;
}
</style>