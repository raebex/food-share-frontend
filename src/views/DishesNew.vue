<template>
  <div class="dishes-new">
    <div class="container">
      <div class="row mt-4 mb-5">
        <div class="col-md-6 mx-auto mb-5">
          <form v-on:submit.prevent="createDish()">
            <h3>Create a new dish</h3>
            <ul>
              <li class="text-danger" v-for="error in errors" v-bind:key="error">
                {{ error }}
              </li>
            </ul>
            <div class="form-group">
              <label>Name:</label>
              <input type="text" class="form-control" v-model="name" />
            </div>
            <div class="form-group">
              <label>Price:</label>
              <input type="text" class="form-control" v-model="price" />
            </div>
            <div class="form-group">
              <label>Portion size:</label>
              <input type="text" class="form-control" v-model="portionSize" />
            </div>
            <div class="form-group mt-3 mb-4">
              <label for="inputImage">Image:</label>
              <br />
              <input id="inputImage" type="file" v-on:change="setFile($event)" ref="fileInput" />
            </div>
            <div class="form-group">
              <label>Description:</label>
              <textarea type="text" class="form-control" v-model="description"></textarea>
            </div>
            <div class="custom-control custom-checkbox mb-5">
              <input type="checkbox" id="inputFeatured" class="custom-control-input" v-model="featured" />
              <label class="custom-control-label" for="inputFeatured">Featured dish</label>
            </div>

            <input type="submit" class="btn btn-primary btn-lg mr-4" value="Create" />
          </form>
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
          this.$router.push(`/users/${this.$parent.getUserId()}`);
        })
        .catch(error => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>
