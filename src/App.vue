<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light osahan-nav shadow-sm">
      <div class="container">
        <router-link class="navbar-brand" to="/"><img alt="logo" src="img/logo.png" /></router-link>
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
                <img alt="Generic placeholder image" src="/img/user/4.png" class="nav-osahan-pic rounded-pill" />
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
            <li v-if="isLoggedIn()" class="nav-item dropdown dropdown-cart">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-shopping-basket"></i>
                Cart
                <span class="badge badge-success">5</span>
              </a>
              <div class="dropdown-menu dropdown-cart-top p-0 dropdown-menu-right shadow-sm border-0">
                <div class="dropdown-cart-top-header p-4">
                  <img class="img-fluid mr-3" alt="osahan" src="img/cart.jpg" />
                  <h6 class="mb-0">Gus's World Famous Chicken</h6>
                  <p class="text-secondary mb-0">310 S Front St, Memphis, USA</p>
                  <small><a class="text-primary font-weight-bold" href="#">View Full Menu</a></small>
                </div>
                <div class="dropdown-cart-top-body border-top p-4">
                  <p class="mb-2">
                    <i class="icofont-ui-press text-danger food-item"></i>
                    Chicken Tikka Sub 12" (30 cm) x 1
                    <span class="float-right text-secondary">$314</span>
                  </p>
                  <p class="mb-2">
                    <i class="icofont-ui-press text-success food-item"></i>
                    Corn & Peas Salad x 1
                    <span class="float-right text-secondary">$209</span>
                  </p>
                  <p class="mb-2">
                    <i class="icofont-ui-press text-success food-item"></i>
                    Veg Seekh Sub 6" (15 cm) x 1
                    <span class="float-right text-secondary">$133</span>
                  </p>
                  <p class="mb-2">
                    <i class="icofont-ui-press text-danger food-item"></i>
                    Chicken Tikka Sub 12" (30 cm) x 1
                    <span class="float-right text-secondary">$314</span>
                  </p>
                  <p class="mb-2">
                    <i class="icofont-ui-press text-danger food-item"></i>
                    Corn & Peas Salad x 1
                    <span class="float-right text-secondary">$209</span>
                  </p>
                </div>
                <div class="dropdown-cart-top-footer border-top p-4">
                  <p class="mb-0 font-weight-bold text-secondary">
                    Sub Total
                    <span class="float-right text-dark">$499</span>
                  </p>
                  <small class="text-info">Extra charges may apply</small>
                </div>
                <div class="dropdown-cart-top-footer border-top p-2">
                  <a class="btn btn-success btn-block btn-lg" href="checkout.html">Checkout</a>
                </div>
              </div>
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
