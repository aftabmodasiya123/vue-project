

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './views/store'

const app = createApp(App)

  router.beforeEach((to,from,next) =>{
    const isAuthenticated = localStorage.getItem("token")
    if (to.name != "Signin" &&  to.name !== "Signup" && to.name !== "Forgotpsw" && to.name !== "AdminSignin" && to.name !== "Admin" && !isAuthenticated) {
     
      next('/signin');
    } else {
    
      next()
    }
  });

app.use(router)
app.use(store)

app.mount('#app')
