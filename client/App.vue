<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <BAlert
      v-for="(status, alert, index) in $store.state.alerts"
      :key="index"
      :variant="status === 'error' ? 'danger' : 'success'"
      show
    >
      {{ alert }}
    </BAlert>
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';
import { BAlert } from "bootstrap-vue";

export default {
  name: 'App',
  components: {NavBar, BAlert},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
      this.$store.commit('setUser', user ? user : null);
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  font-family: "Lato", sans-serif;
  background-color: rgb(234, 186, 255),
}

main {
  padding: 1em 5em;
}

form {
  padding: 0.5em;
  background-color: rgb(238, 238, 238);
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5em;
}

card {
  background-color: rgb(238, 238, 238);
}

button + .alert {
  margin-top: 1em;
  margin-bottom: 0.5em;
}
</style>
