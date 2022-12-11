<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from "@/components/common/InlineForm.vue";

export default {
  name: "GetRecipesForm",
  mixins: [InlineForm],
  data() {
    return { value: ""};
  },
  methods: {
    async submit() {
      this.$emit('loading', true);
      this.$store.commit("updateShowByName", true);
      this.$store.commit("updateShowSuggested", false);
      if (this.$store.state.lastSearched.length === 0) {
        this.$store.commit("updateLastSearched", this.value);
      }

      const url = `/api/recipes?recipeName=${this.value}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit("updateRecipes", res);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.$store.commit("updateLastSearched", this.value);
      this.value = "";
      this.$emit('loading', false);
    },
  },
};
</script>