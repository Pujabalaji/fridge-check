<!-- Form for registering an account (block style) -->
<template>
  <BForm @submit.prevent="submit">
    <h3>Create an account:</h3>
    <article>
      <BFormGroup id="new-username" label="Username" label-for="new-username">
        <BFormInput
          id="new-username"
          v-model="username"
          type="text"
          :state="isValidUsername"
        />
        <BFormInvalidFeedback>
          Username must be a nonempty alphanumeric string
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="new-password" label="Password" label-for="new-password">
        <BFormInput
          id="new-password"
          v-model="password"
          type="password"
          :state="isValidPassword"
        />
        <BFormInvalidFeedback>
          Password must be a nonempty string.
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup
        id="email"
        label="Email"
        label-for="email"
        description="Your email will be visible to users who follow your home community."
      >
        <BFormInput
          id="email"
          v-model="email"
          type="email"
          :state="isValidEmail"
        />
        <BFormInvalidFeedback>
          Email must be a nonempty alphanumeric string.
        </BFormInvalidFeedback>
      </BFormGroup>
      <BFormGroup id="home" label="Home Community" label-for="home">
        <BFormSelect
          id="home"
          v-model="homeCommunity"
          :options="communityOptions"
          :state="isValidCommunity"
        >
          <template #first>
            <BFormSelectOption value="" disabled>
              Please select a home community
            </BFormSelectOption>
          </template>
        </BFormSelect>
      </BFormGroup>
      <BFormGroup id="allergies" label="Allergies" label-for="allergies">
        <BFormCheckboxGroup id="allergies" v-model="selectedAllergies">
          <BFormCheckbox value="Peanut">Peanuts</BFormCheckbox>
          <BFormCheckbox value="Tree Nut">Tree Nuts</BFormCheckbox>
          <BFormCheckbox value="Seafood">Seafood</BFormCheckbox>
        </BFormCheckboxGroup>
      </BFormGroup>
      <BFormGroup
        id="other"
        label="Other dietary restrictions"
        label-for="other"
      >
        <BFormCheckboxGroup id="other" v-model="selectedOtherRestrictions">
          <BFormCheckbox value="Vegetarian">Vegetarian</BFormCheckbox>
          <BFormCheckbox value="Vegan">Vegan</BFormCheckbox>
          <BFormCheckbox value="Pescetarian">Pescatarian</BFormCheckbox>
        </BFormCheckboxGroup>
      </BFormGroup>
    </article>
    <BButton type="submit" variant="primary" :disabled="!enableSubmit" block>
      Create account
    </BButton>
    <BAlert
      v-for="(status, alert, index) in alerts"
      :key="index"
      :variant="status === 'error' ? 'danger' : 'success'"
      show
    >
      {{ alert }}
    </BAlert>
  </BForm>
</template>

<script>
export default {
  name: "RegisterForm",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      selectedAllergies: [],
      selectedOtherRestrictions: [],
      homeCommunity: "",
      communityOptions: [
        { value: "Baker", text: "Baker" },
        { value: "Burton Conner", text: "Burton Conner" },
        { value: "East Campus", text: "East Campus" },
        { value: "MacGregor", text: "MacGregor" },
        { value: "Maseeh", text: "Maseeh" },
        { value: "McCormick", text: "McCormick" },
        { value: "New House", text: "New House" },
        { value: "New Vassar", text: "New Vassar" },
        { value: "Next House", text: "Next House" },
        { value: "New House", text: "New House" },
        { value: "Random", text: "Random" },
        { value: "Simmons", text: "Simmons" },
        { value: "Off-campus Cambridge", text: "Off-campus Cambridge" },
        { value: "Off-campus Boston", text: "Off-campus Boston" },
      ],
      alerts: {},
      callback: null,
    };
  },
  computed: {
    isValidUsername() {
      const usernameRegex = /^\w+$/i;
      if (!usernameRegex.test(this.username)) {
        return false;
      }
      return true;
    },
    isValidPassword() {
      const passwordRegex = /^\S+$/;
      if (!passwordRegex.test(this.password)) {
        return false;
      }
      return true;
    },
    isValidEmail() {
      const emailRegex = /^\S+$/;
      if (!emailRegex.test(this.email)) {
        return false;
      }
      return true;
    },
    isValidCommunity() {
      return this.homeCommunity.length > 0;
    },
    enableSubmit() {
      return (
        this.isValidUsername &&
        this.isValidPassword &&
        this.isValidEmail &&
        this.isValidCommunity
      );
    },
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          email: this.email,
          allergies: this.selectedAllergies,
          otherDietaryRestrictions: this.selectedOtherRestrictions,
          homeCommunity: this.homeCommunity,
        }),
        message: "Successfully created user",
        callback: () => {
          this.$set(this.alerts, "Successfully created user", "success");
          setTimeout(
            () => this.$delete(this.alerts, "Successfully created user"),
            3000
          );
        },
      };

      try {
        const r = await fetch("/api/users", options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.$store.commit("setUsername", res.user ? res.user.username : null);
        this.$store.commit("setUser", res.user ? res.user : null);
        options.callback();
        this.$router.push({ name: "Home" });
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>