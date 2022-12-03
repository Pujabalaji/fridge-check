<!-- Form for changing contact info (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "ChangeContactInfoForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users",
      method: "PATCH",
      hasBody: true,
      setUsername: true,
      fields: [
        {
          id: "email",
          label: "Email",
          value: this.$store.state.user?.email ?? "",
          type: "email",
          submitStatus: this.isValidEmail,
        },
      ],
      title: "Change email",
      callback: () => {
        const message = "Successfully changed email!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
  methods: {
    isValidEmail(value) {
      const emailRegex = /^\S+$/;
      if (!emailRegex.test(value)) {
        return false;
      }
      return true;
    },
  },
};
</script>
