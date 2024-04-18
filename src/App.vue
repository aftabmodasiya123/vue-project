<template>
  <Navbar :cartCount="cartCount" />
  <router-view :baseURL="baseURL" :categories="categories"></router-view>
  <Footer />
</template>

<script>
import Navbar from "./components/Navbar.vue";
import axios from "axios";
import Footer from "./components/Footer.vue";

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      baseURL: "https://dummyjson.com",
      products: [],
      categories: [],
      cartCount: 0,
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(this.baseURL + "/products");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      if (this.token) {
        axios
          .get(`${this.baseURL}/carts/?token=${this.token}`)
          .then((response) => {
            const result = response.data;
            this.cartCount = result.carts.length;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.fetchData();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color:ivory;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
