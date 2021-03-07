<template>
  <div class="chefs">
    <input
      type="search"
      id="form1"
      class="form-control"
      placeholder="Search"
      list="cuisineList"
      v-model="cuisineFilter"
    />
    <datalist id="cuisineList">
      <option v-for="cuisine in cuisines" :key="cuisine.id">{{ cuisine.name }}</option>
    </datalist>

    <div class="chef" v-for="chef in filterBy(chefs, cuisineFilter)" :key="chef.id">
      <h3>{{ chef.first_name }}</h3>
      <span v-for="cuisine in chef.cuisines" :key="cuisine.id">
        {{ cuisine.name }}
      </span>
      <img :src="chef.image_url" :alt="chef.name" />
      <img :src="chef.featured_dish.image_url" :alt="chef.featured_dish.name" />
    </div>
  </div>
</template>

<style scoped>
.chef {
  border: 1px solid #333;
  margin-bottom: 20px;
}
</style>

<script>
import axios from "axios";
import Vue2Filters from "vue2-filters";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      chefs: [],
      cuisines: [],
      cuisineFilter: "",
    };
  },
  created: function() {
    axios.get("/api/users").then(response => {
      this.chefs = response.data;
    });

    axios.get("/api/cuisines").then(response => {
      this.cuisines = response.data;
    });
  },
};
</script>
