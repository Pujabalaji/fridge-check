<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
    name: 'GetListingsForm',
    mixins: [InlineForm],
    data() {
        return { value: this.$store.state.listingFilter };
    },
    methods: {
        async submit() {
            const url = this.value ? `/api/follows/listings?foodName=${this.value}` : '/api/follows/listings';
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                this.$store.commit('updateListingFilter', this.value);
                this.$store.commit('updateAllListings', res);
            } catch (e) {
                if (this.value === this.$store.state.listingFilter) {
                    this.$store.commit('updateListingFilter', null);
                    this.value = null;
                    this.$store.dispatch('refreshAllListings');
                } else {
                    this.value = this.$store.state.listingFilter;
                }

                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>