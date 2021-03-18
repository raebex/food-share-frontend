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

      <div>
        Image: <input type="file" v-on:change="setFile($event)" ref="fileInput" />
      </div>

      <div class="form-group">
        <label>Phone number:</label>
        <input type="text" class="form-control" v-model="user.phone" />
      </div>
      <div class="form-group">
        <label>Bio:</label>
        <textarea type="text" class="form-control" v-model="user.bio"></textarea>
      </div>
      <div class="form-group">
        <label>Chef?</label>
        <input type="checkbox" class="form-control" v-model="user.chef" />
      </div>

      <h3>Address:</h3>
      <div class="form-group">
        <label>Street:</label>
        <input type="text" class="form-control" v-model="user.address.street" />
      </div>
      <div class="form-group">
        <label>City:</label>
        <input type="text" class="form-control" v-model="user.address.city" />
      </div>
      <div class="form-group">
        <label>State:</label>
        <input type="text" class="form-control" v-model="user.address.state" />
      </div>
      <div class="form-group">
        <label>Zip Code:</label>
        <input type="text" class="form-control" v-model="user.address.zip_code" />
      </div>

      <div v-if="user.chef">
        <h3>Cuisines</h3>
        <li v-for="cuisine in cuisines" :key="cuisine.name">
          <input type="checkbox" :id="cuisine.name" :value="cuisine.id" v-model="selectedCuisineIds" />
          <label :for="cuisine.name">{{ cuisine.name }}</label>
        </li>
      </div>
      <input type="submit" class="btn btn-primary" value="Save" />
      <button v-on:click="destroyProfile()">Delete Profile</button>
    </form>

    <div v-if="user.chef">
      <h3>Hours</h3>
      <div v-for="hour in user.preorder_hours" :key="hour.id">
        <span>{{ hour.day_of_week }}:</span>
        <span>{{ $parent.formattedTime(hour.open) }} to {{ $parent.formattedTime(hour.close) }}</span>
        <button v-on:click="deletePreorderHour(hour)">x</button>
      </div>

      Day:
      <select v-model="newDay">
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>

      Open Time:
      <select v-model="newOpen">
        <option v-for="time in timeOptions" :key="time">{{ time }}</option>
      </select>

      Close Time:
      <select v-model="newClose">
        <option v-for="time in timeOptions" :key="time">{{ time }}</option>
      </select>

      <button v-on:click="addPreorderHour()">Add hour</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      user: {},
      selectedCuisineIds: [],
      cuisines: [],
      timeOptions: [],
      errors: [],
      newDay: "Monday",
      newOpen: "9:00AM",
      newClose: "11:00PM",
    };
  },
  created: function() {
    axios.get(`/api/users/${this.$route.params.id}`).then(response => {
      this.user = response.data;

      if (this.user.chef) {
        this.selectedCuisineIds = this.user.cuisines.map(cuisine => cuisine.id);
      }
    });

    this.getCuisines();
    this.createTimeOptions();
  },
  methods: {
    setFile: function(event) {
      if (event.target.files.length > 0) {
        this.user.image_url = event.target.files[0];
      }
    },
    createTimeOptions: function() {
      var index = 1;

      while (index <= 24) {
        var time = index + ":00";

        if (index < 12) {
          time += "AM";
        } else if (index === 12) {
          time += "PM";
        } else if (index === 24) {
          time = "12:00AM";
        } else if (index > 12) {
          time = `${index - 12}:00PM`;
        }
        this.timeOptions.push(time);
        index++;
      }
    },
    getCuisines: function() {
      axios.get("/api/cuisines").then(response => {
        this.cuisines = response.data;
      });
    },
    update: function() {
      var formData = new FormData();
      formData.append("first_name", this.user.first_name);
      formData.append("last_name", this.user.last_name);
      formData.append("image_url", this.user.image_url);
      formData.append("email", this.user.email);

      if (this.user.password) {
        formData.append("password", this.user.password);
        formData.append("password_confirmation", this.user.password_confirmation);
      }

      formData.append("phone", this.user.phone);
      formData.append("street", this.user.address.street);
      formData.append("city", this.user.address.city);
      formData.append("state", this.user.address.state);
      formData.append("zip_code", this.user.address.zip_code);
      formData.append("bio", this.user.bio);
      formData.append("chef", this.user.chef);

      for (var i = 0; i < this.selectedCuisineIds.length; i++) {
        formData.append("cuisine_ids[]", this.selectedCuisineIds[i]);
      }

      axios
        .patch(`/api/users/${this.user.id}`, formData)
        .then(response => {
          console.log(response.data);
          this.$router.push(`/users/${this.user.id}`);
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    addPreorderHour: function() {
      var params = {
        day_of_week: this.newDay,
        open: this.newOpen,
        close: this.newClose,
      };

      axios
        .post("/api/preorder_hours", params)
        .then(response => {
          this.user.preorder_hours.push(response.data);
        })
        .catch(error => {
          console.log(error.response.data.errors);
        });
    },
    deletePreorderHour: function(hour) {
      axios
        .delete(`/api/preorder_hours/${hour.id}`)
        .then(response => {
          console.log(response.data);
          var index = this.user.preorder_hours.indexOf(hour);
          this.user.preorder_hours.splice(index, 1);
        })
        .catch(error => {
          console.log(error);
        });
    },
    destroyProfile: function() {
      if (confirm("Are you sure you want to delete your profile?")) {
        axios
          .delete(`/api/users/${this.user.id}`)
          .then(response => {
            console.log(response.data);
            this.$router.push("/login");
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("jwt");
            localStorage.removeItem("user_id");
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  },
};
</script>
