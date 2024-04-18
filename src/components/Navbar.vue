<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link class="navbar-brand" :to="{ name: 'Home' }">
      <img id="logo" src="../assets/icon1.png" />
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <form class="form-inline ml-auto mr-auto">
        <div class="input-group">
          <input
            size="100"
            type="text"
            class="form-control"
            placeholder="Search Items"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
          <div class="input-group-prepend">
            <span class="input-group-text" id="search-button-navbar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                />
              </svg>
            </span>
          </div>
        </div>
      </form>

      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarAccount"
            data-toggle="dropdown"
          >
            Accounts
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarAccount">
            <router-link v-if="token" class="dropdown-item" :to="{ name: 'Home' }"
              >Home
            </router-link>
            <router-link v-if="token" class="dropdown-item" :to="{ name: 'WishList' }"
              >WishList
            </router-link>
            <router-link v-if="!token" class="dropdown-item" :to="{ name: 'Signup' }"
              >Sign up
            </router-link>
            <router-link v-if="!token" class="dropdown-item" :to="{ name: 'Signin' }"
              >Sign in
            </router-link>
            <router-link class="dropdown-item" :to="{ name: 'AdminSignin' }"
              >Admin
            </router-link>
            <a class="dropdown-item" v-if="token" href="#" @click="signout">Signout</a>
          </div>
        </li>
        <li class="nav-item">
          <div v-if="token" id="cart" style="position: absolute">
            <span id="nav-cart-count">{{ cartCount }}</span>
            <router-link :to="{ name: 'Cart', params: { id: itemId } }"
              >Link Text
              <i class="fa fa-shopping-cart" style="color: white"></i>
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Navbar",
  computed: {
    ...mapState(["token", "cartCount"]),
  },
  props: ["cartCount", ""],

  data() {
    return {
      token: null,
    };
  },

  methods: {
    signout() {
      localStorage.removeItem("token");
      this.token = null;

      this.$router.replace("signin/");
    },
  },

  mounted() {
    this.token = localStorage.getItem("token");
  },
};
</script>

<style scoped>
.nav-link {
  color: rgba(255, 255, 255);
}

.dropdown-m enu {
  background-color: #484a4b;
}

.dropdown-item {
  color: rgb(68, 66, 66);
}

.dropdown-item:hover {
  background-color: #bac1c7;
  color: aliceblue;
  transition: 1s;
}

.user-icon {
  margin-top: 20px;
  font-size: 24px;
  color: white;
}

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.5);
  margin-left: 30px;
  padding-top: 11px;
}

#logo {
  width: 150px;

  margin-right: 5px;
}

a {
  color: white;
}

.navbar-dark .navbar-nav .nav-link[data-v-4d808a77] {
  color: white;
  margin-left: 30px;
  padding-top: 11px;
}

#nav-cart-count {
  background-color: red;
  color: white;
  border-radius: 50%;
  height: 15px;
  width: 15px;
  font-size: 15px;
  align-items: center;
  display: flex;
  justify-content: center;
  position: absolute;
  margin-left: 10px;
}
</style>
