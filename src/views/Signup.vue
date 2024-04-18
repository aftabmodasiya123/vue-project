<template>
<div class="container">
    
    <div class="row">
        <div class="col-12 text-center pt-3">
           
        </div>
    </div>

    
    <div class="row">
        <div class="col-12 justify-content-center d-flex pt-3">
            <div id="signup" class="flex-item border">
                <h2 class="pt-4 pl-4">Create Account</h2>
                <form @submit.prevent="signup" class="pt-4 pl-4 pr-4">
                    <div class="form-group">
                        <label for="email" class="required-symbol">Email</label>
                        <input type="email" v-model="email" class="form-control" required />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <div class="form-group">
                                <label class="required-symbol">First Name</label>
                                <input type="text" v-model="firstName" class="form-control" required />
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="required-symbol">Last Name</label>
                                <input type="text" v-model="lastName" class="form-control" required />
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password" class="required-symbol">Password</label>
                        <input type="password" v-model="password" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword" class="required-symbol">Confirm Password</label>
                        <input type="password" v-model="confirmPassword" class="form-control" required />
                    </div>
                    <button type="submit" class="btn btn-primary mt-2">Create Account</button>
                    <br>
                    <p class="text-center">Already have an account? <a href="Signin">Sign In</a></p>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import Home from './Home.vue';
import sweetalert from "sweetalert";

export default {
    props: [""],
    data() {
        return {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',

        };
    },

    methods: {

       async signup() {

            console.log(this.email, this.firstName, this.lastName, this.password, this.confirmPassword);

            const signupadd = {

                email:this.email,
                firstName:this.firstName,
                lastName:this.lastName,
                password:this.password,
                confirmPassword:this.confirmPassword
            };

            const baseUrl = "http://localhost:3000";

            if (this.password === this.confirmPassword) {
                const user = {
                    email: this.email,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    password: this.password
                };
                
               await axios({

                    method: 'post',
                    url: `${baseUrl}/user`,
                    data: JSON.stringify(signupadd),
                    headers: {

                        'Content-type': 'application/json'
                    }
                }).then(() => {
                  this.$router.replace("/");

                    sweetalert({

                        text: 'signup successfully',
                        icon: 'success'
                    })
                }).catch(err => {

                    console.log(err)
                })
            } else {
                sweetalert({
                    text:'Password Doesnot match',
                    icon:'error'
                });
            }
        }
    }
};
</script>

<style>
.btn-primary {
    background-color: #f0c14b;
    color: #000;
}
@media screen {
  #signup{  
    width: 40%;
  }
}
.required-symbol::after {
      content: '*';
      color: red;
      margin-left: 2px;
    }
</style>
