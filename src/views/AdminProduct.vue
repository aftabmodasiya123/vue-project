<template>
<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <h3 class="pt-3">Our Categories</h3>
           
        </div>
    </div>
    <div class="row">
        <div v-for="category of categories" :key="category.id" class="col-md-4">
            <adminbox :category="category"></adminbox>
        </div>
    </div>
</div>
<pagination v-model="page" :records="100" :per-page="limit" @paginate="myCallback" />
</template>

    
    
<script>
import axios from "axios";
import Pagination from 'v-pagination-3';
import adminbox from '../components/Category/adminbox.vue';
import Addmixsins from "./Mixins/Addmixsins";
export default {
    name: 'AdminProduct',
    mixins:[Addmixsins],

    components: {
        adminbox,
        Pagination
    },
    data() {
        return {
            baseURL: "https://dummyjson.com",
            products: [],
            categories: [],
            page: 1,
            limit: 10,
            skip: 0
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
