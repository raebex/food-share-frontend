<template>
  <div class="chefs">
    <section class="section pt-5 pb-5 products-listing">
      <div class="container">
        <div class="row d-none-m">
          <div class="col-md-12">
            <div class="dropdown float-right">
              
              <select class="custom-select form-control-lg" v-on:change="setOrderDay" v-model="preorderDay">
                <option v-for="day in preorderDays" :key="day.date" :value="day.day">
                  {{ day.day }} {{ day.date }}
                </option>
              </select>
              Choose preorder day:
              <a
                class="btn btn-outline-info dropdown-toggle btn-sm border-white-btn"
                href="#"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {{ preorderDay }}
              </a>
              <div class="dropdown-menu dropdown-menu-right shadow-sm border-0 ">
                <a class="dropdown-item" href="#">Distance</a>
                <a class="dropdown-item" href="#">No Of Offers</a>
                <a class="dropdown-item" href="#">Rating</a>
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
                            <input type="text" class="form-control" placeholder="Start typing to search...">
                          </div>
                        </form>
                        <div class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" id="cb6">
                          <label class="custom-control-label" for="cb6">
                            American
                            <small class="text-black-50">156</small>
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
            <div class="owl-carousel owl-carousel-category owl-theme list-cate-page mb-4">
              <div class="item">
                <div class="osahan-category-item">
                  <a href="#">
                    <img class="img-fluid" src="img/list/1.png" alt="">
                    <h6>American</h6>
                    <p>156</p>
                  </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/2.png" alt="">
                          <h6>Pizza</h6>
                          <p>120</p>
                        </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/3.png" alt="">
                          <h6>Healthy</h6>
                          <p>130</p>
                        </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/4.png" alt="">
                          <h6>Vegetarian</h6>
                          <p>120</p>
                        </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/5.png" alt="">
                          <h6>Chinese</h6>
                          <p>111</p>
                        </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/6.png" alt="">
                          <h6>Hamburgers</h6>
                          <p>958</p>
                        </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/7.png" alt="">
                          <h6>Dessert</h6>
                          <p>56</p>
                        </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/8.png" alt="">
                          <h6>Chicken</h6>
                          <p>40</p>
                        </a>
                    </div>
                  </div>
                  <div class="item">
                    <div class="osahan-category-item">
                        <a href="#">
                          <img class="img-fluid" src="img/list/9.png" alt="">
                          <h6>Indian</h6>
                          <p>156</p>
                        </a>
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
                    <div class="list-card-image">
                      <img :src="chef.image_url" class="img-fluid item-img" />
                    </div>
                    <div class="p-3 position-relative">
                      <div class="list-card-body">
                        <h6 class="mb-1">
                          <span class="text-black">
                            {{ chef.first_name }}
                          </span>
                        </h6>
                        <p class="text-gray mb-3">
                          <span v-for="(cuisine, index) in chef.cuisines" :key="cuisine.id">
                            <span v-if="index != 0"> • </span>
                            {{ cuisine.name }}
                          </span>
                        </p>
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

    <input
      type="search"
      id="form1"
      class="form-control form-control-lg"
      placeholder="Search by cuisine"
      list="cuisineList"
      v-model="cuisineFilter"
    />

    <datalist id="cuisineList">
      <option v-for="cuisine in cuisines" :key="cuisine.id">{{ cuisine.name }}</option>
    </datalist>
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
