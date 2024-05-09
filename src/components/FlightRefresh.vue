<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="3">
                    <strong>FLIGHT REFRESH</strong>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="6">
                    <v-card elevation="4" class="ma-0 pa-0">
                        <v-row no-gutters dense align="center" class="justify-space-around ma-0 pa-0">
                            <v-col class="ma-0 pa-0" align-self="center">
                                <v-text-field id="flightnbr" type="text" label="Flight"
                                              placeholder="XX0201"
                                              filled
                                              :value="search.flightnbr"
                                              class="ma-1 pa-1"></v-text-field>
                            </v-col>
                            <v-col class="ma-0 pa-0" align-self="center">
                                <v-text-field id="flightdate" type="text" label="Date"
                                              placeholder="23APR"
                                              filled
                                              dense
                                              :value="search.flightdate"
                                              class="ma-1 pa-1"></v-text-field>
                            </v-col>
                            
                        </v-row>
                        <v-row no-gutters dense align="center" class="justify-space-around ma-0 pa-0">
                            <v-col align-self="center" md="3">
                                <v-btn color="primary" dark class="mb-4 pa-1" @click="refreshFlight()">Process</v-btn>
                            </v-col>
                        </v-row>
                        <v-row no-gutters dense align="center" class="justify-space-around ma-0 pa-0">
                            <v-col align-self="center" md="3">
                                <v-alert border="top"
                                         :color="messageColor()"
                                         dark
                                         v-if="isEmpty() == false">
                                    <div v-for="(value, name, index) in errorMessages" v-bind:key="index">
                                        {{ name }} - {{ value[0] }}
                                    </div>
                                </v-alert>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import { Utils } from '../plugins/Utils';
    import { DataAccess } from '../plugins/DataAccess';

    const util = new Utils();

    export default {
        data() {
            return {
                dataAccess: null,
                dow: util.getDoW(),
                hub: this.$store.getters.hub,
                bagnr: this.$route.params.bagnr,
                search: {
                    flightnbr: '',
                    flightdate: '',
                },
                errorMessages: {},
            }
        },
        methods: {
            refreshFlight() {
                try {
                    this.search.flightnbr = document.querySelector("input[id=flightnbr]").value;
                    this.search.flightdate = document.querySelector("input[id=flightdate]").value;
                    let today = new Date();
                    let qdate = new Date(this.search.flightdate + today.getFullYear());
                    let diffDays = today.getDate() - qdate.getDate();
                    if (diffDays > 180) {
                        qdate.setFullYear(qdate.getFullYear() - 1);
                    }
                    qdate = util.formatYearMonthDay(qdate);
                    this.dataAccess.refreshFlight('refresh', this.search.flightnbr, qdate).then((response) => {
                        this.items = response.data;
                        this.errorMessages = { 'Success': ['Flight refresh'] };
                    }).catch((error) => {
                        if (error.message) {
                            this.errorMessages = error.response.data['flight']['fields'];
                        }
                    });
                } catch (error) {
                    this.items = [];
                }
            },
            currentDate() {
                let currentdate = new Date();
                return util.formatDate(currentdate);
            },
            isEmpty() {
                return Object.keys(this.errorMessages).length === 0;
            },
            isSucess() {
                return Object.keys(this.errorMessages).length === 1 && Object.keys(this.errorMessages)[0] === 'Success';
            },
            messageColor() {
                return (this.isSucess()) ? 'green lighten-3' : 'red lighten-2';
            }
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.dataAccess = new DataAccess(this.$msal);
            this.search.flightdate = this.currentDate();
        }
    };
</script>
<style scoped>
    .style-actual {
        vertical-align: middle;
        background-color: #E8F5E9;
    }

    .style-canceled {
        vertical-align: middle;
        background-color: #FFECB3;
    }

    .style {
        vertical-align: middle;
    }

    .style-principal {
        vertical-align: middle;
        background-color: #ECEFF1;
    }

    .style-turnaround-red {
        vertical-align: middle;
        background-color: #ECEFF1;
        color: #F44336;
    }

    .style-turnaround-yellow {
        vertical-align: middle;
        background-color: #ECEFF1;
        color: #FFEB3B;
    }
</style>

