<template>
  <div class="order-show">
    <h1>Order #{{ order.id }}</h1>
    <p>Subtotal: {{ order.subtotal }}</p>
    <p>Tax: {{ order.tax }}</p>
    <p>Total: {{ order.total }}</p>
    <p>Delivery: {{ order.delivery }}</p>
    <p>Status: {{ order.status }}</p>
    <p>Placed: {{ order.created_at }}</p>
    <p>Ready Time: {{ order.ready_time }}</p>
    <p v-if="order.chef">
      Chef:
      <router-link :to="`/users/${order.chef.id}`">
        {{ order.chef.first_name }}
      </router-link>
    </p>
    <ul>
      <li v-for="dish in order.dishes" :key="dish.id">
        <h3>{{ dish.name }}</h3>
        <img :src="dish.image_url" :alt="dish.name" />
        <p>Quantity: {{ dish.quantity }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      order: {},
    };
  },
  created: function() {
    axios.get(`/api/orders/${this.$route.params.id}`).then(response => {
      this.order = response.data;
    });
  },
  methods: {},
};
</script>
