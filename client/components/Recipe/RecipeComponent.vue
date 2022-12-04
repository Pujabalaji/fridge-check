<!-- Reusable component representing a single recipe and its actions -->

<template>
  <BCard class="recipe">
    <div class="container">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p>
          This recipe uses {{ recipe.usedCount }} ingredients in your stockpile.
        </p>
        <p>{{ recipe.expiringCount }} of these items are expiring this week.</p>
        <BButton @click="handleClick">
          Display additional ingredient information
        </BButton>
      </div>
    </div>
  </BCard>
</template>

<script>
import { BCard, BButton } from "bootstrap-vue";

export default {
  name: "RecipeComponent",
  components: { BCard, BButton },
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
  padding: 5px;
  position: relative;
  margin: 0.5em 0em;
  background-color: rgb(238, 238, 238);
}

.container {
  display: flex;
  align-items: center;
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