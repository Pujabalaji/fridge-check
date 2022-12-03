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
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
