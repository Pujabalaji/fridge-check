<!-- Reusable component representing a single recipe and its actions -->

<template>
  <BCard class="recipe">
    <div class="container-recipe">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p>
          This recipe uses {{ recipe.usedCount }} ingredients in your stockpile.
        </p>
        <p>{{ recipe.expiringCount }} of these items are expiring this week.</p>
        <BButton @click="handleClick" variant="info">
          Display additional ingredient information
        </BButton>
      </div>
    </div>
  </BCard>
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
  background-color: #e7f5ff;
}

.container-recipe {
  display: flex;
  gap: 1em;
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