<template>
<div id="home">
    <!-- <template v-if="userName">
        <h5>Welcome {{ userName }}</h5>
    </template> -->
    <div id="background-div" class="page-holder bg-cover">
        <div class="container py-5">
            <header class="text-left text-white py-5">
                <h3 class="mb-4 rounded" id="heading">
                    <a href="#start-shopping" class="bg-white px-2 py-2 rounded"> Start shopping</a> </h3>
                <p class="lead mb-0 bg-dark p-1 rounded"> Demo Ecommerce</p>
            </header>
        </div>
        <hr />
    </div>

    
    <div class="container">
        <div class="row">
            <div class="col-12 text-center">
                <h2 class="pt-3"> Top Categories</h2>
            </div>
        </div>
        <div class="row">
        <div v-for="category of categories" :key="category.id" class="col-md-4">
            <categoryBox :category="category"/>
        </div>
        </div>
    </div>
</div>
</template>

  
  
<script>
import axios from "axios";
import categoryBox from "../components/Category/categorybox.vue";
export default {
    name: "Home",
    components: {
        categoryBox
    },
    
    data() {
        return {
            categorySize: 0,
            baseURL: "https://dummyjson.com",
            categories:[],
            userName:null
        }
    },
    methods:{

        async fetchData(){

            const response=await axios.get(this.baseURL + `/products`)
            .then((res)=>{
                this.categories=res.data.products
            }).catch((err)=>{

                console.log(err)
            })

        }
    },
    mounted() {
        this.fetchData()
        this.userName = localStorage.getItem('userName');
        
    }
};
</script>
  
<style>
.page-holder {
    min-height: 100vh;
}

.bg-cover {
    background-size: cover !important;
}

#background-div {
    background: url("../assets/home.png");
}

#heading {
    font-weight: 400;
}
</style>
