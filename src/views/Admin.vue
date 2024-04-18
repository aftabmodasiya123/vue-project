<template>
<br>
<router-link :to="{name:'category'}">
<button class="btn btn-primary btn-lg">Admin Catagory</button>
</router-link>

<br>
<router-link :to="{name:'AdminProduct'}">
<button class="btn btn-primary btn-lg">Admin Product</button>
</router-link>



</template>

<script>

export default {

    name:'Admin'

}

</script>
<style>
.btn{

    margin-bottom: 30px;
}

</style>