<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeUsernameForm',
  mixins: [BlockForm],
  computed: {
    enableSubmit() {
      let status = "ok";
      let errorToDisplay = "";
      const content = this.fields[0].value;
      const usernameRegex = /^\w+$/i;
      if (!usernameRegex.test(content)) {
        errorToDisplay = "Username must be a nonempty alphanumeric string.";
        status = "error";
      } else if (content == this.$store.state.username) {
        errorToDisplay = "New username must be different from your current username.";
        status = "error";
      }
      return { status: status, errorToDisplay: errorToDisplay };
    },
  },
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      setUsername: true,
      fields: [
        { id: 'username', label: 'Username', value: '', type: 'text' }
      ],
      title: 'Change username',
      callback: () => {
        const message = 'Successfully changed username!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
