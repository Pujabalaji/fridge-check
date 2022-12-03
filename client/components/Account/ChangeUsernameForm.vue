<!-- Form for changing username (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "ChangeUsernameForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users",
      method: "PATCH",
      hasBody: true,
      setUsername: true,
      fields: [
        {
          id: "username",
          label: "Username",
          value: "",
          type: "text",
          submitStatus: this.isValidUsername,
        },
      ],
      title: "Change username",
      callback: () => {
        const message = "Successfully changed username!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
  methods: {
    isValidUsername(value) {
      const usernameRegex = /^\w+$/i;
      if (!usernameRegex.test(value)) {
        return {
          status: "error",
          errorToDisplay: "Username must be a nonempty alphanumeric string.",
        };
      }
      return { status: "ok", errorToDisplay: "" };
    },
  },
};
</script>
