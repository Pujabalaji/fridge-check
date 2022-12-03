<!-- Reusable component representing recipe details -->
<template>
  <article>
    <div class="container">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p v-if="recipe.prepTime >= 0">Prep Time: {{ recipe.prepTime }} minutes</p>
        <p v-if="recipe.cookTime >= 0">Cooking Time: {{ recipe.cookTime }} minutes</p>
        <button>Make this recipe and update stockpile</button>
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

.container {
  display: flex;
  align-items: center;
  gap: 1em;
}

h4 {
  margin-top: 0.25em;
}

img {
  flex: 1;
  object-fit: contain;
  width: 12em;
}

.column {
  flex: 3;
}
</style>