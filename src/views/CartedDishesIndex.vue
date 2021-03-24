<template>
  <div class="carted-dishes-index offer-dedicated-body mt-4 mb-4 pt-2 pb-2">
    <div class="container">
      <div class="row" v-if="cartedDishes && cartedDishes.length > 0">
        <div class="col-md-8">
          <div class="bg-white rounded shadow-sm p-4 mb-4">
            <h4 class="mb-1">Order for: {{ day }}, {{ date }}</h4>
            <h6 class="mb-3 text-black-50">
              From
              <router-link :to="`/users/${chef.id}`">Chef {{ chef.first_name }}</router-link>
            </h6>
            <p>Choose time:</p>
            <a
              class="btn btn-outline-info dropdown-toggle btn-sm border-white-btn"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ chosenTime }}
            </a>
            <div class="dropdown-menu dropdown-menu-right shadow-sm border-0">
              <a v-for="hour in hours" :key="hour" class="dropdown-item" href="#" v-on:click="updateTime(hour)">
                {{ hour }}
              </a>
            </div>
            <hr />

            <p>Order method:</p>
            <div class="mb-5">
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="delivery"
                  name="orderMethod"
                  class="custom-control-input"
                  :value="true"
                  v-model="delivery"
                />
                <label class="custom-control-label" for="delivery">Delivery</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="pickup"
                  name="orderMethod"
                  class="custom-control-input"
                  :value="false"
                  v-model="delivery"
                />
                <label class="custom-control-label" for="pickup">Pickup</label>
              </div>
            </div>
            <div v-if="delivery" class="row">
              <div class="col-md-6">
                <div class="bg-white card addresses-item mb-4 border border-success">
                  <div class="gold-members p-4">
                    <div class="media">
                      <div class="mr-3"><i class="icofont-ui-home icofont-3x"></i></div>
                      <div class="media-body">
                        <h6 class="mb-1 text-black">Home</h6>
                        <p class="text-black mb-1">
                          {{ user.address.street }}
                        </p>
                        <p class="text-black">
                          {{ user.address.city }}, {{ user.address.state }} {{ user.address.zip_code }}
                        </p>
                        <p class="mb-0 text-black font-weight-bold">
                          <a class="btn btn-sm btn-success mr-2" href="#">DELIVER HERE</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="col-md-6">
                <div class="bg-white card addresses-item mb-4 border border-success">
                  <div class="gold-members p-4">
                    <div class="media">
                      <div class="mr-3"><i class="icofont-food-cart icofont-3x"></i></div>
                      <div class="media-body">
                        <h6 class="mb-1 text-black">Pick up at:</h6>
                        <p class="text-black mb-1">
                          {{ chef.address.street }}
                        </p>
                        <p class="text-black mb-1">
                          {{ chef.address.city }}, {{ chef.address.state }} {{ chef.address.zip_code }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="generator-bg rounded shadow-sm mb-4 p-4 osahan-cart-item">
            <div class="d-flex mb-4 osahan-cart-item-profile">
              <img class="img-fluid mr-3 rounded-pill" alt="osahan" :src="chef.image_url" />
              <div class="d-flex flex-column">
                <h6 class="mb-1 text-white">{{ chef.first_name }} {{ chef.last_name }}</h6>
                <p class="mb-0 text-white">
                  <i class="icofont-location-pin"></i>
                  {{ chef.address.city }}, {{ chef.address.state }}
                </p>
              </div>
            </div>
            <div class="bg-white rounded shadow-sm mb-2">
              <div v-for="cartedDish in cartedDishes" :key="cartedDish.id" class="gold-members p-2 border-bottom">
                <p class="text-gray mb-0 float-right ml-2">{{ cartedDish.subtotal | currency }}</p>
                <span class="count-number float-right">
                  <button
                    v-on:click="updateQuantity(cartedDish, 'subtract')"
                    class="btn btn-outline-secondary btn-sm left dec"
                  >
                    <i class="icofont-minus"></i>
                  </button>
                  <input class="count-number-input" type="text" :value="cartedDish.quantity" readonly="" />
                  <button
                    v-on:click="updateQuantity(cartedDish, 'add')"
                    class="btn btn-outline-secondary btn-sm right inc"
                  >
                    <i class="icofont-plus"></i>
                  </button>
                </span>
                <div class="media">
                  <div class="mr-2"><i class="icofont-ui-press text-success food-item"></i></div>
                  <div class="media-body">
                    <p class="mt-1 mb-0 text-black">{{ cartedDish.dish.name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-2 bg-white rounded p-2 clearfix">
              <p class="mb-1">
                Subtotal
                <span class="float-right text-dark">
                  {{ subtotal | currency }}
                </span>
              </p>
              <p class="mb-1">
                Tax (9%)
                <span class="float-right text-dark">
                  {{ tax | currency }}
                </span>
              </p>
              <hr />
              <h6 class="font-weight-bold mb-0">
                TOTAL
                <span class="float-right">{{ total | currency }}</span>
              </h6>
            </div>
            <button v-on:click="stripeCheckout()" class="btn btn-success btn-block btn-lg">
              PAY {{ total | currency }}
              <i class="icofont-long-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-md-12 text-center pt-5 pb-5">
          <h1 class="mt-2 mb-2">Nothing in your shopping cart</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global Stripe */
import axios from "axios";
import moment from "moment";

export default {
  data: function() {
    return {
      currentUser: {},
      chef: {},
      delivery: false,
      cartedDishes: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      hours: [],
      day: localStorage.getItem("orderDay"),
      date: localStorage.getItem("orderDate"),
      chosenTime: "",
    };
  },
  created: function() {
    axios.get("/api/carted_dishes").then(response => {
      this.cartedDishes = response.data.cart;
      this.chef = response.data.chef;

      if (this.cartedDishes) {
        this.updateCosts();
        this.populatePreorderHours();
      }
    });

    axios.get(`/api/users/${this.$parent.getUserId()}`).then(response => {
      this.user = response.data;
    });
  },
  methods: {
    stripeCheckout: function() {
      var params = {
        subtotal: this.subtotal,
        delivery: this.delivery,
        ready_time: `${this.date} ${this.chosenTime}`,
        chef_name: this.chef.first_name,
        total: this.total,
      };

      var stripe = Stripe(
        "pk_test_51IW3JgE4aVL7z9ZuNPpzqd0dqW3bdRkLALJ0tvRSPIDKWB7U94LrO7W71uuPs9q47AAaU1e0McPLH19Ua53rX24X00igNTa3Jk"
      );

      fetch("http://localhost:3000/api/stripe-checkout", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(params),
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(session) {
          return stripe.redirectToCheckout({ sessionId: session.stripe_id });
        })
        .then(function(result) {
          if (result.error) {
            alert(result.error.message);
          }
        })
        .catch(function(error) {
          console.error("Error:", error);
        });
    },
    updateTime: function(hour) {
      this.chosenTime = hour;
    },
    populatePreorderHours: function() {
      var today = this.chef.preorder_hours.find(preorder_hour => {
        return preorder_hour.day_of_week === this.day;
      });
      var open = moment(today.open);
      var close = moment(today.close);
      var timeRange = moment.duration(open.diff(close));
      var index = 0;
      var totalNumHours = Math.abs(timeRange._data.hours);

      while (index < totalNumHours) {
        var nextHour = moment(today.open.replace("Z", ""))
          .add(index, "hours")
          .format("h:mmA");
        this.hours.push(nextHour);
        index++;
      }

      this.chosenTime = this.hours[0];
    },
    updateCosts: function() {
      this.subtotal = 0;
      this.cartedDishes.forEach(cartedDish => {
        this.subtotal += parseFloat(cartedDish.subtotal);
      });
      this.tax = this.subtotal * 0.09;
      this.total = this.tax + this.subtotal;
    },
    updateCartNumber: function() {
      this.$parent.cartNumber = 0;
      this.cartedDishes.forEach(dish => {
        this.$parent.cartNumber += dish.quantity;
      });
    },
    updateQuantity: function(dish, operator) {
      var params = {
        quantity: operator === "add" ? dish.quantity + 1 : dish.quantity - 1,
      };

      axios.patch(`api/carted_dishes/${dish.id}`, params).then(response => {
        var newQuantity = response.data.quantity;
        var index = this.cartedDishes.indexOf(dish);

        if (newQuantity === 0) {
          axios
            .delete(`/api/carted_dishes/${dish.id}`)
            .then(response => {
              console.log(response.data);
              this.cartedDishes.splice(index, 1);
              this.updateCartNumber();
              this.updateCosts();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          var newSubtotal = response.data.subtotal;
          this.cartedDishes[index].subtotal = newSubtotal;
          this.cartedDishes[index].quantity = newQuantity;

          this.updateCartNumber();
          this.updateCosts();
        }
      });
    },
  },
};
</script>
