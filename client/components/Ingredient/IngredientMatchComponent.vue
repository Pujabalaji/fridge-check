<!-- Reusable component showing ingredient matches -->

<template>
  <div>
    <p>
      {{ ingredient.amount }} {{ ingredient.unit }} of
      {{ ingredient.name[0] }} has
      {{ ingredient.stockpileMatches.length }} stockpile matches.
    </p>
    <FoodComponent 
      v-if="ingredient.stockpileMatches.length" 
      :food="ingredient.stockpileMatches[0]"
    />
  </div>
</template>

<script>
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";

export default {
  name: "IngredientMatchComponent",
  components: { FoodComponent },
  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>

.match {
  margin-bottom: 0.75em;
}

</style>