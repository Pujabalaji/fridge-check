<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  methods: {
    enableSubmit() {
      let status = "ok";
      let errorToDisplay = "";
      const usernameRegex = /^\w+$/i;
      const passwordRegex = /^\S+$/;
      if (!usernameRegex.test(this.fields[0].value)) {
        errorToDisplay = "Username must be a nonempty alphanumeric string.";
        status = "error";
      } else if (!passwordRegex.test(this.fields[1].value)) {
        errorToDisplay = "Password must be a nonempty string.";
        status = "error";
      }
      return { status: status, errorToDisplay: errorToDisplay };
    },
  },
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'password', label: 'Password', value: ''}
      ],
      title: 'Sign in',
      callback: () => {
        this.$router.push({name: 'Home'});
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
      }
    };
  }
};
</script>
