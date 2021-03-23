<template>
  <div class="orders-index">
    <div class="container shadow-sm bg-white p-4 h-100 mt-4">
      <div class="tab-pane fade show active" id="orders" role="tabpanel" aria-labelledby="orders-tab">
        <h4 class="font-weight-bold mt-0 mb-4">Past Orders</h4>
        <div v-for="order in orders" :key="order.id" class="bg-white card mb-4 order-list shadow-sm">
          <div class="gold-members p-4">
            <router-link :to="`/orders/${order.id}`">
              <div class="media">
                <img class="mr-4" :src="order.isTicket ? order.patron.image_url : order.chef.image_url" alt="Generic placeholder image" />
                <div class="media-body">
                  <span class="float-right text-info">
                    Completed on {{ $parent.formattedDate(order.ready_time) }}&nbsp;
                    <i class="icofont-check-circled text-success"></i>
                  </span>
                  <h6 v-if="order.isTicket" class="mb-2 text-black">
                    Order for&nbsp;
                    {{ order.patron.first_name }} {{ order.patron.last_name }}
                  </h6>
                  <h6 v-else class="mb-2 text-black">
                    Order from Chef&nbsp;
                    {{ order.chef.first_name }}
                  </h6>
                  <p class="text-gray mb-1">
                    <i class="icofont-location-arrow"></i>
                    {{ order.chef.address.city }}, {{ order.chef.address.state }}
                  </p>
                  <p class="text-gray mb-3">
                    <i class="icofont-list"></i>
                    &nbsp;ORDER #{{ order.id }}&nbsp;
                    <i class="icofont-clock-time ml-2"></i>
                    &nbsp;{{ $parent.formattedDate(order.created_at) }}
                  </p>
                  <p class="text-dark">
                    <span v-for="(dish, index) in order.dishes" :key="index">
                      <span v-if="index != 0">,&nbsp;</span>
                      {{ dish.name }} x {{ dish.quantity }}
                    </span>
                  </p>
                  <hr />
                  <p class="mb-0 text-black text-primary pt-2">
                    <span class="text-black font-weight-bold">
                      &nbsp;Total Paid:
                    </span>
                    &nbsp;{{ order.total | currency }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
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
      this.orders.forEach(order => {
        if (this.$parent.getUserId() == order.chef.id) {
          order.isTicket = true;
        }
      });
    });
  },
};
</script>
