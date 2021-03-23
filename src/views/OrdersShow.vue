<template>
  <div class="order-show">
    <section class="section pt-5 pb-5">
      <div class="container">
        <div class="row">
          <div class="col-md-8 mx-auto">
            <div class="p-5 osahan-invoice bg-white shadow-sm">
              <div v-if="!isTicket" class="row mb-5 pb-3">
                <div class="col-md-8 col-10">
                  <h3 class="mt-0">Thanks for supporting 
                    <router-link :to="`/users/${order.chef.id}`">
                      <strong class="text-secondary">Chef {{ order.chef.first_name }}</strong>
                    </router-link>, 
                    {{ order.patron.first_name }}! Here are your order details: 
                  </h3>
                </div>
              </div>
              <h1 class="mb-1 text-black">Order No: 
                <strong>{{ order.id }}</strong>
              </h1>
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1">
                    Placed at: 
                    <strong>{{ $parent.formattedDate(order.created_at) }}</strong>
                  </p>
                  <p class="mb-1">
                    Ready for: 
                    <strong>{{ $parent.formattedDate(order.ready_time) }}</strong>
                  </p>
                  <p v-if="order.delivery">Method: Delivery</p>
                  <p v-else>Order method: Pick up</p>
                </div>
                <div class="col-md-6">
                  <div v-if="isTicket">
                    <h6 class="mb-1 text-black">Patron info:</h6>
                    <p class="mb-1 text-primary">
                      <strong>
                        {{ order.patron.first_name }} 
                        {{ order.patron.last_name }}
                      </strong>
                    </p>
                    <p class="mb-1">{{ order.patron.email }}</p>
                    <p class="mb-1">{{ order.patron.phone }}</p>
                    <div v-if="order.delivery">
                      <p class="mb-1">{{ order.patron.address.street }}</p>
                      <p class="mb-1">
                        {{ order.patron.address.city }}, {{ order.patron.address.state }} {{ order.patron.address.zip_code }}
                      </p>
                    </div>
                  </div>
                  <div v-else>
                    <p class="mb-1">Ordered from:</p>
                    <router-link :to="`/users/${order.chef.id}`">
                      <h6 class="mb-1 text-black">
                        <strong>{{ order.chef.first_name }} {{ order.chef.last_name }}</strong>
                      </h6>
                    </router-link>
                    <p class="mb-1">{{ order.chef.address.city }}, {{ order.chef.address.state }}</p>
                  </div>
                </div>
              </div>
              <div class="row mt-5">
                <div class="col-md-12">
                  <table class="table mt-3 mb-0">
                    <thead class="thead-light">
                      <tr>
                        <th class="text-black font-weight-bold" scope="col">Dish Name</th>
                        <th class="text-right text-black font-weight-bold" scope="col">Quantity</th>
                        <th class="text-right text-black font-weight-bold" scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dish in order.dishes" :key="dish.id">
                        <td>{{ dish.name }}</td>
                        <td class="text-right">{{ dish.quantity }}</td>
                        <td class="text-right">
                          {{ (dish.price * dish.quantity) | currency }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right" colspan="2">Subtotal:</td>
                        <td class="text-right">{{ order.subtotal | currency }}</td>
                      </tr>
                      <tr>
                        <td class="text-right" colspan="2">Tax:</td>
                        <td class="text-right">{{ order.tax | currency }}</td>
                      </tr>
                      <tr>
                        <td class="text-right" colspan="2">
                          <h6 class="text-success">Grand Total: </h6>
                        </td>
                        <td class="text-right">
                          <h6 class="text-success">{{ order.total | currency }}</h6>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
      isTicket: false,
    };
  },
  created: function() {
    axios.get(`/api/orders/${this.$route.params.id}`).then(response => {
      this.order = response.data;
      if (this.order.chef && this.$parent.getUserId() == this.order.chef.id) {
        this.isTicket = true;
      }
    });
  }
};
</script>
