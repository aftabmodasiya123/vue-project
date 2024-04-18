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

                <div class="col-md-6 d-flex justify-content-center">
                    <router-link :to="'/admin/edit/' + category.id" >
                        <button class="btn btn-primary">Edit</button>
                    </router-link>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
export default {

    name: 'adminbox',
    props: ["category"],

}
</script scoped>

<style>
.card-img-top {

    object-fit: cover;
   
}

</style>
