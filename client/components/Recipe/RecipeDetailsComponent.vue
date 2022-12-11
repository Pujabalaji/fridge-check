<!-- Reusable component representing recipe details -->
<template>
  <BCard class="recipeDetails">
    <div class="container-recipe">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p v-if="recipe.prepTime >= 0">
          Prep Time: {{ recipe.prepTime }} minutes
        </p>
        <p v-if="recipe.cookTime >= 0">
          Cooking Time: {{ recipe.cookTime }} minutes
        </p>
        <BButton :href="recipe.source" target="_blank" variant="info"
          ><BIconBoxArrowUpRight /> <span>Open Recipe Source</span>
        </BButton>
      </div>
    </div>
    <section>
      <h5>Ingredients:</h5>
      <ul>
        <li v-for="ingredient in recipe.ingredients" :key="ingredient._id">
          {{ ingredient.amount }} {{ ingredient.unit }} of
          {{ ingredient.name[0] }}
        </li>
      </ul>
    </section>
    <section>
      <h5>Instructions:</h5>
      <ol>
        <li v-for="(step, index) in recipe.instructions" :key="index">
          {{ step }}
        </li>
      </ol>
    </section>
  </BCard>
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
.recipeDetails {
  background-color: #e7f5ff;
}

div {
  margin-left: 0em;
  margin-right: 0em;
}

.container-recipe {
  display: flex;
  align-items: flex-start;
  gap: 1em;
}

.center-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  flex: 1;
  object-fit: contain;
  width: 12em;
  margin-bottom: 1em;
}

.column {
  flex: 3;
  margin-top: 1em;
}

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}
</style>