<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link v-if="!isLoggedIn()" to="/signup">Signup</router-link>
      |
      <router-link v-if="!isLoggedIn()" to="/login">Login</router-link>
      |
      <router-link v-if="isLoggedIn()" :to="`/users/${getUserId()}`">Profile</router-link>
      |
      <router-link v-if="isLoggedIn()" to="/cart">Cart</router-link>
      |
      <router-link v-if="isLoggedIn()" to="/orders">Orders</router-link>
      |
      <router-link v-if="isLoggedIn()" to="/logout">Logout</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import moment from "moment";

export default {
  methods: {
    isLoggedIn: function() {
      return localStorage.getItem("jwt");
    },
    getUserId: function() {
      return localStorage.user_id;
    },
    formattedDate: function(date) {
      return moment
        .parseZone(date)
        .utc()
        .format("MMM D, YYYY h:mm A");
    },
    formattedTime: function(time) {
      return moment
        .parseZone(time)
        .utc()
        .format("h:mm A");
    },
  },
};
</script>
