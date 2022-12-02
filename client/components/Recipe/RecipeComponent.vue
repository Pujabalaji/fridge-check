<!-- Reusable component representing a single recipe and its actions -->

<template>
  <article class="recipe">
    <div class="container">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p>
          This recipe uses {{ recipe.usedCount }} ingredients in your stockpile.
        </p>
        <p>{{ recipe.expiringCount }} of these items are expiring this week.</p>
        <button @click="handleClick">
          Display additional ingredient information
        </button>
      </div>
    </div>
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
  methods: {
    handleClick() {
      this.$store.commit("setSelectedRecipe", this.recipe);
      this.$router.push({ path: "/recipe/ingredients" });
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