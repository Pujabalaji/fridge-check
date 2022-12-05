<!-- Reusable component showing ingredient matches -->

<template>
  <div>
    <p>
      {{ ingredient.amount }} {{ ingredient.unit }} of
      {{ ingredient.name[0] }}
    </p>
    <FoodComponent 
      v-if="ingredient.stockpileMatches.length" 
      :food="ingredient.stockpileMatches[0]"
    />
    <BButton v-else variant="info" @click="$router.push({ name: 'Stockpile' })"><span>Search in Stockpile</span></BButton>
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

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

</style>