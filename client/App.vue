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

export default {
  name: 'App',
  components: {NavBar},
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

    const params = {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin", // Sends express-session credentials with request
    };
    fetch('/api/listings/expired', params);
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
  padding: 2em 15em;
}

form {
  padding: 1em;
  background-color: #a5d8ff;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5em;
  border: 1px solid #0000003F;
  border-radius: 5px;
}

button + .alert {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.col {
  display: flex;
  align-items: center;
}
</style>
