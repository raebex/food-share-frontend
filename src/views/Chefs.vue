<template>
  <div class="chefs">
    Search by cuisine:
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

    Order day:
    <select v-on:change="setOrderDay" v-model="preorderDay">
      <option v-for="day in preorderDays" :key="day.date" :value="day.day">{{ day.day }} {{ day.date }}</option>
    </select>

    <div class="chef" v-for="chef in filterBy(filterBy(chefs, cuisineFilter), preorderDay)" :key="chef.id">
      <div v-if="chefs.length > 0">
        <router-link :to="`/users/${chef.id}`">
          <h3>{{ chef.first_name }}</h3>
          <span v-for="cuisine in chef.cuisines" :key="cuisine.id">
            {{ cuisine.name }}
          </span>
          <img :src="chef.image_url" :alt="chef.name" />
          <img :src="chef.featured_dish.image_url" :alt="chef.featured_dish.name" />
        </router-link>
      </div>
      <div v-else>
        There are no chefs that meet your criteria.
      </div>
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
import moment from "moment";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      chefs: [],
      cuisines: [],
      cuisineFilter: "",
      preorderDays: [],
      preorderDay: localStorage.getItem("orderDay") || moment().format("dddd"),
    };
  },
  created: function() {
    this.getChefs();
    this.getCuisines();
    this.populatePreorderDays();
    this.setOrderDay();
  },
  methods: {
    setOrderDay: function() {
      localStorage.setItem("orderDay", this.preorderDay);
      localStorage.setItem(
        "orderDate",
        moment()
          .day(this.preorderDay)
          .format("MMMM D")
      );
    },
    getChefs: function() {
      axios.get("/api/users").then(response => {
        this.chefs = response.data;
      });
    },
    getCuisines: function() {
      axios.get("/api/cuisines").then(response => {
        this.cuisines = response.data;
      });
    },
    populatePreorderDays: function() {
      var index = 0;

      while (index < 7) {
        var day = {
          day: moment()
            .add(index, "days")
            .format("dddd"),
          date: moment()
            .add(index, "days")
            .format("MMMM D"),
        };
        this.preorderDays.push(day);
        index += 1;
      }
    },
  },
};
</script>
