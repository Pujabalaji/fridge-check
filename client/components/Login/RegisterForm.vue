<!-- Form for registering an account (block style) -->
<template>
  <form @submit.prevent="submit">
    <h3>Create an account:</h3>
    <article>
      <div><label>Username: </label> <input v-model="username" /></div>
      <br>
      <div><label>Password: </label> <input type="password" v-model="password" /></div>
      <br>
      <div><label>Contact info: </label> <input v-model="contactInfo" />
      <p>Your contact info will be visible to users who follow your home community. </p></div>
      <br>
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
      <br>
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
      <br>
      <div>
      Home community:
      <select name="homeCommunity" id="homeCommunity" v-model="homeCommunity">
        <option value="Baker">Baker </option>
        <option value="Burton Connor">Burton Connor </option>
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
    <button type="submit" :disabled="!(enableSubmit().status == 'ok')">
      Create account
    </button>
    <div class="disabledsubmit" v-if="!(enableSubmit().status == 'ok')">
      {{ enableSubmit().errorToDisplay }}
    </div>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: "RegisterForm",
  data () {
    return {
      username: "",
      password: "",
      contactInfo: "",
      peanutChecked: false,
      treenutChecked: false,
      seafoodChecked: false,
      vegetarianChecked: false,
      veganChecked: false,
      pescetarianChecked: false,
      homeCommunity: "",
      alerts: {},
      callback: null
    }
  },
  methods: {
    enableSubmit() {
      let status = "ok";
      let errorToDisplay = "";
      const usernameRegex = /^\w+$/i;
      const emailRegex = /^\S+$/;
      const passwordRegex = /^\S+$/;
      if (!usernameRegex.test(this.username)) {
        errorToDisplay = "Username must be a nonempty alphanumeric string.";
        status = "error";
      } else if (!passwordRegex.test(this.password)) {
        errorToDisplay = "Password must be a nonempty string.";
        status = "error";
      } else if (!emailRegex.test(this.contactInfo)) {
        errorToDisplay = "Email must be a nonempty alphanumeric string.";
        status = "error";
      }
      return { status: status, errorToDisplay: errorToDisplay };
    },
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      let allergiesArray = [];
      if (this.peanutChecked) {
        allergiesArray.push("Peanut");
      } if (this.treenutChecked) {
        allergiesArray.push("Tree Nut");
      } if (this.seafoodChecked) {
        allergiesArray.push("Seafood");
      }
      let dietaryRestrictionsArray = [];
      if (this.vegetarianChecked) {
        dietaryRestrictionsArray.push("Vegetarian");
      } if (this.veganChecked) {
        dietaryRestrictionsArray.push("Vegan");
      } if (this.pescetarianChecked) {
        dietaryRestrictionsArray.push("Pescatarian");
      }
      const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
        body: JSON.stringify({ username: this.username, password: this.password, contactInfo: this.contactInfo, allergies: allergiesArray, otherDietaryRestrictions: dietaryRestrictionsArray, homeCommunity: this.homeCommunity }),
        message: "Successfully created user",
        callback: () => {
          this.$set(this.alerts, "Successfully created user", "success");
          setTimeout(() => this.$delete(this.alerts, "Successfully created user"), 3000);
        },
      };

      try {
        const r = await fetch('/api/users', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.$store.commit("setUsername", res.user ? res.user.username : null);
        this.$store.commit("setUser", res.user ? res.user : null);
        options.callback();
        this.$router.push({name: 'Home'});
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