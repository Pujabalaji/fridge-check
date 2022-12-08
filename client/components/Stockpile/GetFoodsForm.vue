<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
    name: 'GetFoodsForm',
    mixins: [InlineForm],
    data() {
        return { value: this.$store.state.stockpileFilter };
    },
    methods: {
        async submit() {
            const url = this.value ? `/api/foods?foodName=${this.value}` : '/api/foods';
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                console.log(res);
                this.$store.commit('updateStockpileFilter', this.value);
                this.$store.commit('updateStockpile', res);
            } catch (e) {
                if (this.value === this.$store.state.stockpileFilter) {
                    this.$store.commit('updateStockpileFilter', null);
                    this.value = '';
                    this.$store.dispatch('refreshStockpile');
                } else {
                    this.value = this.$store.state.stockpileFilter;
                }

                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>