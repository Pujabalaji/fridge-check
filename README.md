# Fridge Check
According to the USDA, 40% of food waste comes from households. Do you know what’s in the back of your fridge? How long has that leftover pasta been sitting hidden behind the takeout you keep ordering? Do you ever forget about food items until they’re moldy and have to be thrown out, contributing to food waste? With FridgeCheck, you’ll no longer lose track of items in your fridge or pantry! Simply input your groceries and meals, and our app will show you which ones are expiring next, and won’t remove anything from your “stockpile” until you remove it, indicating it’s no longer in your fridge growing moldy. Is something about to go bad, and you don’t have time to consume it? With FridgeCheck, you can easily create a “listing,” allowing others to purchase (or just take for free) your food items, so they don’t go to waste! Are you out of ideas for what to make with the items you have in your fridge? FridgeCheck can suggest recipes for you that use those ingredients. If you need a few extra ingredients to make the suggested meal, FridgeCheck will show you suggestions for who you can purchase or take the item from living communities you’re willing to pick up from! When you indicate you’ve made a recipe from that list, the items from your stockpile that that uses are automatically removed from your stockpile. With this new way to keep track of the food you’ve bought and tailored recipes to your fridge, FridgeCheck will help you keep mold out of your fridge and reduce your food waste!

## Code Layout

This code contains the backend and frontend for FridgeCheck. The backend code for is contained in the `server` folder. The frontend code is in the `client` folder and is implemented using the [Vue](https://v2.vuejs.org/) framework.

The project is structured as follows:

- `api/index.ts` sets up the backend database connection and Express server. This should actually be in the `server` folder, but it must be here due to a Vercel limitation.
- `server/` contains the backend code
  - `user/` contains files related to the User concept
- `client/` contains the frontend code
  - `App.vue` is the root component of your application
  - `main.ts` is the entry point of your application, which initializes Vue
  - `components/` contains the components of the frontend
    - `Account/` contains the account settings page and the related forms
    - `Home/` contains the homepage
    - `Login/` contains the login/register page and the related forms
    - `Common/` contains general form components that can be reused across different concepts
  - `public/` contains base HTML files and static assets
  - `router.ts` contains the Vue router
  - `store.ts` contains the Vuex store, which stores application state and persistent data

## Installation

Make a copy of this repository under your personal GitHub account by clicking the `Use this template` button. Run `npm install` in your terminal to install local dependencies. Copy your `.env` file from A5 into the root directory of your new repo. Make sure you can run the starter code locally before proceeding.

## Running locally

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

## Routes

### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

### `POST /api/users` - Create an new user account

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password
- `contactInfo` _{string}_ - The user's contact information
- `allergies` _{array<string>}_ - The user's allergies
- `otherDietaryRestrictions` _{array<string>}_ - The user's dietary restrictions
- `homeCommunity` _{string} - The user's home community

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username, password, contactInfo, allergies, otherDietaryRestrictions, or homeCommunity are in the wrong format
- `409` if username is already in use

### `PATCH /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password
- `contactInfo` _{string}_ - The user's contact information
- `allergies` _{array<string>}_ - The user's allergies
- `otherDietaryRestrictions` _{array<string>}_ - The user's dietary restrictions
- `homeCommunity` _{string} - The user's home community

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username, password, contactInfo, allergies, otherDietaryRestrictions, or homeCommunity are in the wrong format
- `409` if the username is already in use

### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in

### `GET /api/foods` - Get all food items for currently logged-in user

**Returns**

- A list of foods

### `POST /api/foods` - Add food to current user’s stockpile

**Body**

- `name` _{string}_ - The food's name
- `quantity` _{number}_ - The food's quantity
- `unit` _{string}_ - The unit associated with the quantity
- `expiration` _{date}_ - The food's expiration date

**Throws**

- `403` if the user is not logged in
- `400` if the food name is empty or a stream of empty spaces
- `400` if the food quantity is less than 1
- `400` if the food unit is not a valid string in the Unit enum
- `400` if the expiration date is not the proper MM/DD/YYYY format
- `413` if the expiration date is prior to today's date

### `PATCH /api/foods/:foodId` - Change quantity of a item or remove item

**Body**

- `quantity` _{number}_ - The food's updated quantity

**Throws**

- `403` if the user is not logged in
- `404` if the foodId is not valid
- `400` if the food quantity is less than 1

### `DELETE /api/foods/:foodId` - Remove food item from stockpile

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `404` if the foodId is not valid

### `GET /api/listings` - Get all listings created by the current user

### `POST /api/listings` - Add listing to current user’s listings

**Body**

- `foodId` _{string}_ - the food item that is being listed
- `price` _{string}_ - the price the food item is being sold for (TODO: how do you handle free items)

### `PATCH /api/listings/:listingId` - Change quantity or price of a listing

**Body** _(no need to add fields that are not being changed)_

- `quantity` - The new quantity of food item in listing
- `price` - The new price of the listing

### `DELETE /api/listings/:listingId` - Delete a user’s listing

### `GET /api/communities/session` - Get all the communities that the current user follows

### `GET /api/communities/listings` - Get all listings in communities that the currently user follows

### `POST /api/communities` - Follow a community

### `DELETE /api/communities/:communityName` - Unfollow a community

### `GET /api/recipes/suggested` - Gets all suggested recipes for current user based on their stockpile and dietary restrictions

### `GET /api/recipes?name=name` - Gets recipes searching by given name and dietary restrictions