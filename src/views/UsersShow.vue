<template>
  <div class="users-show" v-if="Object.keys(user).length">
    <section class="restaurant-detailed-banner">
      <div class="text-center">
        <img class="img-fluid cover" src="/img/mall-dedicated-banner.png" />
      </div>
      <div class="restaurant-detailed-header">
        <div class="container">
          <div class="row d-flex align-items-center">
            <div class="col-md-8">
              <div class="restaurant-detailed-header-left">
                <img class="img-fluid mr-3 float-left" alt="osahan" :src="user.image_url" />
                <h2 class="text-white">{{ user.first_name }} {{ user.last_name }}</h2>
                <p class="text-white mb-1"><i class="icofont-location-pin"></i>
                  {{ user.address.city }}, {{ user.address.state }}
                </p>
                <p v-if="user.chef" class="text-white mb-0"><i class="icofont-food-cart"></i>
                  <span v-for="(cuisine, index) in user.cuisines" :key="cuisine.id">
                    <span v-if="index != 0">, </span>
                    {{ cuisine.name }}
                  </span>
                </p>
              </div>
            </div>
            <div class="col-md-4">
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
                    <span class="float-left">{{ hour.day_of_week }}: </span>
                    <span class="float-right">{{ $parent.formattedTime(hour.open) }} - {{ $parent.formattedTime(hour.close) }}</span>
                  </p>
                </div>
                <hr />
                <h6>About</h6>
                <p>{{ user.bio }}</p>
            </div>
          </div>
          <div class="col-md-9">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3>Dishes</h3>
              <router-link v-if="ownProfile()" to="/dishes/new">
                <button class="btn btn-outline-primary">+ New Dish</button>
              </router-link>
            </div>
            <div v-if="user.chef" class="row">
              <div v-for="dish in user.dishes" :key="dish.id" class="col-md-4 col-sm-6 mb-4">
                <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                  <div class="list-card-image">
                    <a href="#">
                      <img :src="dish.image_url" class="img-fluid item-img" />
                    </a>
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
                            v-on:click="showUpdateDish(dish)"
                          >
                            Edit
                          </button>
                          <button class="btn btn-outline-secondary btn-sm" v-else v-on:click="showDish(dish)">
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
        </div>
      </div>
    </section>

    <dialog v-if="user.chef && ownProfile()">
      <form method="dialog">
        <h3>Edit Dish</h3>
        <ul>
          <li class="text-danger" v-for="error in errors" v-bind:key="error">
            {{ error }}
          </li>
        </ul>
        <img :src="currentDish.image_url" alt="" />
        <div>
          Image: <input type="file" v-on:change="setFile($event)" ref="fileInput" />
        </div>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" v-model="currentDish.name" />
        </div>
        <div class="form-group">
          <label>Price:</label>
          <input type="text" v-model="currentDish.price" />
        </div>
        <div class="form-group">
          <label>Description:</label>
          <textarea v-model="currentDish.description"></textarea>
        </div>
        <div class="form-group">
          <label>Portion Size:</label>
          <input type="text" v-model="currentDish.portion_size" />
        </div>
        <div class="form-group">
          <label>Featured</label>
          <input type="checkbox" class="form-control" v-model="currentDish.featured" />
        </div>
        <button v-on:click="updateDish(currentDish)">Save</button>
        <button v-on:click="destroyDish(currentDish)">Delete</button>
        <button>Close</button>
      </form>
    </dialog>

    <dialog v-else>
      <form method="dialog">
        <h3>{{ currentDish.name }}</h3>
        <img :src="currentDish.image_url" :alt="currentDish.name" />
        <p>{{ currentDish.price | currency }}</p>
        <p>{{ currentDish.description }}</p>
        <p>Portion size: {{ currentDish.portion_size }}</p>
        <p>Quantity:</p>
        <input type="number" v-model="currentDishQuantity" :min="1" inline controls />
        <button v-if="$parent.isLoggedIn()" v-on:click="addToCart(currentDish)">Add to Cart</button>
        <button v-else>
          <router-link to="/login">Add to Cart</router-link>
        </button>
        <button>Close</button>
      </form>
    </dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      user: {},
      currentDish: {},
      currentDishQuantity: 1,
      errors: [],
      newImage: "",
    };
  },
  created: function() {
    axios.get(`/api/users/${this.$route.params.id}`).then(response => {
      this.user = response.data;
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
      document.querySelector("dialog").showModal();
    },
    showUpdateDish: function(dish) {
      this.currentDish = dish;
      document.querySelector("dialog").showModal();
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
        })
        .catch(error => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>
