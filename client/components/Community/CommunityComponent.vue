
<template>
  <article>
    <!-- v-if=this.doesFollow()  -->
    <BCard class="oneCommunity">
      <span>{{ communityName }}</span>
      <BButton v-if="!alreadyFollows" @click="followRequest" variant="info">
        <BIconstack>
          <BIconHouse stacked />
          <BIconPlus scale="0.90" shift-v="-1" stacked />
        </BIconstack>
        <span>Follow</span>
      </BButton>
      <BButton v-if="alreadyFollows" @click="unfollowRequest" variant="info">
        <BIconstack>
          <BIconHouse stacked />
          <BIconDash scale="0.90" shift-v="-1" stacked />
        </BIconstack>
        <span>Unfollow</span>
      </BButton>
    </BCard>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: "CommunityComponent",
  props: {
    communityName: String,
    alreadyFollows: Boolean,
  },
  data() {
    return {
      alerts: {},
    };
  },
  methods: {
    async unfollowRequest() {
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully unfollowed " + this.communityName,
            status: "success",
          });
        },
      };
      const response = await this.request(
        params,
        `api/follows/${this.communityName}`
      );
      this.$emit("fetchFollows");
    },
    async followRequest() {
      const params = {
        method: "PUT",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully followed " + this.communityName,
            status: "success",
          });
        },
      };
      const response = await this.request(
        params,
        `/api/follows/${this.communityName}`
      );
      this.$emit("fetchFollows");
    },
    async request(params, url) {
      /**
       * Adds and deletes follow.
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        let r = await fetch(url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        // this.$store.commit('refreshFollowees', true);
        params.callback();
        const response = await r.json();
        return response;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.oneCommunity {
  background-color: #d0ebff;
  margin-bottom: 0.5em;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  display: flex;
  gap: 0.25em;
  align-items: center;
}
</style>