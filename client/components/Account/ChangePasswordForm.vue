<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangePasswordForm',
  mixins: [BlockForm],
  computed: {
    enableSubmit() {
      let status = "ok";
      let errorToDisplay = "";
      const content = this.fields[0].value;
      const passwordRegex = /^\S+$/;
      if (!passwordRegex.test(content)) {
        errorToDisplay = "Password must be a nonempty string.";
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
      fields: [
        {id: 'password', label: 'Password', value: '', type: 'password'}
      ],
      title: 'Change password',
      callback: () => {
        const message = 'Successfully changed password!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
