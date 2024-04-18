<template>
<div class="container">
    <div class="row pt-5">
        <div class="col-md-1"></div>

        <div class="col-md-4 col-12">
            <img :src="product.thumbnail" class="img-fluid">
        </div>

        <div class="col-md-6 col-12 pt-3 pt-md-0">
            <h4>{{ product.title }}</h4>
            <h6 class="catgory font-italic"> {{product.brand}}</h6>
            <h6 class="font-weight-bold"> ${{product.price}}</h6>
            <p>
                {{ product.description }}
            </p>
            <div class="d-flex flex-row justify-content-between">
                <div class="input-group col-md-3 col-4 p-0">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Quantity</span>
                    </div>
                    <input type="number" class="form-control" v-model="quantity" />
                </div>

                <router-link :to="'/cart/' + $route.params.id">
                    <div class="input-group col-md-3 col-4 p-0">
                        <button class="btn" id="add-to-cart-button" @click="addToCart">
                            Add to Cart
                        </button>
                    </div>
                </router-link>
            </div>

            <div class="features pt-3">
                <h5><strong>Features</strong></h5>
                <ul style="text-align: justify;">
                    <li>High-quality materials for durability</li>
                    <li>Advanced technology for enhanced performance</li>
                    <li>Ergonomic design for comfortable usage</li>
                    <li>Multiple color options to suit your style</li>
                    <li>Easy to maintain and clean</li>
                </ul>
            </div>
            <router-link :to="'/wishlist/' + product.id">
            <button id="wishlist-button" class="btn mr-3 p-1 py-0" @click="addToWishList">
                {{ wishListString }}
            </button>
        </router-link>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import sweetAlert from 'sweetalert';
import { mapState, mapActions } from 'vuex';
import Category from './category/category.vue';
export default {
    name: 'ShowDetails',
    computed: {
    ...mapState(['total','token']),
  },
    data() {
        return {
            product: {
                title: '',
                description: '',
                brand: '',
                thumbnail: '',
                id: '',

            },
            wishListString: "Add to wishlist",
                
            quantity: 1
        }

    },
    props: ["baseURL", "categories"],
    methods: {
        ...mapActions(['addToCart','addToWishlist']),
        async getDetails() {
            console.log("path", `${this.baseURL}/products/${this.$route.params.id}`);
            try {
                const response = await axios.get(`${this.baseURL}/products/${this.$route.params.id}`);
                this.product = response.data;
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        },
        addToWishList() {


            
            if (this.token) {
        this.$router.replace('/signin');
        return;
      }
      
      try {
          this.$store.dispatch('addToWishlist', this.product);
        this.wishListString = 'Added to wishlist';
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
        },

        addToCart() {

            if (!this.token) {

                this.$router.replace('/signin');
                return;
            }
            axios.get(`${this.baseURL}/carts?token=${this.token}`, {

                id: this.product.id,
                quantity: this.quantity

            }).then((response) => {

                if (response.status == 200){

                    sweetAlert({

                        text: 'product added to cart',
                        icon: 'success'
                    });
                    
                    this.$store.dispatch('addToCart', this.product);

                    this.$emit("fetchData")
                }
            }).catch((err) => {

                console.log(err)

            })
        }

    },

    mounted() {
        this.getDetails();
        this.token = localStorage.getItem("token");
    }
}
</script>

<style>
.img-fluid {
    max-width: 100%;
    height: 305px;
}

#wishlist-button {
    background-color: #b9b9b9;
}

#add-to-cart-button {
    background-color: #febd69;
}

.input-group-prepend {

    height: 40px;
}

.input-group>.custom-select:not(:first-child),
.input-group>.form-control:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: 40px;
}
</style>
