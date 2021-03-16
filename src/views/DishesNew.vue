<template>
  <div class="dishes-new">
    <h1>Create a new dish</h1>
    <form v-on:submit.prevent="createDish()">
      <ul>
        <li class="text-danger" v-for="error in errors" v-bind:key="error">
          {{ error }}
        </li>
      </ul>
      <div>
        Image: <input type="file" v-on:change="setFile($event)" ref="fileInput" />
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
    setFile: function(event) {
      if (event.target.files.length > 0) {
        this.imageUrl = event.target.files[0];
      }
    },
    createDish: function() {
      var formData = new FormData();
      formData.append("name", this.name);
      formData.append("image_url", this.imageUrl);
      formData.append("price", this.price);
      formData.append("description", this.description);
      formData.append("portion_size", this.portionSize);
      formData.append("featured", this.featured);

      axios
        .post("/api/dishes", formData)
        .then(response => {
          console.log(response.data);
          this.$router.push(`/users/${this.user.id}`);
        })
        .catch(error => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>
