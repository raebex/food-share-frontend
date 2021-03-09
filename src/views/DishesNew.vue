<template>
  <div class="dishes-new">
    <h1>Create a new dish</h1>
    <form v-on:submit.prevent="createDish()">
      <ul>
        <li class="text-danger" v-for="error in errors" v-bind:key="error">
          {{ error }}
        </li>
      </ul>
      <div class="form-group">
        <label>Image URL:</label>
        <input type="text" v-model="imageUrl" />
      </div>
      <div class="form-group">
        <label>Name:</label>
        <input type="text" v-model="name" />
      </div>
      <div class="form-group">
        <label>Price:</label>
        <input type="text" v-model="price" />
      </div>
      <div class="form-group">
        <label>Description:</label>
        <textarea v-model="description"></textarea>
      </div>
      <div class="form-group">
        <label>Portion Size:</label>
        <input type="text" v-model="portionSize" />
      </div>
      <div class="form-group">
        <label>Featured</label>
        <input type="checkbox" class="form-control" v-model="featured" />
      </div>
      <input type="submit" class="btn btn-primary" value="Create" />
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      name: "",
      imageUrl: "",
      price: "",
      description: "",
      portionSize: "",
      featured: false,
      errors: [],
    };
  },
  methods: {
    createDish: function() {
      var params = {
        name: this.name,
        image_url: this.imageUrl,
        price: this.price,
        description: this.description,
        portion_size: this.portionSize,
        featured: this.featured,
      };

      axios
        .post("/api/dishes", params)
        .then(response => {
          console.log(response.data);
          this.$router.push("/");
        })
        .catch(error => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>
