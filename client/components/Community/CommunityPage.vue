<!-- Default page that displays communities -->

<template>
    <main v-if="$store.state.username">
        <section>
            <header>
                <h2>Communities</h2>
                <p>Follow communities to indicate you are willing to pickup items from a given location.
                    <br>
                    Listings you post will only be visible to those who have joined your home community as set in your Account page.
                </p>
            </header>
        </section>

        <h3>Your communities</h3>
        <section>
            <CommunityComponent v-for="community in alreadyFollowedCommunities" :key="community" v-bind:alreadyFollows="true" v-bind:communityName="community" @fetchFollows="communitiesUserFollows" />
        </section>

        <h3>Follow other communities</h3>
        <section>
            <!-- One row for each community -->
            <CommunityComponent v-for="community in unfollowedCommunities" :key="community" v-bind:alreadyFollows="false" v-bind:communityName="community" @fetchFollows="communitiesUserFollows" />
        </section>
    </main>
</template>

<script>
import CommunityComponent from '@/components/Community/CommunityComponent.vue';

export default {
    name: 'CommunityPage',
    components: { CommunityComponent },
    data() {
        return {
            alerts: {},
            alreadyFollowedCommunities: [],
            unfollowedCommunities: []
        }
    },
    async created() {
      await this.communitiesUserFollows();
      this.unfollowedCommunities = this.$store.state.communities.filter(community => !this.alreadyFollowedCommunities.includes(community));
    },
    computed: {
      alreadyFollows() {
        this.communitiesUserFollows();
        this.unfollowedCommunities = this.$store.state.communities.filter(community => !this.alreadyFollowedCommunities.includes(community));
      }
    },
    methods: {
        async communitiesUserFollows() {
            const params = {
                method: 'GET',
                message: "Successfully received all communities current user follows.",
                callback: () => {
                    this.$set(this.alerts, params.message, "success");
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            }
            const response = await this.request(params, `/api/follows/session`);
            this.alreadyFollowedCommunities = response.map(x => x.community);
            this.unfollowedCommunities = this.$store.state.communities.filter(community => !this.alreadyFollowedCommunities.includes(community));
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
                method: params.method, headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'}
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
                
                params.callback();
                const response = await r.json();
                return response;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>