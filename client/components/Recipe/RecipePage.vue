<!-- Page for suggesting and searching recipes -->

<template>
  <main>
    <div v-if="$store.state.username">
      <h2>Suggested Recipes</h2>
      <div class="container">
        <div class="actions">
          <section>
            <h3>Quick Suggest:</h3>
            <button @click="handleSuggestedClick">
              Suggest any recipe that uses ingredients in my stockpile
            </button>
          </section>
          <form @submit.prevent="submit">
            <h3>Search Recipes by Name:</h3>
            <input
              type="text"
              v-model="searchText"
              placeholder="Search"
              required
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div class="recipes">
          <section v-if="displaySuggested">
            <h3>Showing recipes using ingredients you have:</h3>
            <div v-if="suggestedRecipes.length">
              <RecipeComponent
                v-for="recipe in suggestedRecipes"
                :key="recipe._id"
                :recipe="recipe"
              />
            </div>
            <h4 v-else-if="loadingSuggested">Loading Recipes</h4>
            <h4 v-else>No results found</h4>
          </section>
          <section v-else-if="displayByName">
            <h3>Showing recipes for "{{ lastSearched }}":</h3>
            <div v-if="nameRecipes.length">
              <RecipeComponent
                v-for="recipe in nameRecipes"
                :key="recipe._id"
                :recipe="recipe"
              />
            </div>
            <h4 v-else-if="loadingNameSearch">Loading Recipes</h4>
            <h4 v-else>No results found</h4>
          </section>
        </div>
      </div>
    </div>
    <div v-else>
      <h2>
        <router-link to="/login">Sign in</router-link>
        to view recipe suggestions.
      </h2>
    </div>
  </main>
</template>

<script>
import RecipeComponent from "@/components/Recipe/RecipeComponent.vue";

export default {
  name: "RecipePage",
  components: {
    RecipeComponent,
  },
  data() {
    return {
      suggestedRecipes: [],
      nameRecipes: [],
      searchText: "",
      lastSearched: "",
      displaySuggested: false,
      displayByName: false,
      loadingSuggested: false,
      loadingNameSearch: false,
    };
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
    async submit() {
      this.loadingNameSearch = true;
      this.displayByName = true;
      this.displaySuggested = false;
      if (this.lastSearched.length === 0) {
        this.lastSearched = this.searchText;
      }

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
      this.lastSearched = this.searchText;
      this.searchText = '';
      this.loadingNameSearch = false;
    },
    async fetchSuggestedRecipes() {
      this.loadingSuggested = true;
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
      this.loadingSuggested = false;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: flex-start;
  gap: 1em;
}

.recipes {
  flex: 2;
}

.actions {
  flex: 1;
}
</style>