<template>
<div class="container">
    <h3 class="text-center pt-3">Payment</h3>

    <div class="row mt-4">
        <div class="col-md-6 offset-md-3">
            <div class="form-group">
                <label for="paymentMethod">Select Payment Method:</label>
                <select v-model="selectedPaymentMethod" class="form-control" id="paymentMethod">
                    <option value="netBanking">Net Banking</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="cod">Cash on Delivery</option>
                </select>
            </div>
        </div>
    </div>

    <div v-if="selectedPaymentMethod === 'netBanking'">

        <div class="row mt-4">
            <div class="col-md-6 offset-md-3">
                <div class="form-group">
                    <label for="bankName">Bank Name:</label>
                    <input type="text" class="form-control" id="bankName" v-model="netBankingDetails.bankName" required>
                    <div class="invalid-feedback" v-if="!isValidBankName">
                        Please enter the bank name.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else-if="selectedPaymentMethod === 'card'">
        <div class="row mt-4">
            <div class="col-md-6 offset-md-3">
                <div class="form-group">
                    <label for="cardNumber">Card Number:</label>
                    <input type="text" class="form-control" id="cardNumber" v-model="cardDetails.cardNumber" placeholder="Enter card number" required>
                    <div class="invalid-feedback" v-if="!isValidCardNumber">
                        Please enter a valid card number.
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="expiryDate">Expiration Date:</label>
                        <input type="text" class="form-control" id="expiryDate" v-model="cardDetails.expiryDate" placeholder="MM/YYYY" required>
                        <div class="invalid-feedback" v-if="!isValidExpiryDate">
                            Please enter a valid expiration date (MM/YYYY).
                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="cvv">CVV:</label>
                        <input type="text" class="form-control" id="cvv" v-model="cardDetails.cvv" placeholder="Enter CVV" required>
                        <div class="invalid-feedback" v-if="!isValidCVV">
                            Please enter a valid CVV.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="form-group">
                    <label for="cardHolderName">Cardholder's Name:</label>
                    <input type="text" class="form-control" id="cardHolderName" v-model="cardDetails.cardHolderName" placeholder="Enter cardholder's name" required>
                    <div class="invalid-feedback" v-if="!isValidCardHolderName">
                        Please enter the cardholder's name.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>

        <div class="row mt-4">
            <div class="col-md-6 offset-md-3">
                <p>You will pay in cash on delivery.</p>
            </div>
        </div>
    </div>
    <div class="row mt-4" v-if="selectedPaymentMethod !== 'cod'">
        <div class="col-md-6 offset-md-3">
            <h4>Total Payment:</h4>

            <p>$ {{ getTotalPayment }}</p>
        </div>
    </div>
    <div class="row mt-4">
        <div class="col-md-6 offset-md-3">
            <button class="btn btn-primary btn-block" @click="submitPayment">Submit Payment</button>
        </div>
    </div>
</div>
</template>

<script>
import Cart from './Cart.vue';
import axios from 'axios';
import {
    mapState,
    mapGetters
} from 'vuex';
import swal from 'sweetalert';
export default {
    name: 'Makepayment',
    components: {

        Cart
    },
    data() {
        return {
            selectedPaymentMethod: 'netBanking',
            netBankingDetails: {
                bankName: '',
            },
            cardDetails: {
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                cardHolderName: '',
            },
        };
    },
    computed: {
        isValidBankName() {
            return this.selectedPaymentMethod !== 'netBanking' || this.netBankingDetails.bankName.trim() !== '';
        },

        ...mapGetters(['getTotalPayment']),
        ...mapState(['cart']),

    },
    methods: {
        submitPayment() {

            if (this.selectedPaymentMethod === 'netBanking' && !this.isValidBankName) {
                console.error('Form validation failed. Please check the bank name.');
                return;
            }

            if (this.selectedPaymentMethod === 'netBanking') {
                console.log('Net Banking payment submitted:', this.netBankingDetails);
                swal({

                    text: 'Payment made successfull',
                    icon: 'success'
                })
            } else if (this.selectedPaymentMethod === 'card') {
                console.log('Card payment submitted:', this.cardDetails);
                swal({

                    text: 'Payment made successfull',
                    icon: 'success'
                })

            } else {
                console.log('Cash on Delivery selected');
                swal({

                    text: 'Payment made successfull',
                    icon: 'success'
                })
            }
        },
        listCartItems() {
            axios.get(`${this.baseURL}/carts/${this.$route.params.id}?token=${this.token}`)
                .then((response) => {
                    this.$store.commit('setCart', [response.data]);
                    this.$store.commit('setTotal', response.data.total);
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },

    mounted() {

        this.token = localStorage.getItem('token');
        this.listCartItems();
    }
};
</script>

<style scoped>

</style>
