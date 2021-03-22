<template>
  <div class="order-success">
    <section class="section pt-5 pb-5 osahan-not-found-page">
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center pt-5 pb-5">
            <img class="img-fluid mb-5" src="/img/thanks.png" alt="404">
            <h1 class="mt-2 mb-2 text-success">Congratulations {{ order.patron.first_name }}!</h1>
            <p class="mb-5">You have successfully placed your order from Chef {{ order.chef.first_name }}</p>
            <router-link class="btn btn-primary btn-lg" :to="`/orders/${order.id}`">View Order</router-link>
          </div>
        </div>
      </div>
    </section>
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
    axios.get(`/api/orders/${this.$route.query.order_id}`).then(response => {
      this.order = response.data;
    });
  },
};
</script>
