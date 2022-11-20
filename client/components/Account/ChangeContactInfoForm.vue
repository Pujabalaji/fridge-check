<!-- Form for changing contact info (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeContactInfoForm',
  mixins: [BlockForm],
  methods: {
    enableSubmit() {
      let status = "ok";
      let errorToDisplay = "";
      const content = this.fields[0].value;
      const emailRegex = /^\S+$/;
      if (!emailRegex.test(content)) {
        errorToDisplay = "Email must be a nonempty string.";
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
        { id: 'contactInfo', label: 'Email', value: this.$store.state.user?.contactInfo ?? '' }
      ],
      title: 'Change email',
      callback: () => {
        const message = 'Successfully changed contact info!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
