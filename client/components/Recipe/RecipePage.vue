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
          <section v-if="$store.state.displaySuggested">
            <h3>Showing recipes using ingredients you have:</h3>
            <div v-if="$store.state.recipes.length">
              <RecipeComponent
                v-for="recipe in $store.state.recipes"
                :key="recipe._id"
                :recipe="recipe"
              />
            </div>
            <h4 v-else-if="loadingSuggested">Loading Recipes</h4>
            <h4 v-else>No results found</h4>
          </section>
          <section v-else-if="$store.state.displayByName">
            <h3>Showing recipes for "{{ $store.state.lastSearched }}":</h3>
            <div v-if="$store.state.recipes.length">
              <RecipeComponent
                v-for="recipe in $store.state.recipes"
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
      searchText: "",
      loadingSuggested: false,
      loadingNameSearch: false,
    };
  },
  methods: {
    async handleSuggestedClick() {
      this.$store.commit('updateShowSuggested', true);
      this.$store.commit('updateShowByName', false);
      if (this.$store.state.username) {
        await this.fetchSuggestedRecipes();
      }
    },
    async submit() {
      this.loadingNameSearch = true;
      this.$store.commit('updateShowByName', true);
      this.$store.commit('updateShowSuggested', false);
      if (this.$store.state.lastSearched.length === 0) {
        this.$store.commit('updateLastSearched', this.searchText);
      }

      const url = `/api/recipes?recipeName=${this.searchText}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.nameRecipes = res;
        this.$store.commit('updateRecipes', res);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.$store.commit('updateLastSearched', this.searchText);
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
        this.$store.commit('updateRecipes', res);
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