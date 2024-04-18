<template>
<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <h3 class="pt-3">WishList</h3>
        </div>
    </div>

    <div v-for="wishlistItem in products" :key="wishlistItem.id"  class="row mt-2 pt-3">
        
        <div v-for="product in wishlistItem.products" :key="product.id" class="col-md-12">
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
               
            </div>
        </div>
        <div class="col-12">
            <hr />
        </div>
    </div>
    
</div>
</template>
<script>
import axios from "axios";
import categorybox from "@/components/Category/categorybox.vue";
import Cart from "./Cart.vue";
import {
    mapGetters
} from "vuex";

export default {
    components: {
        categorybox,
        Cart
            
    },
    computed: {
        ...mapGetters(['wishlist']),
    },
    data() {
        return {
            token: null,
            products:[],
            cart:[]
            
        };
    },
    props: ["baseURL"],
    methods: {
        async fetchWishList() {
     
                const response = await axios.get(`${this.baseURL}/products/${this.$route.params.id}?token=${this.token}`)
                .then((response)=>{
                    this.products = response.data;

                }).catch((errro)=>{

                    console.log(errro)
                })
                
          
        },
    },
    mounted() {
        this.token = localStorage.getItem("token");
        this.fetchWishList();
    },
};
</script>
