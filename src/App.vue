<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light osahan-nav shadow-sm">
      <div class="container">
        <router-link class="navbar-brand" to="/"><img alt="logo" src="/img/logo.png" /></router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link v-if="!isLoggedIn()" class="nav-link" to="/login">Login / Signup</router-link>
            </li>
            <li class="nav-item dropdown" v-if="isLoggedIn()">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                My Account
              </a>
              <div class="dropdown-menu dropdown-menu-right shadow-sm border-0">
                <router-link class="dropdown-item" :to="`/users/${getUserId()}`">
                  <i class="icofont-ui-user"></i>
                  View Profile
                </router-link>
                <router-link class="dropdown-item" to="/orders">
                  <i class="icofont-food-cart"></i>
                  Orders
                </router-link>
                <router-link class="dropdown-item" to="/logout">
                  <i class="icofont-logout"></i>
                  Logout
                </router-link>
              </div>
            </li>
            <li v-if="isLoggedIn() && !isChef()" class="nav-item dropdown dropdown-cart">
              <router-link class="nav-link" to="/cart">
                <i class="fas fa-shopping-basket"></i>
                Cart
                <span v-if="cartNumber > 0" class="badge badge-success">{{ cartNumber }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  data: function() {
    return {
      cartNumber: 0,
    };
  },
  created: function() {
    if (this.isLoggedIn()) {
      axios.get("api/carted_dishes").then(response => {
        var cartedDishes = response.data.cart;

        if (cartedDishes) {
          cartedDishes.forEach(dish => {
            this.cartNumber += dish.quantity;
          });
        }
      });
    }
  },
  methods: {
    isLoggedIn: function() {
      return localStorage.getItem("jwt");
    },
    getUserId: function() {
      return localStorage.user_id;
    },
    isChef: function() {
      return localStorage.chef;
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
        .format("h A");
    },
  },
};
</script>
