<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <header>
          <h2>Home Page</h2>
          <p>This is a placeholder homepage. Normally, the homepage will be the stockpile page. For now, information about the currently-logged-in user is displayed here to demonstrate the functionality of the user concept. </p>
          <div>Username: {{ $store.state.username }}</div>
          <div>Email: {{ $store.state.user?.email }}</div>
          <div>Allergies: {{ $store.state.user?.allergies }}</div>
          <div>Other dietary restrictions: {{ $store.state.user?.otherDietaryRestrictions }}</div>
          <div>Home community: {{ $store.state.user?.homeCommunity }}</div>
        </header>
      </section>
    </main>
  </template>
  
  <script>

  export default {
    name: 'HomePage'
  };
  </script>
  