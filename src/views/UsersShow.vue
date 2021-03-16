<template>
  <div class="users-show">
    <div class="profile">
      <h1>{{ user.first_name }} {{ user.last_name }}</h1>
      <router-link v-if="ownProfile()" :to="`/users/${user.id}/edit`">Edit Profile</router-link>
      <img :src="user.image_url" :alt="user.first_name" />
      <p>City</p>
      <p>{{ user.bio }}</p>
      <div v-if="user.chef">
        <span v-for="cuisine in user.cuisines" :key="cuisine.id">
          {{ cuisine.name }}
        </span>
        <div>
          <h3>Hours</h3>
          <div v-for="hour in user.preorder_hours" :key="hour.id">
            <span>{{ hour.day_of_week }}: </span>
            <span>{{ $parent.formattedTime(hour.open) }} to {{ $parent.formattedTime(hour.close) }}</span>
          </div>
          <!-- <p>Create order for:</p>
          <select id="orderDay" v-model="selectedDay">
            <option v-for="hour in user.preorder_hours" :key="hour.id">{{ hour.day_of_week }}</option>
          </select>
          <select id="orderTime" v-model="selectedTime">
            <option>{{ selectedDay.open }}</option>
          </select> -->
        </div>
      </div>
    </div>

    <div v-if="user.chef">
      <h3>Dishes</h3>
      <router-link v-if="ownProfile()" to="/dishes/new">Create new dish</router-link>
      <div v-for="dish in user.dishes" :key="dish.id">
        <h4>{{ dish.name }}</h4>
        <img :src="dish.image_url" :alt="dish.name" />
        <p>{{ dish.price | currency }}</p>
        <button v-if="ownProfile()" v-on:click="showUpdateDish(dish)">Edit</button>
        <button v-else v-on:click="showDish(dish)">More info</button>
      </div>
    </div>

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
      city: "",
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
