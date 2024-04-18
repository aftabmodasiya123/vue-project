import  axios  from "axios";
export default {

    data(){
        return{

        }
    },

    methods: {
        async fetchData() {
            try {
                const response = await axios.get(this.baseURL + '/products?skip=' + this.skip + '&limit=' + this.limit);
                this.categories = response.data.products;
                console.log(response)
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        myCallback() {
            
            this.skip = (this.page * this.limit) - this.limit
            this.fetchData()
        }
    },
    mounted() {
        this.fetchData();
    }
}

