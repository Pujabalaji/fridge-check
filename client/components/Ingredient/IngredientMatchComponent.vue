<!-- Reusable component showing ingredient matches -->

<template>
  <div>
    <p>
      {{ ingredient.amount }} {{ ingredient.unit }} of
      {{ ingredient.name[0] }} has
      {{ ingredient.stockpileMatches.length }} stockpile matches.
    </p>
    <FoodComponent v-if="ingredient.stockpileMatches.length" :food="ingredient.stockpileMatches[0]" />
    <BButton v-if="ingredient.stockpileMatches.length > 1">Show More</BButton>
  </div>
</template>

<script>
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";
import { BButton } from "bootstrap-vue";

export default {
  name: "IngredientMatchComponent",
  components: { FoodComponent, BButton },
  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },
};
</script>