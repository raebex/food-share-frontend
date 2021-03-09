<template>
  <div class="users-show">
    <div class="profile">
      <h1>{{ user.first_name }} {{ user.last_name }}</h1>
      <img :src="user.image_url" :alt="user.first_name" />
      <p>City</p>
      <p>{{ user.bio }}</p>
      <router-link v-if="ownProfile()" :to="`/users/${user.id}/edit`">Edit</router-link>
      <div v-if="user.chef">
        <span v-for="cuisine in user.cuisines" :key="cuisine.id">
          {{ cuisine.name }}
        </span>
        <div>
          <div v-for="hour in user.preorder_hours" :key="hour.id">
            <span>{{ hour.day_of_week }}</span>
            <span>{{ hour.open }} to {{ hour.close }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="user.chef">
      <div v-for="dish in user.dishes" :key="dish.id">
        <h4>{{ dish.name }}</h4>
        <img :src="dish.image_url" :alt="dish.name" />
        <p>{{ dish.price }}</p>
        <button v-if="ownProfile()" v-on:click="showUpdateDish(dish)">Edit</button>
        <button v-else v-on:click="showDish(dish)">More info</button>
      </div>
    </div>

    <dialog v-if="user.chef && ownProfile()">
      <form method="dialog">
        <h3>Edit Dish</h3>
        <div class="form-group">
          <label>Image URL:</label>
          <input type="text" v-model="currentDish.image_url" />
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
        <button v-on:click="updateDish(currentDish)">Save</button>
        <button>Close</button>
      </form>
    </dialog>

    <dialog v-else>
      <form method="dialog">
        <h3>{{ currentDish.name }}</h3>
        <img :src="currentDish.image_url" :alt="currentDish.name" />
        <p>{{ currentDish.price }}</p>
        <p>{{ currentDish.description }}</p>
        <p>Portion size: {{ currentDish.portion_size }}</p>
        <vue-number-input v-model="value" :min="1" inline controls></vue-number-input>
        <button>Add to Cart</button>
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
      city: "",
      currentDish: {},
      currentDishQuantity: 0,
    };
  },
  created: function() {
    axios.get(`/api/users/${this.$route.params.id}`).then(response => {
      this.user = response.data;
    });
  },
  methods: {
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
      var params = {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image_url: dish.image_url,
      };

      axios
        .patch(`/api/dishes/${dish.id}`, params)
        .then(response => {
          console.log("Dish updated.", response.data);
        })
        .catch(error => {
          console.log(error.response.data.errors);
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
        });
    },
  },
};
</script>
