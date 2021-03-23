<template>
  <div class="chefs">
    <section class="section pt-5 pb-5 products-listing">
      <div class="container">
        <div class="row d-none-m">
          <div class="col-md-12">
            <div class="dropdown float-right">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">Choose preorder day:</label>
                </div>
                <select class="custom-select" id="inputGroupSelect01" v-on:change="setOrderDay" v-model="preorderDay">
                  <option v-for="day in preorderDays" :key="day.date" :value="day.day">
                    {{ day.day }} {{ day.date }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <div class="filters shadow-sm rounded bg-white mb-4">
              <div class="filters-header border-bottom pl-4 pr-4 pt-3 pb-3">
                <h5 class="m-0">Filter By</h5>
              </div>
              <div class="filters-body">
                <div id="accordion">
                  <div class="filters-card border-bottom p-4">
                    <div class="filters-card-header" id="headingTwo">
                      <h6 class="mb-0">
                        <a
                          href="#"
                          class="btn-link"
                          data-toggle="collapse"
                          data-target="#collapsetwo"
                          aria-expanded="true"
                          aria-controls="collapsetwo"
                        >
                          All cuisines
                          <i class="icofont-arrow-down float-right"></i>
                        </a>
                      </h6>
                    </div>
                    <div id="collapsetwo" class="collapse show" aria-labelledby="headingTwo" data-parent="#accordion">
                      <div class="filters-card-body card-shop-filters">
                        <form class="filters-search mb-3">
                          <div class="form-group">
                            <i class="icofont-search"></i>
                            <!-- <input
                              type="search"
                              id="form1"
                              class="form-control form-control-lg"
                              placeholder="Search by cuisine"
                              list="cuisineList"
                              v-model="cuisineFilter"
                            /> -->
                            <!-- <input
                              type="text"
                              class="form-control"
                              v-model="cuisineFilter"
                              placeholder="Start typing to search..."
                            /> -->
                          </div>
                        </form>
                        <div v-for="cuisine in cuisines" :key="cuisine.id" class="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            :value="cuisine.name"
                            class="custom-control-input"
                            :id="cuisine.name"
                            v-model="cuisineFilter"
                          />
                          <label class="custom-control-label" :for="cuisine.name">
                            {{ cuisine.name }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-9">
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
