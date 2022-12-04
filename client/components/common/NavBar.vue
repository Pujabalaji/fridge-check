<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div>
    <BNavbar type="dark" variant="dark">
      <BNavbarBrand>FridgeCheck</BNavbarBrand>
      <BNavbarToggle target="nav-collapse" />
      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav class="ml-auto">
          <BNavItem v-for="link in links" :key="link.name" :to="link.to" :active="$route.path == link.to" v-show="link.visible">
            {{link.name}}
          </BNavItem>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>
  </div>
</template>

<script>
import {
  BNavbar,
  BNavbarBrand,
  BNavbarToggle,
  BCollapse,
  BNavbarNav,
  BNavItem,
} from "bootstrap-vue";
export default {
  name: "NavBar",
  components: {
    BNavbar,
    BNavbarBrand,
    BNavbarToggle,
    BCollapse,
    BNavbarNav,
    BNavItem,
  },
  computed: {
    links() {
      return [
        {to: '/', name: 'Home', visible: true},
        {to: '/listings', name: 'My Listings', visible: this.$store.state.username ? true : false},
        {to: '/recipe', name: 'Suggested Recipes', visible: this.$store.state.username ? true : false},
        {to: '/account', name: 'Account', visible: this.$store.state.username ? true : false},
        {to: '/login', name: 'Login', visible: this.$store.state.username ? false : true}
      ];
    }
  }
};
</script>

