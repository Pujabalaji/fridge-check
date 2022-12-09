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
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(value)) {
        return {
          status: "error",
          errorToDisplay: "Email must be a nonempty alphanumeric string, containing an '@' and '.' followed by a domain name.",
        };
      }
      return { status: "ok", errorToDisplay: "" };
    },
  },
};
</script>
