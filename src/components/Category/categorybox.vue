<template>
    <div>
<div class="card" style="margin-top: 15px;">
    <div class="embed-responsive embed-responsive-16by4">
        <img class="card-img-top" height="200px" :src="category.thumbnail" alt="card image cap">
    </div>

    <div class="card-body" style="height: 250px;">
        <h5 class="card-title">{{ category.title }}</h5>
        <p class="card-text">{{ category.description }}</p>
        <p class="card-text">${{ category.price }}</p>
        
        <div class="row">
            <div class="col-md-6">
            <router-link :to="'/product/show/' + category.id">
                <a href="#" class="btn btn-primary btn-block mb-2">view Product</a>
            </router-link>
            </div>
        
        </div>

    </div>
    
</div>
</div>

</template>

<script>

export default {

    name: 'categorybox',
    props: ["category",""],
    
}
</script>

<style>
.card-img-top {

    object-fit: cover;
}
.col-md-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 11 0 50%;
    max-width: 50%;
    margin-left: 85px;
}
.card-body{

    background-color: rgb(192, 192, 175);
}
</style>
