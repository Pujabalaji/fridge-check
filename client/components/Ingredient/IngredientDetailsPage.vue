<!-- Page for viewing recipe ingredient details -->

<template>
  <main>
    <h2>Showing ingredient details:</h2>
    <BCard class="ingredientDetails">
      <div class="container-details">
        <img :src="recipe.imageUrl" />
        <div class="column">
          <h4>{{ recipe.name }}</h4>
          <p>
            This recipe uses {{ recipe.usedCount }} ingredients in your
            stockpile.
          </p>
          <p>
            {{ recipe.expiringCount }} of these items are expiring this week.
          </p>
          <BButton @click="showDetails" variant="info"
            >Show recipe details</BButton
          >
        </div>
      </div>
      <section>
        <h5>You have {{ recipe.usedCount }} ingredients:</h5>
        <IngredientMatchComponent
          v-for="ingredient in usedIngredients"
          :key="ingredient._id"
          :ingredient="ingredient"
          class="ingredient"
        />
      </section>
      <section v-if="missingCount">
        <h5>You need {{ missingCount }} ingredients:</h5>
        <div
          v-for="ingredient in missingIngredients"
          :key="ingredient._id"
          class="container-ingredient"
        >
          <details>
            <summary>
              {{ ingredient.amount }} {{ ingredient.unit }} of
              {{ ingredient.name[0] }}
            </summary>
            <FoodListingsComponent :ingredient="ingredient" />
          </details>
        </div>
      </section>
    </BCard>
  </main>
</template>

<script>
import UsedIngredientComponent from "@/components/Ingredient/UsedIngredientComponent.vue";
import MissingIngredientComponent from "@/components/Ingredient/MissingIngredientComponent.vue";

export default {
  name: "IngredientDetailsPage",
  components: { UsedIngredientComponent, MissingIngredientComponent },
  data() {
    return {
      listings: [],
      currentIngredientId: "",
    };
  },
  computed: {
    recipe() {
      return this.$store.state.selectedRecipe;
    },
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
      return this.missingIngredients.length;
    },
  },
  methods: {
    showDetails() {
      this.$router.push({ path: "/recipe/details" });
    },
  },
};
</script>

<style scoped>
.ingredientDetails {
  background-color: #e7f5ff;
}

.ingredient {
  margin-bottom: 1em;
}

div {
  margin-left: 0em;
  margin-right: 0em;
}

.container-details {
  display: flex;
  align-items: flex-start;
  gap: 1em;
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

details {
  width: 100%;
}
</style>