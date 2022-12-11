<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div>
    <BNavbar type="dark">
      <BNavbarBrand>
      <router-link class="link" to="/">
        <img
          src="../../public/filled_fridge_logo.svg"
          width="40"
          height="40"
          class="logo"
          alt="🗄️✅"
        />
        FridgeCheck
      </router-link>
      </BNavbarBrand>
      <BNavbarToggle target="nav-collapse" />
      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav class="ml-auto">
          <BNavItem
            v-for="link in links"
            :key="link.name"
            :to="link.to"
            :active="$route.path == link.to"
            v-show="link.visible"
          >
            {{ link.name }}
          </BNavItem>
          <BNavItemDropdown v-if="$store.state.username" text="Account" right>
            <BDropdownItem
              v-for="item in dropdown"
              :key="item.name"
              :to="item.to"
            >
              {{ item.name }}
            </BDropdownItem>
            <BDropdownItem @click="logout">Logout</BDropdownItem>
          </BNavItemDropdown>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    links() {
      return [
        {
          to: "/",
          name: "Stockpile",
          visible: this.$store.state.username ? true : false,
        },
        {
          to: "/listings",
          name: "My Listings",
          visible: this.$store.state.username ? true : false,
        },
        {
          to: '/alllistings', 
          name: 'All Listings', 
          visible: this.$store.state.username ? true : false
        },
        {
          to: "/recipe",
          name: "Suggested Recipes",
          visible: this.$store.state.username ? true : false,
        },
        {
          to: "/community",
          name: "Communities",
          visible: this.$store.state.username ? true : false,
        },
        {
          to: "/login",
          name: "Login",
          visible: this.$store.state.username ? false : true,
        },
      ];
    },
    dropdown() {
      return [{ to: "/account", name: "Settings" }];
    },
  },
  methods: {
    async logout() {
      const options = {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };

      try {
        const r = await fetch('/api/users/session', options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const text = await r.text();
        const res = text ? JSON.parse(text) : { user: null };
        this.$store.commit(
          "setUsername",
          res.user ? res.user.username : null
        );
        this.$store.commit("setUser", res.user ? res.user : null);
        this.$router.push({name: 'Login'}); // Goes to Home page after signing out
        this.$store.commit('clearCurrentFood');
        this.$store.commit("clearRecipes");
        this.$store.commit("updateShowSuggested", false);
        this.$store.commit("updateShowByName", false);
        this.$store.commit('alert', {
          message: 'You are now signed out!', status: 'success'
        });
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>


<style scoped>
/* .logo {
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(24deg) brightness(103%)
    contrast(103%);
} */

.navbar {
  background-color: #0b7285;
}

.link {
  color: rgb(255, 255, 255);
  text-decoration: none;
}
</style>
