<template>
<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <h3 class="pt-3">Shopping Cart</h3>
        </div>
    </div>

    <div v-for="cartItem in cart" :key="cartItem.id" class="row mt-2 pt-3">
        <div class="col-12">
            <h4>Cart Item ID: {{ cartItem.id }}</h4> 
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
                    <button class="btn btn-danger btn-sm" @click="removeItem(product.id)">Remove</button>
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
            <router-link :to="'/checkout/' + $route.params.id">
            <button class="btn btn-primary">Checkout</button>
        </router-link>
        </div>
      
    </div>
</div>
</template>
<script>
import axios from 'axios';
import { mapState } from 'vuex';
import swal from 'sweetalert';

export default {
    
    name: 'Cart',
    
    computed: {
        ...mapState(['cart', 'total']),
    },
    props: ['baseURL','Checkout','Makepayment','Wishlist'],
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
        removeItem() {
            axios.delete(`${this.baseURL}/carts/${this.$route.params.id}`)
                .then((response) => {
                    if(response.status == 200)
                    {
                        swal({

                            text:'Product deleted',
                            icon:'success'
                        })
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },
    mounted() {
        this.token = localStorage.getItem('token');
        this.listCartItems();
    },
};
</script>
<style scoped>
    
.card-image-top {
    border-radius: 5px;
    max-height: 255px;
}

.btn {
    margin-bottom: 36px;
    margin-top: 29px;
}
</style>
