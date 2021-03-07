<template>
  <div class="users-show">
    <div class="profile">
      <h1>{{ user.first_name }} {{ user.last_name }}</h1>
      <img :src="user.image_url" :alt="user.first_name" />
      <p>City</p>
      <p>{{ user.bio }}</p>
      <router-link v-if="ownProfile()" :to="`/users/${user.id}/edit`">Edit</router-link>
      <div v-if="user.chef">
        <span v-for="cuisine in user.cuisines" :key="cuisine.id">
          {{ cuisine.name }}
        </span>
        <div>
          <div v-for="hour in user.preorder_hours" :key="hour.id">
            <span>{{ hour.day_of_week }}</span>
            <span>{{ hour.open }} to {{ hour.close }}</span>
          </div>
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
      user: {},
      city: "",
    };
  },
  created: function() {
    axios.get(`/api/users/${this.$route.params.id}`).then(response => {
      this.user = response.data;
      console.log(this.user);
    });
  },
  methods: {
    ownProfile: function() {
      return this.$parent.getUserId() == this.user.id;
    },
  },
};
</script>
