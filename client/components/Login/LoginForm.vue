<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'Username', value: '', type: 'text', submitStatus: this.isValidUsername},
        {id: 'password', label: 'Password', value: '', type: 'password', submitStatus: this.isValidPassword}
      ],
      title: 'Sign in',
      callback: () => {
        this.$router.push({name: 'Home'});
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
      }
    };
  },
  methods: {
    isValidUsername(value) {
      const usernameRegex = /^\w+$/i;
      if (!usernameRegex.test(value)) {
        return {status: 'error', errorToDisplay: "Username must be a nonempty alphanumeric string."};
      }
      return {status: 'ok', errorToDisplay: ''};
    },
    isValidPassword(value) {
      const passwordRegex = /^\S+$/;
      if (!passwordRegex.test(value)) {
        return {status: 'error', errorToDisplay: "Password must be a nonempty string."}
      }
      return {status: 'ok', errorToDisplay: ''};
    }
  },
};
</script>
