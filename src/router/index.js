import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

import Addcategory from '../views/category/Addcategory.vue';
import category from '../views/category/category.vue';
import Admin from '../views/Admin.vue';
import Signup from '../views/Signup.vue';
import Signin from '../views/Signin.vue';
import Forgotpsw from '../views/Forgotpsw.vue';

import Edit from '../views/Edit.vue';
import AdminProduct from '../views/AdminProduct.vue'
import AdminSignin from '../views/AdminSignin.vue'
import ShowDetails from '../views/ShowDetails.vue'
import NotFound from '../components/NotFound.vue'
import WishList from '@/views/WishList.vue';
import Cart from '../views/Cart.vue'
import Checkout from '@/views/Checkout.vue';
import Makepayment from '../views/Makepayment.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/admin/category/add',
    name: 'Addcategory',
    component: Addcategory,

  },
  {
    path: '/admin/category',
    name: 'category',
    component: category,

  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,

  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,


  },
  {
    path: '/admin/signin',
    name: 'AdminSignin',
    component: AdminSignin
  },
  {
    path: '/forgotpsw',
    name: 'Forgotpsw',
    component: Forgotpsw
  },
  {
    path: '/admin/adminproduct',
    name: 'AdminProduct',
    component: AdminProduct
  },

  {
    path: '/admin/edit/:id',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/product/show/:id',
    name: 'ShowDetails',
    component: ShowDetails
  },
  {
    path: '/wishlist/:id',
    name: 'WishList',
    component: WishList
  },
  {
    path: '/cart/:id',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout/:id',
    name: 'Checkot',
    component: Checkout
  },
  {
    path: '/makepayment/:id',
    name: 'Makepayment',
    component: Makepayment
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
export default router;
