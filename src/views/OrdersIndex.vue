<template>
  <div class="orders-index">
    <ul v-for="order in orders" :key="order.id">
      <li>
        <router-link :to="`/orders/${order.id}`">
          <h3>Order # {{ order.id }}</h3>
          <p>{{ $parent.formattedDate(order.created_at) }}</p>
          <p>{{ order.total }}</p>
          <p>From Chef {{ order.chef.first_name }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      orders: [],
    };
  },
  created: function() {
    axios.get("/api/orders").then(response => {
      this.orders = response.data;
    });
  },
};
</script>
