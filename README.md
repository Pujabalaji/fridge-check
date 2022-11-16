# Fritter Frontend
Congrats, you've completed the Fritter backend! Now it's time to make an interface that your users will be able to interact with in A6: Fritter frontend. **Make sure to read this document fully** as well, as it contains a lot of A6-specific info!

## Starter Code

This starter code implements freets, feeds, and forms with no styling. The backend starter code for freets and users from the previous assignment (A5) is contained in the `server` folder. The frontend starter code is in the `client` folder and is implemented using the [Vue](https://v2.vuejs.org/) framework.

The project is structured as follows:

- `api/index.ts` sets up the backend database connection and Express server. This should actually be in the `server` folder, but it must be here due to a Vercel limitation.
- `server/` contains the backend starter code from A5 (with some changes)
  - `freet/` contains files related to the Freet concept
  - `user/` contains files related to the User concept
- `client/` contains the frontend starter code
  - `App.vue` is the root component of your application
  - `main.ts` is the entry point of your application, which initializes Vue
  - `components/` contains the components of the frontend
    - `Account/` contains the account settings page and the related forms
    - `Freet/` contains the homepage and components related to Freets
    - `Login/` contains the login/register page and the related forms
    - `Common/` contains general form components that can be reused across different concepts
  - `public/` contains base HTML files and static assets (like the default Fritter logo)
  - `router.ts` contains the Vue router
  - `store.ts` contains the Vuex store, which stores application state and persistent data

## Installation

Make a copy of this repository under your personal GitHub account by clicking the `Use this template` button. Run `npm install` in your terminal to install local dependencies. Copy your `.env` file from A5 into the root directory of your new repo. Make sure you can run the starter code locally before proceeding.

## Setup
To incorporate the backend you developed in A5 with our starter frontend, please move your files into the `server` folder. For example, note that whereas the `freet` and `user` folders were in the root directory of your backend, they have been now moved to `server/freet` and `server/user`, respectively.

We've made some updated to the A5 server starter code that we hope you can incorporate into your backend as well.

> **Please reference the [full diff here](https://gist.github.com/dengzac/a9f592950e947b604798443b5ce71be1) for a complete list of changes.**

A summary of the changes is provided below:
- `api/index.ts`:
  - Add mongo store to track sessions
  - Remove old frontend from express server (**remember to copy over lines importing your `router.ts` files**)
- `freet/middleware.ts` and `user/middleware.ts`:
  - change all contents of `error:` to strings to be easily printed out by the frontend
  - in `isUsernameNotAlreadyInUse()` of `user/middleware.ts`: bug fix related to changing password
- `freet/collection.ts`:
  - update finding freets from an author to return in descending order for consistency with finding all freets
- `freet/router.ts`
  - updated incorrect documentation for `GET /api/freets`
  - changed `PUT` to `PATCH /api/freets/:freetid`, to better follow REST API conventions
- `user/router.ts`
  - add `GET /api/users/session` so the frontend can fetch info about the logged-in user
  - changed `PUT` to `PATCH /api/users`, to better follow REST API conventions
- `user/collection.ts`
  - add typings to a `updateOne()` parameter to make TypeScript happy

Once you're done, test once more that you can run the project locally. Now you're ready to start developing your frontend interface for Fritter!

## Running locally

Running locally requires a few extra npm scripts from `package.json` in comparison to A5.
1. Run `npm run serve`, which compiles the frontend for hot-reloading with webpack and serves it at port `8080`.
2. Open a new terminal (with the original one still open) and run `npm run dev` to start the backend at port `3000`.
3. To view your website, **connect to [localhost:8080](http://localhost:8080)** (instead of port 3000) since the backend will no longer serve any HTML files.

Vue proxies any URL it can't resolve on the client side (at port 8080) to the server (to port 3030), which is why we can call API routes using relative URLs (such as `fetch('/api/freets')`). See `client/vue.config.js` and associated [Vue CLI docs](https://cli.vuejs.org/config/#vue-config-js) for more details.

## Deployment to Vercel

We will be using Vercel to host a publicly accessible deployment of your application.

1. Log in to Vercel and go to the [project creation page](https://vercel.com/new) and select `Continue with GitHub`.

2. Find your frontend repository you just created and click `Import`. For the `Framework Preset`, choose `Vue.js`. In the `Build and Output Settings` section, toggle the override switch for `Output Directory` and set it to `client/dist`. In the `Environment Variables` section, add an entry where `NAME` is `MONGO_SRV` and `VALUE` is your [MongoDB secret](https://github.com/61040-fa22/fritter-backend#mongodb-atlas-setup).

3. Click `Deploy` and you will get a link like `https://fritter-starter-abcd.vercel.app/` where you can access your site.

Vercel will automatically deploy the latest version of your code whenever a push is made to the `main` branch.

## Using Vue
Working in Vue means working with Vue components. The starter code organizes components by the resultant tree structure of how the components are composed together.

### Template
Every component takes advantage of an [HTML-based template syntax](https://v2.vuejs.org/v2/guide/syntax.html), which is HTML code that binds the rendered DOM to the component data. Inside the template is where we can display specific form components like `<CreateFreetForm />`. We also take advantage of [conditional rendering](https://v2.vuejs.org/v2/guide/conditional.html) here to display different things to different users (such as signed in vs. signed out). For example, in `client/components/Freet/Freets.vue` in lines 5-23, we have:
```
<section v-if="$store.state.username">
  <header>
    <h2>Welcome @{{ $store.state.username }}</h2>
  </header>
  <CreateFreetForm />
</section>
<section v-else>
  <header>
    <h2>Welcome to Fritter!</h2>
  </header>
  <article>
    <h3>
      <router-link to="/login">
        Sign in
      </router-link>
      to create, edit, and delete freets.
    </h3>
  </article>
</section>
```
Here, if `store.state.username` exists, we say `Welcome @username`. Otherwise, we say `Welcome to Fritter!` and give them a link to the login page. This is just one example of conditional rendering.

### Components
Each `.vue` file also has script tag, which is where you can export the actual component.

The "top level" components displayed when you navigating to certain URLs (like `/login` or `/account`) are shown in `client/router.ts`. Within each of these components, we have:
- `name` name of the component
- `components` components that are used in this top level component, usually forms like `LoginForm`

The "lower level" components are the general form components that we have provided. These consist of:
- `name` name of the component
- `mixins` (sometimes) used to have reusable logic between components. In this case, mixins have components in `client/components/common/` like `BlockForm`.
- `props` (sometimes) properties that are passed from a parent component to child components as needed
- `data()` stores data associated with this Vue instance
- `methods` methods associated with the current component that can be used in it

### Store
You may see that many components use `this.$store`. In `client/store.ts`, we have created a `Vuex.Store` that is used to our application state. We use [**mutations**](https://vuex.vuejs.org/guide/mutations.html) to change state. We call these mutations by doing `this.$store.commit('[mutation]', [payload])`. The `payload` is like an additional argument that could be used in our mutation. An example mutation:
```
setUsername(state, username) {
  /**
    * Update the stored username to the specified one.
    * @param username - new username to set
    */
  state.username = username;
}
```
This mutation is called a few times, such as in `App.vue` where it says `this.$store.commit('setUsername', user ? user.username : null);`. In this case, we are committing the value of our username, which can be accessed within the state as `$store.state.username`.

### Routing
Routing on the server side means the server sending a response based on the URL path that the user is visiting. When we click on a link in a traditional server-rendered web app, the browser receives an HTML response from the server and reloads the entire page with the new HTML.

However, in a [Single-Page Application (SPA)](https://developer.mozilla.org/en-US/docs/Glossary/SPA) like the one we're developing, the client-side JavaScript can intercept the navigation, dynamically fetch new data, and update the current page without full page reloads. This typically results in a more snappy user experience, especially for use cases that are more like actual "applications", where the user is expected to perform many interactions over a long period of time.

In such SPAs, the "routing" is done on the client side, in the browser. A client-side router is responsible for managing the application's rendered view using browser APIs such as History API or the hashchange event. We use the [Vue Router](https://v3.router.vuejs.org) library for client-side routing, which is referenced in `client/router.ts`.

### References

> **IMPORTANT:** This starter code uses **[version 2](https://v2.vuejs.org/) of Vue**, not [version 3](https://vuejs.org/)! There are multiple significant breaking changes between the two versions, so **please only consult documentation, StackOverflow questions, and other resources that reference Vue 2**.

Here is a list of documentation you may want to consult while working with Vue:

* [Vue 2 main library documentation](https://v2.vuejs.org)
* [Vue Router for Vue 2](https://v3.router.vuejs.org)
* [Vuex for Vue 2](https://v3.vuex.vuejs.org)
* [Vue Template Explorer for Vue 2](https://v2.template-explorer.vuejs.org)
* [MDN's in-depth Vue tutorials](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks#vue_tutorials)
