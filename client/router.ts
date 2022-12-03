import Vue from 'vue';
import VueRouter from 'vue-router';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import HomePage from './components/Home/HomePage.vue';
import RecipePage from './components/Recipe/RecipePage.vue';
import IngredientDetailsPage from './components/Ingredient/IngredientDetailsPage.vue';
import RecipeDetailsPage from './components/Recipe/RecipeDetailsPage.vue';
import StockpilePage from './components/Stockpile/StockpilePage.vue';
import MyListingsPage from './components/Listings/MyListingsPage.vue';
import AllListingsTempPage from './components/Listings/AllListingsTempPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/account', name: 'Account', component: AccountPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/stockpile', name: 'Stockpile', component: StockpilePage },
  { path: '/recipe', name: 'Recipe', component: RecipePage },
  { path: '/recipe/ingredients', name: 'Ingredient Details', component: IngredientDetailsPage },
  { path: '/recipe/details', name: 'Recipe Details', component: RecipeDetailsPage },
  { path: '*', name: 'Not Found', component: NotFound },
  { path: '/listings', name: 'My Listings', component: MyListingsPage },
  { path: '/alllistings', name: 'All Listings', component: AllListingsTempPage},
  { path: '*', name: 'Not Found', component: NotFound }
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({ name: 'Account' }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({ name: 'Login' }); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
