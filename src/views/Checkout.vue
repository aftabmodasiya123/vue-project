<template>
<div class="container">
    <h3 class="text-center pt-3">Checkout</h3>
    <div v-for="cartItem in cart" :key="cartItem.id" class="row mt-2 pt-3">
        <div class="col-12">
            <h4>Product List: {{ cartItem.id }}</h4>
        </div>
        <div v-for="product in cartItem.products" :key="product.id" class="col-md-12">
            <div class="row align-items-center">
                <div class="col-md-3">
                    <img :src="product.thumbnail" alt="" class="w-100 card-image-top" style="object-fit: cover;height: 400px;" />
                </div>
                <div class="col-md-6">
                    <div class="card-block px-3">
                        <h6 class="card-title">{{ product.title }}</h6>
                        <p class="mb-1 font-weight-bold">$ {{ product.price }} per unit</p>
                        <p class="mb-1">Quantity: {{ product.quantity }}</p>
                        <p class="mb-0 font-weight-bold">Total: $ {{ product.price }}</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-danger btn-sm" @click="removeItem(cartItem.id, product.id)">Remove</button>
                </div>
            </div>
        </div>
        <div class="col-12">
            <hr />
        </div>
    </div>
    <div class="row">
        <div class="col-md-9"></div>
        <div class="col-md-3 text-right">
            <h5>Total: $ {{ total }}</h5>
        </div>
        <div class="col-md-9"></div>
        <div class="col-md-3 text-right">
            <router-link :to="'/makepayment/' +$route.params.id">
            <button class="btn btn-primary" >Make Payment</button>
        </router-link>
        </div>
    </div>
   
</div>
</template>

  
  
<script>
import axios from 'axios';
import swal from 'sweetalert';
import Cart from '../views/Cart.vue'
import {
    mapState
} from 'vuex';

export default {
    name: 'Checkout',
    components:{

        Cart
    },
    computed: {
        ...mapState(['cart', 'total']),
    },
    props: ['baseURL'],
    methods: {
        listCartItems() {
            axios.get(`${this.baseURL}/carts/${this.$route.params.id}?token=${this.token}`)
                .then((response) => {
                    this.$store.commit('setCart', [response.data]);
                    this.$store.commit('setTotal', response.data.total);
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        
        makePayment() {
            
            console.log('Payment process initiated');
        },
    },
    mounted() {
        this.token = localStorage.getItem('token');
        this.listCartItems();
    },
};
</script>
  
  
<style> 
</style>
