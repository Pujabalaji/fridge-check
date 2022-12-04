<!-- Form for changing home community (block style) -->
<template>
  <form @submit.prevent="submit">
  <h3>Change home community</h3>
    <article>
      <div>
      Home community:
      <select name="homeCommunity" id="homeCommunity" v-model="homeCommunity">
        <option value="Baker">Baker </option>
        <option value="Burton Conner">Burton Conner </option>
        <option value="East Campus">East Campus </option>
        <option value="MacGregor">MacGregor </option>
        <option value="Maseeh">Maseeh </option>
        <option value="McCormick">McCormick </option>
        <option value="New House">New House </option>
        <option value="New Vassar">New Vassar </option>
        <option value="Next House">Next House </option>
        <option value="Random">Random </option>
        <option value="Simmons">Simmons </option>
        <option value="Off-campus Cambridge">Off-campus Cambridge </option>
        <option value="Off-campus Boston">Off-campus Boston </option>
        </select>
      </div>
    </article>
    <button type="submit">
      Change home community
    </button>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: "ChangeHomeCommunityForm",
  data () {
    return {
      homeCommunity: this.$store.state.user.homeCommunity ?? "",
      alerts: {},
      callback: null
    }
  },
  methods: {
    async submit() {
      const options = {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
        body: JSON.stringify({ homeCommunity: this.homeCommunity }),
        callback: () => {
          this.$set(this.alerts, "Successfully updated home community", "success");
          setTimeout(() => this.$delete(this.alerts, "Successfully updated home community"), 3000);
        },
      };

      try {
        const r = await fetch('/api/users', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.$store.commit("setUser", res.user ? res.user : null);
        options.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
form {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  background-color: rgb(238, 238, 238);
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.2);
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}
</style>