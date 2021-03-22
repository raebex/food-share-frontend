<template>
  <div class="orders-create"></div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {};
  },
  created: function() {
    // axios request to create order
    var params = {
      delivery: this.$route.query.delivery,
      ready_time: this.$route.query.ready_time
    };

    axios
      .post("/api/orders", params)
      .then(response => {
        var newOrder = response.data;
        this.$router.push(`/orders/${newOrder.id}`);
      })
      .catch(error => {
        console.log(error.response.data.errors);
        this.errors = error.response.data.errors;
      });
  },
};
</script>
