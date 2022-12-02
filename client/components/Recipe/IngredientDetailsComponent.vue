<!-- Reusable component representing recipe ingredient details -->

<template>
  <article>
    <div class="container">
      <img :src="recipe.imageUrl" />
      <div class="column">
        <h4>{{ recipe.name }}</h4>
        <p>
          This recipe uses {{ recipe.usedCount }} ingredients in your stockpile.
        </p>
        <p>{{ recipe.expiringCount }} of these items are expiring this week.</p>
        <button @click="showDetails">Show recipe details</button>
      </div>
    </div>
    <h5>You have {{ recipe.usedCount }} ingredients:</h5>
    <IngredientMatchComponent
      v-for="ingredient in usedIngredients"
      :key="ingredient._id"
      :ingredient="ingredient"
    />
    <div v-if="missingCount">
      <h5>You need {{ missingCount }} ingredients:</h5>
      <div
        v-for="ingredient in missingIngredients"
        :key="ingredient._id"
        class="container"
      >
        <p>
          {{ ingredient.amount }} {{ ingredient.unit }} of
          {{ ingredient.name[0] }}
        </p>
        <button>Show Listings</button>
      </div>
    </div>
  </article>
</template>

<script>
import IngredientMatchComponent from "@/components/Recipe/IngredientMatchComponent.vue";

export default {
  name: "IngredientDetailsComponent",
  components: { IngredientMatchComponent },
  props: {
    // Data from the stored recipe
    recipe: {
      type: Object,
      required: true,
    },
  },
  computed: {
    usedIngredients() {
      return this.recipe.ingredients.filter(
        (ingredient) => ingredient.status === "used"
      );
    },
    missingIngredients() {
      return this.recipe.ingredients.filter(
        (ingredient) => ingredient.status === "missing"
      );
    },
    missingCount() {
      return this.recipe.ingredients.length - this.recipe.usedCount;
    },
  },
  methods: {
    showDetails() {
      this.$emit("input", this.recipe);
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