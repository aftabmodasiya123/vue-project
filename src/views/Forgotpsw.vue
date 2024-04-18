<template>
  <div class="conatiner">
    <div class="row">
      <div class="col-12 justify-content-center d-flex flex-row pt-5">
        <div id="signin" class="flext-item border">
          <h2 class="pt-4">Forgot Password</h2>
          <form @submit.prevent="forgot" class="form-group pt-4 pl-4 pr-4">
            <div class="form-group">
              <label class="required-symbol">Password </label>
              <input v-model="password" type="password" class="form-control" />
              <p v-if="!password && submitted" class="error-message">
                password is required
              </p>
            </div>
            <div class="form-group">
              <label class="required-symbol">confirmPassword </label>
              <input v-model="confirmPassword" type="password" class="form-control" />
              <p v-if="!confirmPassword && submitted" class="error-message">
                confirmPassword is required
              </p>
            </div>
            <button class="btn btn-primary mt-2 py-0">Continue</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
import axios from "axios";
import sweetalert from "sweetalert";

export default {
  name: "Forgotpsw",
  data() {
    return {
      password: null,
      confirmPassword: null,
      submitted: false,
    };
  },
  methods: {
    forgot() {
      this.submitted = true;
      if (
        !this.password ||
        !this.confirmPassword ||
        this.password !== this.confirmPassword
      ) {
        return;
      }

      const forgotData = {
        password: this.password,
        confirmPassword: this.confirmPassword,
      };

      const userId = "f51a";

      const baseUrl = "http://localhost:3000";

      axios({
        method: "put",
        url: `${baseUrl}/user/${userId}`,
        data: forgotData,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => {
          console.log("Password changed successfully:", response.data);

          this.$router.replace("/signin");

          sweetalert({
            text: "Password changed successfully",
            icon: "success",
          });
        })
        .catch((error) => {
          console.error(error);
          sweetalert({
            text: "Error occur while change the password",
            icon: "error",
          });
        });
    },
  },
};
</script>
<style>
.error-message {
  color: red;
}
</style>
