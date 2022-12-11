<!-- Page for suggesting and searching recipes -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Suggested Recipes</h2>
      </header>
      <br />
      <div class="container">
        <div class="actions">
          <section>
            <h3>Quick Suggest:</h3>
            <BButton @click="handleSuggestedClick" variant="primary">
              <span>
                Suggest recipes that use ingredients in my stockpile
              </span>
            </BButton>
          </section>
          <GetRecipesForm
            ref="GetRecipesForm"
            value=""
            placeholder="Search"
            button="Get Recipes"
            label="Search Recipes by Name"
            @loading="val => loadingNameSearch=val"
          />
        </div>
        <div class="recipes">
          <section v-if="$store.state.displaySuggested">
            <h3>Showing recipes using ingredients you have:</h3>
            <div v-if="$store.state.recipes.length" class="recipe-container">
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
            <div v-if="$store.state.recipes.length" class="recipe-container">
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
    </section>
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
import GetRecipesForm from "@/components/Recipe/GetRecipesForm.vue";

export default {
  name: "RecipePage",
  components: {
    RecipeComponent,
    GetRecipesForm,
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
      this.$store.commit("updateShowSuggested", true);
      this.$store.commit("updateShowByName", false);
      if (this.$store.state.username) {
        await this.fetchSuggestedRecipes();
      }
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
        this.$store.commit("updateRecipes", res);
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
  justify-content: space-between;
  gap: 1em;
}

div {
  margin-left: 0em;
  margin-right: 0em;
}

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}

.recipes {
  flex: 2;
}

.actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.recipe-container {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>