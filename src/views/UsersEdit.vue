<template>
  <div class="users-edit">
    <form v-on:submit.prevent="update()">
      <h1>Edit Profile</h1>
      <ul>
        <li class="text-danger" v-for="error in errors" v-bind:key="error">
          {{ error }}
        </li>
      </ul>
      <div class="form-group">
        <label>First Name:</label>
        <input type="text" class="form-control" v-model="user.first_name" />
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input type="text" class="form-control" v-model="user.last_name" />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" class="form-control" v-model="user.email" />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" class="form-control" v-model="user.password" />
      </div>
      <div class="form-group">
        <label>Password confirmation:</label>
        <input type="password" class="form-control" v-model="user.password_confirmation" />
      </div>
      <div class="form-group">
        <label>Image URL:</label>
        <input type="text" class="form-control" v-model="user.image_url" />
      </div>
      <div class="form-group">
        <label>Phone number:</label>
        <input type="text" class="form-control" v-model="user.phone" />
      </div>
      <div class="form-group">
        <label>Address:</label>
        <input type="text" class="form-control" v-model="user.address" />
      </div>
      <div class="form-group">
        <label>Bio:</label>
        <textarea type="text" class="form-control" v-model="user.bio"></textarea>
      </div>
      <div class="form-group">
        <label>Chef?</label>
        <input type="checkbox" class="form-control" v-model="user.chef" />
      </div>
      <input type="submit" class="btn btn-primary" value="Save" />
    </form>

    <div v-if="user.chef">
      <h3>Cuisines</h3>
      <span v-for="cuisine in user.cuisines" :key="cuisine.name">
        {{ cuisine.name }}
        <button v-on:click="deleteCuisine(cuisine)">x</button>
      </span>
      <input
        type="search"
        class="form-control"
        placeholder="Search"
        list="cuisineList"
        v-model="newCuisine"
      />
      <datalist id="cuisineList">
        <option v-for="cuisine in cuisineOptions" :key="cuisine.id">
          {{ cuisine.name }}
        </option>
      </datalist>

      <button v-on:click="addCuisine()">Add Cuisine</button>
      <h3>Hours</h3>
      <div v-for="hour in user.preorder_hours" :key="hour.id">
        <span>{{ hour.day_of_week }}: </span>
        <span>{{ $parent.formattedTime(hour.open) }} to {{ $parent.formattedTime(hour.close) }}</span>
        <button v-on:click="deleteHour(hour)">x</button>
      </div>
      <select id="newDay">
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>

      Open Time:
      <select id="newOpen">
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>

      <button v-on:click="addHour()">Add hour</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      user: {},
      newCuisine: "",
      cuisineOptions: [],
      errors: [],
    };
  },
  created: function() {
    axios.get(`/api/users/${this.$route.params.id}`).then(response => {
      this.user = response.data;

      axios.get("/api/cuisines").then(response => {
        this.cuisineOptions = response.data.filter(cuisine => {
          console.log(cuisine);
          console.log(this.user.cuisines.indexOf(cuisine));
            return this.user.cuisines.indexOf(cuisine) < 0;
        });
      });
    });
  },
  methods: {
    update: function() {
      var params = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        password: this.user.password,
        password_confirmation: this.user.password_confirmation,
        image_url: this.user.image_url,
        phone: this.user.phone,
        address: this.user.address,
        bio: this.user.bio,
        chef: this.user.chef,
      };

      params.cuisine_ids = this.user.cuisines.map(option => option.id);
      console.log(params);

      // axios
      //   .patch(`/api/users/${this.user.id}`, params)
      //   .then(response => {
      //     console.log(response.data);
      //     this.$router.push(`/users/${this.user.id}`);
      //   })
      //   .catch(error => {
      //     this.errors = error.response.data.errors;
      //   });
    },
    addCuisine: function() {
      var newCuisineObject = {
        name: this.newCuisine,
      };

      newCuisineObject.id = this.cuisineOptions.find(option => option.name === this.newCuisine).id;

      this.user.cuisines.push(newCuisineObject);
      this.newCuisine = "";
    },
    deleteCuisine: function(cuisine) {
      var index = this.user.cuisines.indexOf(cuisine);
      this.user.cuisines.splice(index, 1);
    },
  },
};
</script>
