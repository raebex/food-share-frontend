import Vue from "vue";
import VueRouter from "vue-router";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import UsersShow from "../views/UsersShow.vue";
import UsersEdit from "../views/UsersEdit.vue";
import Chefs from "../views/Chefs.vue";
import DishesNew from "../views/DishesNew.vue";
import CartedDishesIndex from "../views/CartedDishesIndex.vue";
import OrdersShow from "../views/OrdersShow.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "chefs",
    component: Chefs,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
  },
  {
    path: "/users/:id",
    name: "users-show",
    component: UsersShow,
  },
  {
    path: "/users/:id/edit",
    name: "users-edit",
    component: UsersEdit,
  },
  {
    path: "/dishes/new",
    name: "dishes-new",
    component: DishesNew,
  },
  {
    path: "/cart",
    name: "carted-dishes-index",
    component: CartedDishesIndex,
  },
  {
    path: "/orders/:id",
    name: "orders-show",
    component: OrdersShow,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
