<template>
<div class="conatiner">
    <div class="row">
        <div class="col-12 justify-content-center d-flex flex-row pt-5">
            <div id="signin" class="flext-item border">

                <h2 class="pt-4">Admin Sign-In</h2>
                <form @submit.prevent="signin" class="form-group pt-4 pl-4 pr-4">
                    <div class="form-group">
                        <label class="required-symbol">Email </label>
                        <input v-model="email" type="email" class="form-control" />
                        <p v-if="!email && submitted" class="error-message">Email is required</p>
                    </div>
                    <div class="form-group">
                        <label class="required-symbol">Password </label>
                        <input v-model="password" type="password" class="form-control" />
                        <p v-if="!password && submitted" class="error-message">password is required</p>
                    </div>
                    <button class="btn btn-primary mt-2 py-0">Signin</button>
                    <br>
                    <div class="d-flex justify-content-between">

                        <p class="text-left"><a href="forgotpsw">Forgot password?</a></p>
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import SweetAlert from 'sweetalert';
export default {

    name: 'AdminSignin',
    data() {

        return {

            email: '',
            password: '',
            submitted: false,
            userName: null
        }

    },
    methods: {
        async signin() {

            this.submitted = true
            if (!this.email || !this.password) {
                return;
            }

            console.log(this.email, this.password);

            const signinadd = {

                email: this.email,
                password: this.password
            };

            const baseUrl = "http://localhost:3000";

            await axios({

                method: 'get',
                url: `${baseUrl}/Admin`,
                data: JSON.stringify(signinadd),
                headers: {

                    'Content-Type': 'application/json'
                },
                params: {
                    email: this.email,
                    password: this.password
                }
            }).then((response) => {
                    if (response.data.length && response?.data?.find(u => u?.password === this.password)) {
                        const user = response?.data?.find(u => u?.password === this.password)
                        console.log('User authenticated:', response.data);
                        this.userName = user.name;
                        localStorage.setItem('userName', this.userName);
                        this.$router.replace("/admin");

                        SweetAlert({

                            text: 'signup successfully',
                            icon: 'success'
                        })
                    }
                    else{
                        SweetAlert({
                        text: 'Password Doesnot match',
                        icon: 'error'
                    });
                    }
                    }).catch((err) => {
                   
                       console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
a {
    padding-left: 59px;
}
</style>
