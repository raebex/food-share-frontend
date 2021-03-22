<template>
  <div class="carted-dishes-index">
    <h1>Cart</h1>
    <div v-if="cartedDishes">
      <p>
        Order from chef:
        <router-link :to="`/users/${chef.id}`">
          {{ chef.first_name }}
        </router-link>
      </p>
      <ul v-if="cartedDishes.length">
        <li v-for="cartedDish in cartedDishes" :key="cartedDish.id">
          <h3>{{ cartedDish.dish.name }}</h3>
          <img :src="cartedDish.dish.image_url" :alt="cartedDish.dish.name" />
          <p>Quantity</p>
          <div>
            <button v-on:click="updateQuantity(cartedDish, 'subtract')">-</button>
            {{ cartedDish.quantity }}
            <button v-on:click="updateQuantity(cartedDish, 'add')">+</button>
          </div>
          <p>{{ cartedDish.subtotal | currency }}</p>
        </li>
      </ul>
      <p>Order for: {{ day }}, {{ date }}</p>
      <p>Choose time:</p>
      <select v-model="chosenTime">
        <option v-for="hour in hours" :key="hour">{{ hour }}</option>
      </select>
      <br />
      <input type="radio" id="delivery" value="Delivery" v-model="delivery" />
      <label for="delivery">Delivery</label>
      <br />
      <input type="radio" id="pickup" value="pickup" v-model="delivery" />
      <label for="pickup">Pickup</label>

      <p>Subtotal: {{ subtotal | currency }}</p>
      <p>Tax (9%): {{ tax | currency }}</p>
      <p>Total: {{ total | currency }}</p>
      <button id="checkout-button" v-on:click="stripeCheckout()">Checkout</button>
    </div>

    <div v-else>Nothing in your shopping cart</div>
  </div>
</template>

<script>
/* global Stripe */
import axios from "axios";
import moment from "moment";

export default {
  data: function() {
    return {
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
        var nextHour = moment(today.open)
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
              this.updateCosts();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          var newSubtotal = response.data.subtotal;
          this.cartedDishes[index].subtotal = newSubtotal;
          this.cartedDishes[index].quantity = newQuantity;

          this.updateCosts();
        }
      });
    },
  },
};
</script>
