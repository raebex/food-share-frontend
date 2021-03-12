<template>
  <div class="carted-dishes-index">
    <h1>Cart</h1>
    <div v-if="cartedDishes.length">
      <p>
        Order from chef:
        <router-link :to="`/users/${cartedDishes[0].chef.id}`">
          {{ cartedDishes[0].chef.first_name }}
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
      <p>Subtotal: {{ subtotal | currency }}</p>
      <button>Place Order</button>
    </div>

    <div v-else>Nothing in your shopping cart</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      cartedDishes: [],
      subtotal: 0,
    };
  },
  created: function() {
    axios.get("/api/carted_dishes").then(response => {
      this.cartedDishes = response.data;
      this.updateSubtotal();
    });
  },
  methods: {
    updateSubtotal: function() {
      this.subtotal = 0;
      this.cartedDishes.forEach(cartedDish => {
        this.subtotal += parseFloat(cartedDish.subtotal);
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
              this.updateSubtotal();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          var newSubtotal = response.data.subtotal;
          this.cartedDishes[index].subtotal = newSubtotal;
          this.cartedDishes[index].quantity = newQuantity;

          this.updateSubtotal();
        }
      });
    },
  },
};
</script>
