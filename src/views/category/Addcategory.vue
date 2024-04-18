<template>
<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <h3 class="pt-3">Add Category</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-3"></div>
        <div class="col-6">
            <form>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" class="form-control" v-model="title" />
                    <p v-if="!title && submitted" class="error-message">Title is required</p>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea type="text" class="form-control" v-model="description" />
                    <p v-if="!description && submitted" class="error-message">Title is required</p>
                    </div>
                    <div class="mb-3">
        <label for="formFile" class="form-label">Image</label>
        <input class="form-control" type="file" id="formFile" @change="handleFileChange" >
        <small v-if="fileError" class="text-danger">Please select a file</small>
      </div>
          <button type="button" class="btn btn-primary" @click="addcategory">
            Submit
          </button>
        </form>
      </div>
      <div class=""></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import sweetalert from "sweetalert";
export default {

    data() {

        return {

            thumbnail: '',
            title: '',
            description: '',
            submitted:false,
            file: '',
            fileError: false 
        }
    },
    methods: {

        async addcategory() {
            this.submitted=true
            console.log(this.title, this.description);
            if (!this.title || !this.description) {
                return;
            }
            const newCategory = {

                title: this.title,
                description: this.description,
                thumbbail: this.thumbnail
            };

            const baseUrl = "https://dummyjson.com";

          await  axios({

                method: 'get',
                url: `${baseUrl}/products/`,
                data: JSON.stringify(newCategory),
                headers: {

                    'Content-type': 'application/json'
                }
            }).then(() => {
                this.$router.replace("/admin/category");

                sweetalert({

                    text: 'Category added successfully',
                    icon: 'success'
                })
            }).catch(err => {

                console.log(err)
            })
        }
    },
    handleFileChange(event) {
     
      if (event.target.files.length > 0) {
        this.file = event.target.files[0];
        this.fileError = false; 
      } else {
        this.file = null;
        this.fileError = true; 
      }
    }
}
</script>
