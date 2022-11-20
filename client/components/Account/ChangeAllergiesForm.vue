<!-- Form for changing allergies (block style) -->
<template>
    <form @submit.prevent="submit">
    <h3>Change allergies</h3>
      <article>
        <div>
        Allergies:
        <span>
        <input type="checkbox" id="peanut" v-model="peanutChecked" />
        <label for="peanut">Peanuts </label>
      </span><span>
        <input type="checkbox" id="treenut" v-model="treenutChecked" />
        <label for="treenut">Tree Nuts </label>
      </span>
      <span>
        <input type="checkbox" id="seafood" v-model="seafoodChecked" />
        <label for="seafood">Seafood </label>
      </span>
      </div>
      </article>
      <button type="submit">
        Change allergies
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
    name: "ChangeAllergiesForm",
    data () {
      return {
        peanutChecked: false,
        treenutChecked: false,
        seafoodChecked: false,
        alerts: {},
        callback: null
      }
    },
    methods: {
      async submit() {
        let allergiesString = '';
        if (this.peanutChecked) {
            allergiesString += 'Peanut, '
        } if (this.treenutChecked) {
            allergiesString += 'Tree nut, '
        } if (this.seafoodChecked) {
            allergiesString += 'Seafood, '
        }
        const options = {
          method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin", // Sends express-session credentials with request
          body: JSON.stringify({ allergies: allergiesString }),
          callback: () => {
            this.$set(this.alerts, "Successfully updated allergies", "success");
            setTimeout(() => this.$delete(this.alerts, "Successfully updated allergies"), 3000);
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
    border: 1px solid #111;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 14px;
    position: relative;
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