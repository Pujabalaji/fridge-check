<!-- Form for signing out (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LogoutForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'DELETE',
      setUsername: true,
      title: 'Sign out',
      fields: [],
      content: 'Taking a break? See you later.',
      callback: () => {
        this.$router.push({name: 'Login'}); // Goes to Home page after signing out
        this.$store.commit('clearCurrentFood');
        this.$store.commit("clearRecipes");
        this.$store.commit("updateShowSuggested", false);
        this.$store.commit("updateShowByName", false);
        this.$store.commit('alert', {
          message: 'You are now signed out!', status: 'success'
        });
      }
    };
  }
};
</script>
