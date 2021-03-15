<template>
  <div class="order-show">
    <h1>Order #{{ order.id }}</h1>
    <p>Order placed at: {{ $parent.formattedDate(order.created_at) }}</p>
    <p>Subtotal: {{ order.subtotal }}</p>
    <p>Tax: {{ order.tax }}</p>
    <p>Total: {{ order.total }}</p>
    <p>Ready Time: {{ $parent.formattedDate(order.ready_time) }}</p>
    <p v-if="order.delivery">Delivery</p>
    <p v-else>Pick up</p>

    <div v-if="order.chef && $parent.getUserId() == order.chef.id">
      Patron:
      {{ order.patron.first_name }} {{ order.patron.last_name }}
      <p v-if="order.delivery">Deliver to: {{ order.patron.address }}</p>
      <p>Email: {{ order.patron.email }}</p>
      <p>Phone number: {{ order.patron.phone }}</p>
    </div>
    <div v-else>
      <p v-if="order.chef">
        Chef:
        <router-link :to="`/users/${order.chef.id}`">
          {{ order.chef.first_name }}
        </router-link>
      </p>
    </div>
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
