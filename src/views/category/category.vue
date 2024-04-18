<template>
<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <h3 class="pt-3">Our Categories</h3>
            <router-link :to="{name:'Addcategory'}">
                <button class="btn" style="float: right;">Add Category</button>
            </router-link>
        </div>
    </div>
    <div class="row">
        <div v-for="category of categories" :key="category.id" class="col-md-4">
            <categorybox :category="category"></categorybox>
        </div>
        
    </div>
</div>
<pagination v-model="page" :records="100" :per-page="limit" @paginate="myCallback"/>
</template>

<script>

import Pagination from 'v-pagination-3';
import categorybox from '../../components/Category/categorybox.vue';
import ShowDetails from "../ShowDetails.vue";
import Addmixsins from '../Mixins/Addmixsins'
import Navbar from '@/components/Navbar.vue';
import WishList from '../WishList.vue';


export default {
    name: 'category',
    mixins:[Addmixsins],
   
    components: {
        categorybox,
        ShowDetails,
        Pagination,
        Navbar,
        WishList
    },
    data() {
    return {
      baseURL: "https://dummyjson.com",
      products:[],
      
      page:1,
      limit:10,
      skip:0
    }
  },
  methods: {
   
  },

 
};
</script>
<style>

.pagination {
   
    display: flex;
    padding-left: 518px;
    padding-top: 50px;
    list-style: none;
    border-radius: 0.25rem 
}
</style>
