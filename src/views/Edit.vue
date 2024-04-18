<template>
<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <h4 class="pt-3">Edit Category</h4>
        </div>
    </div>
    <div class="row">
        <div class="col-3"></div>
        <div class="col-6">
            <form v-if="category">
                <div class="form-group">
                    <label>Category Name</label>
                    <input type="text" class="form-control" v-model="category.title" required />
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" class="form-control" v-model="category.description" required />
                </div>
                <div class="form-group">
                    <label>Price</label>
                    <input type="text" class="form-control" v-model="category.price" required />
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" class="form-control" v-model="category.thumbnail" required />
                </div>
                <button type="button" class="btn btn-primary" @click="editCategory">Submit</button>
            </form>
        </div>
        <div class="col-3"></div>
    </div>
</div>
</template>

  
  
<script>
import axios from 'axios'
import swal from 'sweetalert'

export default {
    data() {
        return {
            category: {
                title: '',
                description: '',
                price:'',
                thumbnail: ''
            },
            id: null
        }
    },
    props: ["baseURL", "categories"],
    
    methods: {
        async editCategory() {
            console.log('category', this.category)
            await axios.post(`${this.baseURL}products/${this.id}`, this.category)
                .then(() => {
                   this.$emit("fetchData");
                    this.$router.push({
                        name: 'Category'
                    });
                    swal({
                        text: "Category has been updated successfully",
                        icon: "success"
                    });
                })
                .catch(err => console.log('err', err));
        },
        async getCategoryDetail(){
            await axios.get(`${this.baseURL}/products/${this.$route.params.id}`)
            .then((res)=>{
                const data = res?.data;
                this.category = data
            })
        }
    },
    mounted() {
        this.getCategoryDetail() 
    }
}
</script>
