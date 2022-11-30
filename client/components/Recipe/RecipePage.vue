<!-- Page for suggesting and searching recipes -->

<template>
  <main>
    <h2>Suggested Recipes</h2>
    <div class="container">
      <div class="actions">
        <section>
          <h3>Quick Suggest:</h3>
          <button @click="handleSuggestedClick">
            Suggest any recipe that uses ingredients in my stockpile
          </button>
        </section>
        <section>
          <h3>Search Recipes by Name:</h3>
          <input type="text" v-model="searchText" placeholder="Search" />
          <button @click="handleSearchClick">Search</button>
        </section>
      </div>
      <div class="recipes">
        <section v-if="displaySuggested || displayByName">
          <h3 v-if="displaySuggested">
            Showing recipes using ingredients you have:
          </h3>
          <h3 v-else>Showing recipes for "{{ searchText }}":</h3>
          <div v-if="displayRecipes.length">
            <RecipeComponent
              v-for="recipe in displayRecipes"
              :key="recipe._id"
              :recipe="recipe"
            />
          </div>
          <h4 v-else>No results found</h4>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import RecipeComponent from "@/components/Recipe/RecipeComponent.vue";

export default {
  name: "RecipePage",
  components: { RecipeComponent },
  data() {
    return {
      suggestedRecipes: [],
      nameRecipes: [],
      searchText: "",
      displaySuggested: false,
      displayByName: false,
    };
  },
  computed: {
    displayRecipes() {
      if (this.displaySuggested) {
        return this.suggestedRecipes;
      } else if (this.displayByName) {
        return this.nameRecipes;
      }
      return [];
    },
  },
  created() {
    if (this.$store.state.username) {
      this.fetchSuggestedRecipes();
    }
  },
  methods: {
    handleSuggestedClick() {
      this.displaySuggested = true;
      this.displayByName = false;
    },
    async handleSearchClick() {
      this.displayByName = true;
      this.displaySuggested = false;

      const url = `/api/recipes?recipeName=${this.searchText}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.nameRecipes = res;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async fetchSuggestedRecipes() {
      const url = "/api/recipes/suggested";
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.suggestedRecipes = res;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: flex-start;
}

.recipes {
  flex: 2;
}

.actions {
  flex: 1;
}
</style>