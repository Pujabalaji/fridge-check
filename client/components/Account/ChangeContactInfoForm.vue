<!-- Form for changing contact info (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeContactInfoForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'contactInfo', label: 'Contact Info', value: ''}
      ],
      title: 'Change contact info',
      callback: () => {
        const message = 'Successfully changed contact info!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
