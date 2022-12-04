<!-- Form for changing home community (block style) -->
<template>
  <BForm @submit.prevent="submit">
    <h3>Change home community</h3>
    <article>
      <BFormGroup id="home" label="Home Community" label-for="home">
        <BFormSelect
          id="home"
          v-model="homeCommunity"
          :options="communityOptions"
        >
          <template #first>
            <BFormSelectOption value="" disabled
              >Please select a home community</BFormSelectOption
            >
          </template>
        </BFormSelect>
      </BFormGroup>
    </article>
    <BButton type="submit" variant="primary" block>
      Change home community
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
  name: "ChangeHomeCommunityForm",
  data() {
    return {
      homeCommunity: this.$store.state.user.homeCommunity ?? "",
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
  methods: {
    async submit() {
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
        body: JSON.stringify({ homeCommunity: this.homeCommunity }),
        callback: () => {
          this.$set(
            this.alerts,
            "Successfully updated home community",
            "success"
          );
          setTimeout(
            () =>
              this.$delete(this.alerts, "Successfully updated home community"),
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