<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <BForm @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article v-if="fields.length">
      <BFormGroup
        v-for="field in fields"
        :key="field.id"
        :id="field.id"
        :label="field.label"
        :label-for="field.id"
      >
        <BFormInput
          :id="field.id"
          v-model="field.value"
          :type="field.type"
          :state="field.submitStatus(field.value).status == 'ok'"
        />
        <BFormInvalidFeedback>
          {{ field.submitStatus(field.value).errorToDisplay }}
        </BFormInvalidFeedback>
      </BFormGroup>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <BButton type="submit" variant="primary" :disabled="!shouldSubmit" block>
      {{ title }}
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
  name: "BlockForm",
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      fields: [],
      title: "",
      content: "",
    };
  },
  computed: {
    shouldSubmit() {
      return !this.fields.some(
        (field) => !(field.submitStatus(field.value).status === "ok")
      );
    },
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(
          Object.fromEntries(
            this.fields.map((field) => {
              const { id, value } = field;
              return [id, value];
            })
          )
        );
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit(
            "setUsername",
            res.user ? res.user.username : null
          );
          this.$store.commit("setUser", res.user ? res.user : null);
        }

        this.fields.forEach((field) => {
          field.value = "";
        });

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
