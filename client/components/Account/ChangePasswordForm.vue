<!-- Form for changing password (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "ChangePasswordForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users",
      method: "PATCH",
      hasBody: true,
      fields: [
        {
          id: "password",
          label: "Password",
          value: "",
          type: "password",
          submitStatus: this.isValidPassword,
        },
      ],
      title: "Change password",
      callback: () => {
        const message = "Successfully changed password!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
  methods: {
    isValidPassword(value) {
      const passwordRegex = /^\S+$/;
      if (!passwordRegex.test(value)) {
        return {
          status: "error",
          errorToDisplay: "Password must be a nonempty string.",
        };
      }
      return { status: "ok", errorToDisplay: "" };
    },
  },
};
</script>
