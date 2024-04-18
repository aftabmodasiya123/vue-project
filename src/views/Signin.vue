<template>
<div class="conatiner">
    <div class="row">
        <div class="col-12 justify-content-center d-flex flex-row pt-5">
            <div id="signin" class="flext-item border">

                <h2 class="pt-4">Sign-In</h2>
                <form @submit.prevent="signin" class="form-group pt-4 pl-4 pr-4">
                    <div class="form-group">
                        <label class="required-symbol">Email </label>
                        <input v-model="email" type="text" class="form-control" />
                        <p v-if="!email && submitted" class="error-message">Email is required</p>
                    </div>
                    <div class="form-group">
                        <label class="required-symbol">Password </label>
                        <input v-model="password" type="password" class="form-control" />
                        <p v-if="!password && submitted" class="error-message">password is required</p>
                    </div>
                    <button class="btn btn-primary mt-2 py-0">Continue</button>
                    <br>
                    <div class="d-flex justify-content-between">
                        <div class="text-left">
                            <p>Don't have an account?</p>
                            <p><a href="Signup">Sign Up</a></p>
                        </div>
                        <p class="text-right"><a href="forgotpsw">Forgot password?</a></p>
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import sweetalert from "sweetalert";

export default {
    name: 'Signin',

    data() {
        return {
            email: "kminchelle",
            password: "0lelplR",
            submitted: false,
            firstName: null

        }
    },
    methods: {
        async signin() {
            this.submitted = true;
            if (!this.email || !this.password) {
                return;
            }

            const signinData = {
                email: this.email,
                password: this.password
            };

            const axiosInstance =axios.create({ baseURL : "https://dummyjson.com"})

            await axiosInstance({
                method: 'post',
                url: `/auth/login`,
                data: {
                    username: this.email,
                    password: this.password,
                   
                },
                 headers: {

                    'Content-Type': 'application/json'
                },
            }).then(response => {

               

                    console.log('User authenticated:', response.data);
                    this.firstName = response.data.firstName;
                   
                    console.log(this.firstName)
                    this.$router.replace('/');
                    localStorage.setItem('userName', this.firstName);
                    localStorage.setItem('token',response.data.token)

                    sweetalert({
                        text: 'Signin successful',
                        icon: 'success'
                    });
               
            }).catch(error => {
                console.error(error);
                sweetalert({
                    text:error.response.data.message,
                    icon: 'error'
                });
            });
        }
    }
};
</script>

<style scoped>
.error-message {
    color: red;
}
.container{

    background-color: blue;
}
@media screen {
    #signin {
        width: 40%;
    }
}
a{
    padding-left: 12px;
}

.required-symbol::after {
    content: '*';
    color: red;
    margin-left: 2px;
}
</style>


