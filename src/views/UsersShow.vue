<template>
  <div class="users-show" v-if="Object.keys(user).length">
    <section class="restaurant-detailed-banner">
      <div class="text-center">
        <img class="img-fluid cover" src="/img/mall-dedicated-banner.png" />
      </div>
      <div class="restaurant-detailed-header">
        <div class="container">
          <div class="row d-flex align-items-center">
            <div class="col-sm-12 col-md-8">
              <div class="restaurant-detailed-header-left">
                <img class="img-fluid mr-3 float-left" alt="osahan" :src="user.image_url" />
                <h2 class="text-white">{{ user.first_name }} {{ user.last_name }}</h2>
                <p class="text-white mb-1">
                  <i class="icofont-location-pin"></i>
                  {{ user.address.city }}, {{ user.address.state }}
                </p>
                <p v-if="user.chef" class="text-white mb-0">
                  <i class="icofont-food-cart"></i>
                  <span v-for="(cuisine, index) in user.cuisines" :key="index">
                    <span v-if="index != 0">,&nbsp;</span>
                    {{ cuisine.name }}
                  </span>
                </p>
              </div>
            </div>
            <div class="col-sm-12 col-md-4">
              <router-link class="float-right" v-if="ownProfile()" :to="`/users/${user.id}/edit`">
                <button class="btn btn-primary">Edit Profile</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-2 pb-2 mt-4 mb-4">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <div class="m-2 pr-4">
              <div v-if="user.chef">
                <h6>Hours</h6>
                <p v-for="hour in user.preorder_hours" :key="hour.id" class="mb-1 clearfix">
                  <span class="float-left">{{ hour.day_of_week }}:&nbsp;</span>
                  <span class="float-right">
                    {{ $parent.formattedTime(hour.open) }} - {{ $parent.formattedTime(hour.close) }}
                  </span>
                </p>
                <hr />
              </div>
              <h6>About</h6>
              <p>{{ user.bio }}</p>
            </div>
          </div>
          <div class="col-md-9">
            <div v-if="user.chef">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Dishes</h3>
                <router-link v-if="ownProfile()" to="/dishes/new">
                  <button class="btn btn-outline-primary">+ New Dish</button>
                </router-link>
              </div>
              <div class="row">
                <div v-for="dish in user.dishes" :key="dish.id" class="col-md-4 col-sm-6 mb-4">
                  <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                    <div class="list-card-image">
                      <img :src="dish.image_url" class="img-fluid item-img" />
                    </div>
                    <div class="p-3 position-relative">
                      <div class="list-card-body">
                        <h6 class="mb-4">{{ dish.name }}</h6>
                        <p class="text-gray time mb-0">
                          {{ dish.price | currency }}
                          <span class="float-right mb-3">
                            <button
                              class="btn btn-outline-secondary btn-sm"
                              v-if="ownProfile()"
                              data-toggle="modal"
                              data-target="#dishEditModal"
                              v-on:click="showDish(dish)"
                            >
                              Edit
                            </button>
                            <button
                              v-else
                              class="btn btn-outline-secondary btn-sm"
                              data-toggle="modal"
                              data-target="#dishShowModal"
                              v-on:click="showDish(dish)"
                            >
                              More info
                            </button>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <h3 class="mb-4">Past Orders</h3>
              <div v-for="order in orders" :key="order.id" class="bg-white card mb-4 order-list shadow-sm">
                <div class="gold-members p-4">
                  <router-link :to="`/orders/${order.id}`">
                    <div class="media">
                      <img class="mr-4" :src="order.chef.image_url" alt="Generic placeholder image" />
                      <div class="media-body">
                        <span class="float-right text-info">
                          Completed on {{ $parent.formattedDate(order.ready_time) }}&nbsp;
                          <i class="icofont-check-circled text-success"></i>
                        </span>
                        <h6 class="mb-2 text-black">
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
      </div>
    </section>

    <div v-if="user.chef && ownProfile()">
      <div
        class="modal fade"
        id="dishEditModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="dishEditModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="dishEditModalLabel">Edit Dish</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <ul>
                <li class="text-danger" v-for="error in errors" v-bind:key="error">
                  {{ error }}
                </li>
              </ul>
              <img class="img-fluid mb-4" :src="currentDish.image_url" alt="" />
              <form v-on:submit.prevent="updateDish(currentDish)">
                <div class="form-group">
                  <label for="inputImage">Image:</label>
                  <br />
                  <input id="inputImage" type="file" v-on:change="setFile($event)" ref="fileInput" />
                </div>
                <div class="form-group">
                  <label for="inputName">Name:</label>
                  <input class="form-control" id="inputName" type="text" v-model="currentDish.name" />
                </div>
                <div class="form-group">
                  <label>Price:</label>
                  <input class="form-control" id="inputPrice" type="text" v-model="currentDish.price" />
                </div>
                <div class="form-group">
                  <label for="inputDescription">Description:</label>
                  <textarea id="inputDescription" class="form-control" v-model="currentDish.description"></textarea>
                </div>
                <div class="form-group">
                  <label for="inputPortion">Portion Size:</label>
                  <input id="inputPortion" class="form-control" type="text" v-model="currentDish.portion_size" />
                </div>
                <div class="custom-control custom-checkbox mb-5">
                  <input id="inputFeatured" type="checkbox" class="custom-control-input" v-model="currentDish.featured" />
                  <label class="custom-control-label" for="inputFeatured">Featured</label>
                </div>
                <button type="button" class="btn btn-secondary mr-2" data-dismiss="modal">Close</button>
                <input type="submit" class="btn btn-primary  mr-2" value="Save" />
                <button class="btn btn-outline-primary" v-on:click="destroyDish(currentDish)">Delete</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div
        class="modal fade"
        id="dishShowModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="dishShowModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="dishShowModalLabel">{{ currentDish.name }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <img class="img-fluid mb-4" :src="currentDish.image_url" :alt="currentDish.name" />
              <h6>{{ currentDish.price | currency }}</h6>
              <p>{{ currentDish.description }}</p>
              <p>Portion size: {{ currentDish.portion_size }}</p>
              <p>Quantity:</p>
              <span class="count-number">
                <button v-on:click="currentDishQuantity--" class="btn btn-outline-secondary btn-sm left dec">
                  <i class="icofont-minus"></i>
                </button>
                <input class="count-number-input" type="text" :value="currentDishQuantity" />
                <button v-on:click="currentDishQuantity++" class="btn btn-outline-secondary btn-sm right inc">
                  <i class="icofont-plus"></i>
                </button>
              </span>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button class="btn btn-primary" v-if="$parent.isLoggedIn()" v-on:click="addToCart(currentDish)">
                Add to Cart
              </button>
              <button class="btn btn-primary" v-else>
                <router-link to="/login">Add to Cart</router-link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import axios from "axios";

export default {
  data: function() {
    return {
      user: {},
      currentDish: {},
      currentDishQuantity: 1,
      errors: [],
      newImage: "",
      orders: [],
    };
  },
  created: function() {
    axios.get(`/api/users/${this.$route.params.id}`).then(response => {
      this.user = response.data;

      if (!this.user.chef) {
        axios.get("/api/orders").then(response => {
          this.orders = response.data;
        });
      }
    });
  },
  methods: {
    setFile: function(event) {
      if (event.target.files.length > 0) {
        this.newImage = event.target.files[0];
      }
    },
    ownProfile: function() {
      return this.$parent.getUserId() == this.user.id;
    },
    showDish: function(dish) {
      this.currentDish = dish;
    },
    updateDish: function(dish) {
      var formData = new FormData();
      formData.append("name", dish.name);
      formData.append("description", dish.description);
      formData.append("price", dish.price);
      formData.append("image_url", this.newImage);
      formData.append("featured", dish.featured);

      axios
        .patch(`/api/dishes/${dish.id}`, formData)
        .then(response => {
          console.log("Dish updated.", response.data);
          var index = this.user.dishes.indexOf(dish);
          this.user.dishes[index].image_url = response.data.image_url;
          $("#dishEditModal").modal("hide");
        })
        .catch(error => {
          console.log(error.response.data.errors);
        });
    },
    destroyDish: function(dish) {
      axios
        .delete(`/api/dishes/${dish.id}`)
        .then(response => {
          console.log(response.data);
          var index = this.user.dishes.indexOf(dish);
          this.user.dishes.splice(index, 1);
          $("#dishEditModal").modal("hide");
        })
        .catch(error => {
          console.log(error);
        });
    },
    addToCart: function(dish) {
      var params = {
        dish_id: dish.id,
        quantity: this.currentDishQuantity,
      };

      axios
        .post("api/carted_dishes", params)
        .then(response => {
          console.log("Dish added to cart!", response.data);
          // $("#dishShowModal").modal("hide");
        })
        .catch(error => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>
