import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    communities: ["Baker", "Burton Conner", "East Campus", "MacGregor", "Maseeh", "McCormick", "New House", "New Vassar", "Next House", "Random", "Simmons", "Off-campus Cambridge", "Off-campus Boston"],
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    user: null,
    expired: [],  // foods that have expired for current user
    expiring: [], // foods that will expire within a week for current user
    remainingFoods: [], // foods that have not expired and will not expire in a week for current user
    foods: [],  // all foods of current user
    currentFood: null, // the food, if any, that the current user has selected to create a listing from
    listings: [],
    foodIdsWithListings: [],
    allListingsTemp: [],
    selectedRecipe: null, // recipe user has selected to see further details from
    recipes: [],
    displaySuggested: false,
    displayByName: false,
    lastSearched: "",
    percentDiscarded: 0,
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setCommunities(state, communities) {
      state.communities = communities;
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUser(state, user) {
      /**
       * Update the stored user to the specified one.
       * @param user - new user to set
       */
      state.user = user;
      if (user && user.numFood > 0) {
        state.percentDiscarded = Math.round((user.thrownAway / user.numFood) * 1000) / 10
      }
    },
    setSelectedRecipe(state, recipe) {
      /**
       * Update the stored selected recipe to the specified one.
       * @param recipe - new recipe to display details
       */
      state.selectedRecipe = recipe;
    },
    updateStockpile(state, stockpile) {
      /**
       * Update the stored stockpile for the user.
       * @param stockpile - new stockpile to set
       */
      state.expired = [];
      state.expiring = [];
      state.remainingFoods = [];
      state.foods = stockpile;

      const date = new Date();
      date.setHours(0, 0, 0, 0);
      var week = new Date();
      week.setDate(date.getDate() + 7);

      for (const food of stockpile) {
        var foodDate = new Date(food.rawExpiration);
        if (foodDate <= date) {
          state.expired.push(food);
        } else if (foodDate <= week) {
          state.expiring.push(food);
        } else {
          state.remainingFoods.push(food);
        }
      }
    },
    updateMyListings(state, listings) {
      state.listings = listings;
    },
    updateAllListings(state, listings) {
      state.allListingsTemp = listings;
    },
    enableCreateListing(state, food) {
      state.currentFood = food;
    },
    clearCurrentFood(state) {
      state.currentFood = null;
    },
    updateRecipes(state, recipes) {
      state.recipes = recipes;
    },
    clearRecipes(state) {
      state.recipes = [];
    },
    updateShowSuggested(state, on) {
      state.displaySuggested = on;
    },
    updateShowByName(state, on) {
      state.displayByName = on;
    },
    updateLastSearched(state, text) {
      state.lastSearched = text;
    }
  },
  actions: {
    async refreshStockpile({ commit, state }) {
      /**
       * Request the server for the currently available foods of current user.
       */
      const url = '/api/foods';
      const res = await fetch(url).then(async r => r.json());
      commit('updateStockpile', res);
      state.foodIdsWithListings = [];
      for (const food of res) {
        const res1 = await fetch(`/api/listings/foods/${food._id}`).then(async r => r.json());
        if (res1 !== "none") {
          state.foodIdsWithListings.push(food._id);
        }
      }

    },
    async refreshMyListings({ commit, state }) {
      const listings = await fetch('/api/listings').then(async r => r.json());
      commit('updateMyListings', listings);
    },
    async refreshAllListings({ commit, state }) {
      const listings = await fetch('/api/listings/temp').then(async r => r.json());
      commit('updateAllListings', listings);
    },
    async refreshUser({ commit, state }) {
      fetch('/api/users/session', {
        credentials: 'same-origin' // Sends express-session credentials with request
      }).then(res => res.json()).then(res => {
        const user = res.user;
        commit('setUser', user ? user : null);
      });
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
