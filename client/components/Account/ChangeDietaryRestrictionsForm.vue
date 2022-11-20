<!-- Form for changing dietary restrictions (block style) -->
<template>
    <form @submit.prevent="submit">
    <h3>Change dietary restrictions</h3>
      <article>
        <div>
        Other dietary restrictions:
        <span>
        <input type="checkbox" id="vegetarian" v-model="vegetarianChecked" />
        <label for="vegetarian">Vegetarian </label>
      </span><span>
        <input type="checkbox" id="vegan" v-model="veganChecked" />
        <label for="vegan">Vegan </label>
      </span>
      <span>
        <input type="checkbox" id="pescetarian" v-model="pescetarianChecked" />
        <label for="pescetarian">Pescatarian </label>
      </span>
      </div>
      </article>
      <button type="submit">
        Change dietary restrictions
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
    name: "ChangeDietaryRestrictionsForm",
    data () {
      return {
        vegetarianChecked: false,
        veganChecked: false,
        pescetarianChecked: false,
        alerts: {},
        callback: null
      }
    },
    methods: {
      async submit() {
        let dietaryRestrictionsString = '';
        if (this.vegetarianChecked) {
          dietaryRestrictionsString += 'Vegetarian, '
        } if (this.veganChecked) {
          dietaryRestrictionsString += 'Vegan, '
        } if (this.pescetarianChecked) {
          dietaryRestrictionsString += 'Pescatarian, '
        }
        const options = {
          method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin", // Sends express-session credentials with request
          body: JSON.stringify({ otherDietaryRestrictions: dietaryRestrictionsString }),
          callback: () => {
            this.$set(this.alerts, "Successfully updated dietary restrictions", "success");
            setTimeout(() => this.$delete(this.alerts, "Successfully updated dietary restrictions"), 3000);
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