<!-- Reusable component showing missing ingredients -->

<template>
  <div class="listing-container">
    <details>
      <summary>
        {{ ingredient.amount }} {{ ingredient.unit }} of
        {{ ingredient.name[0] }}
      </summary>
      <FoodListingsComponent :ingredient="ingredient" />
    </details>
  </div>
</template>

<script>
import FoodComponent from "@/components/Stockpile/FoodComponent.vue";
import FoodListingsComponent from "@/components/Listings/FoodListingsComponent.vue";

export default {
  name: "MissingIngredientComponent",
  components: { FoodComponent, FoodListingsComponent },
  props: {
    ingredient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      listings: [],
      currentIngredientId: null,
    };
  },
};
</script>

<style scoped>
.match {
  margin-bottom: 0.75em;
}

.match-container {
  padding-left: 5px;
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.5em;
}

.match-container > p {
  margin-bottom: 0em;
}

.listing-container {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.5em;
}

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

p {
  margin-bottom: 0em;
  flex-shrink: 0;
}

details {
  width: 100%;
}
</style>