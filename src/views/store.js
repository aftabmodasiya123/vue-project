import { createStore } from 'vuex';



const store = createStore({
  state: {
    
    cart:[],
    wishlist:[],
    total: 0,
    totalPayment: 3323,
    token: null,



  },


mutations:{

  setCart(state, cart) {
    state.cart = cart;
  },
  
  setTotal(state, total) {
    state.total = total;
  },

  addToCart(state, product) {
    state.cart.push(product);
  },
  setTotalPayment(state, total) {
    state.totalPayment = total;
  },
  setToken(state, token) {
    state.token = token;
  },
  addToWishlist(state, product) {
    state.wishlist.push(product);
  },
  removeFromWishlist(state, productId) {
    state.wishlist = state.wishlist.filter(product => product.id !== productId);
  },

clearCart(state){
 
  state.cart=[] 

}
  },

  actions:{

    addToCart({commit}, product){

      commit('addToCart',product)
    },

    clearCart({ commit }) {
      
      commit('clearCart');
    },
    calculateTotalPayment({ commit }, cartItems) {
      let total = 0;
      commit('setTotalPayment', total);
    },
    addToWishlist({ commit }, product) {
      commit('addToWishlist', product);
    },
    removeFromWishlist({ commit }, productId) {
      commit('removeFromWishlist', productId);
    },
    async fetchToken({ commit }) {
      const token = localStorage.getItem('token');
      commit('setToken', token);
    },
    async addToWishlist({ commit, state }, product) {
      if (!state.token) {
        throw new Error('User is not authenticated');
      }
      try {
        // Call your API to add to wishlist
        const response = await axios.post(`https//dummyjson.com/products`, {
          productId: product.id,
          token: state.token,
        });

        if (response.status === 200) {
          commit('addToWishlist', product);
        } else {
          throw new Error('Failed to add to wishlist');
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
      }
    },
  },

  getters: {
   
    cartCount(state) {
      return state.cart.reduce((total, cartItem) => total + cartItem.products.length);
    },
    getTotalPayment: (state) => state.totalPayment,

    token(state) {
      return state.token;
    },
    wishlist(state) {
      return state.wishlist;
    },
  },
});
export default store;
