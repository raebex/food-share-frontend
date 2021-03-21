<template>
  <div class="signup">
    <div class="container-fluid">
      <div class="row no-gutter">
        <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
        <div class="col-md-8 col-lg-6">
          <div class="login d-flex align-items-center py-5">
            <div class="container">
              <div class="row">
                <div class="col-md-9 col-lg-8 mx-auto pl-5 pr-5">
                  <h3 class="login-heading mb-4">Signup</h3>
                  <form v-on:submit.prevent="submit()">
                    <div class="form-label-group">
                      <input
                        type="text"
                        id="inputFirstName"
                        class="form-control"
                        placeholder="First name"
                        v-model="firstName"
                      />
                      <label for="inputFirstName">First name</label>
                    </div>
                    <div class="form-label-group">
                      <input
                        type="text"
                        id="inputLastName"
                        class="form-control"
                        placeholder="Last name"
                        v-model="lastName"
                      />
                      <label for="inputLastName">Last name</label>
                    </div>
                    <div class="form-label-group">
                      <input
                        type="email"
                        id="inputEmail"
                        class="form-control"
                        placeholder="Email address"
                        v-model="email"
                      />
                      <label for="inputEmail">Email address</label>
                    </div>
                    <div class="form-label-group">
                      <input
                        type="password"
                        id="inputPassword"
                        class="form-control"
                        placeholder="Password"
                        v-model="password"
                      />
                      <label for="inputPassword">Password</label>
                    </div>
                    <div class="form-label-group">
                      <input
                        type="password"
                        id="inputPasswordConfirmation"
                        class="form-control"
                        placeholder="Password confirmation"
                        v-model="passwordConfirmation"
                      />
                      <label for="inputPasswordConfirmation">Password confirmation</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-3">
                      <input type="checkbox" class="custom-control-input" id="customCheck1" v-model="chef" />
                      <label class="custom-control-label" for="customCheck1">Are you a chef?</label>
                    </div>
                    <p class="text-danger" v-for="error in errors" v-bind:key="error">
                      {{ error }}
                    </p>
                    <input
                      type="submit"
                      class="btn btn-lg btn-outline-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                      value="Signup"
                    />
                    <div class="text-center pt-3">
                      Already have an account?
                      <router-link class="font-weight-bold" to="/login">Login</router-link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      chef: "",
      errors: [],
    };
  },
  methods: {
    submit: function() {
      var params = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
        chef: this.chef,
      };
      axios
        .post("/api/users", params)
        .then(response => {
          var newUser = response.data;

          var loginParams = {
            email: newUser.email,
            password: params.password,
          };
          axios
            .post("/api/sessions", loginParams)
            .then(response => {
              axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
              localStorage.setItem("jwt", response.data.jwt);
              localStorage.setItem("user_id", response.data.user_id);

              if (response.data.chef) {
                this.$router.push(`/users/${newUser.id}/edit`);
              } else {
                this.$router.push("/");
              }
            })
            .catch(error => {
              console.log(error.response);
              this.errors = ["Invalid email or password."];
              this.email = "";
              this.password = "";
            });
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>
