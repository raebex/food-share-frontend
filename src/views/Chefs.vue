<template>
  <div class="chefs">
    <section class="section pt-5 pb-5 products-listing">
      <div class="container">
        <div class="owl-carousel owl-carousel-category owl-theme list-cate-page mb-4 d-flex">
          <div v-for="cuisine in cuisines" :key="cuisine.id" class="item">
            <div class="osahan-category-item">
              <a href="#">
                <img class="img-fluid" src="img/list/1.png" alt="" />
                <h6>{{ cuisine.name }}</h6>
              </a>
            </div>
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-md-7">
            <h3 class="mb-2 font-weight-normal">
              <span class="font-weight-bold">Local Favorites</span>
              in Chicago
            </h3>
          </div>
          <div class="col-md-5">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Choose order day:</label>
              </div>
              <select class="custom-select" id="inputGroupSelect01" v-on:change="setOrderDay" v-model="preorderDay">
                <option v-for="day in preorderDays" :key="day.date" :value="day.day">
                  {{ day.day }} {{ day.date }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <div
            v-for="chef in filterBy(filterBy(chefs, cuisineFilter), preorderDay)"
            :key="chef.id"
            class="col-md-4 col-sm-6 mb-4 pb-2"
          >
            <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
              <router-link :to="`/users/${chef.id}`">
                <div class="list-card-image">
                  <img :src="chef.featured_dish.image_url" class="img-fluid item-img" />
                </div>
                <div class="p-3 position-relative">
                  <div class="list-card-body d-flex align-items-start">
                    <img :src="chef.image_url" class="nav-osahan-pic rounded-pill mt-1" />
                    <div>
                      <h6 class="mb-1">
                        <span class="text-black">
                          {{ chef.first_name }}
                        </span>
                      </h6>
                      <p class="text-gray">
                        <span v-for="(cuisine, index) in chef.cuisines" :key="cuisine.id">
                          <span v-if="index != 0">&nbsp;•&nbsp;</span>
                          {{ cuisine.name }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <input
      type="search"
      id="form1"
      class="form-control form-control-lg"
      placeholder="Search by cuisine"
      list="cuisineList"
      v-model="cuisineFilter"
    />

    <datalist id="cuisineList">
      <option v-for="cuisine in cuisines" :key="cuisine.id">{{ cuisine.name }}</option>
    </datalist> -->
  </div>
</template>

<style scoped>
.item {
  width: 100px;
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
