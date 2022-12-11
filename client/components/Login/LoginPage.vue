<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section class="column">
      <LoginForm />
    </section>
    <section class="column">
      <RegisterForm />
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>

<style scoped>
main {
  display: flex;
  gap: 1.5em;
}

.column {
  flex: 1;
}

</style>
