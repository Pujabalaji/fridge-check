<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header> <br>
      <ChangeUsernameForm />
      <ChangePasswordForm />
      <ChangeContactInfoForm />
      <ChangeAllergiesForm />
      <ChangeDietaryRestrictionsForm />
      <ChangeHomeCommunityForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import ChangeContactInfoForm from '@/components/Account/ChangeContactInfoForm.vue';
import ChangeAllergiesForm from '@/components/Account/ChangeAllergiesForm.vue';
import ChangeDietaryRestrictionsForm from '@/components/Account/ChangeDietaryRestrictionsForm.vue';
import ChangeHomeCommunityForm from '@/components/Account/ChangeHomeCommunityForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    ChangeContactInfoForm,
    ChangeAllergiesForm,
    ChangeDietaryRestrictionsForm,
    ChangeHomeCommunityForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>
