<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="1" sm="2">
                    <strong>BAG STATUS</strong>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="9" sm="8">
                    <v-card elevation="4" class="ma-0 pa-0">
                        <v-row no-gutters dense align="center" class="ma-0 pa-0">
                            <v-col class="ma-0 pa-0" align-self="center">
                                <v-text-field id="flightnbr" type="text" label="Flight"
                                                ref="flightnbr" placeholder="XX0201"
                                                filled
                                                dense
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
                            <v-col class="ma-0 pa-0" align-self="center">
                                <v-text-field id="seatnbr" type="text" label="Seat Nr"
                                                ref="seatnbr"
                                                placeholder="23C"
                                                filled
                                                dense
                                                :value="search.seatnbr"
                                                class="ma-1 pa-1"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row no-gutters dense align="center" class="ma-0 pa-0">
                            <v-spacer></v-spacer>
                            <v-col align-self="center" md="3">
                                <v-btn color="primary" dark class="mb-4 pa-1" @click="onClick()">Search</v-btn>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col align-self="center" md="3">
                                <v-btn color="grey" dark class="mb-4 pa-1" @click="onClear()">Clear</v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="ma-0 pa-0">
                <v-col>
                    <v-data-table dense
                                    :headers="headers"
                                    :items="items"
                                    disable-pagination
                                    disable-sort
                                    hide-default-footer
                                    class="ma-0 pa-0">
                        <template #item="{ item }">
                            <tr>
                                <td align="left">
                                    <router-link :to="formatHRef(item.bagnbr)">{{ item.bagnbr }}</router-link>
                                </td>
                                <td align="center">{{ item.seatnbr }}</td>
                                <td align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon medium
                                                        class="ma-0 pa-0" :color="formatBSM(item.bsm)">
                                                    {{ formatIcon(formatBSM(item.bsm)) }}
                                                </v-icon>
                                            </span>
                                        </template>
                                        <span>{{ getTextBSM(item.bsm) }}</span>
                                    </v-tooltip>
                                </td>
                                <td align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon medium
                                                        class="ma-0 pa-0" :color="formatProcessed(item.bpm)">
                                                    {{ formatIcon(formatProcessed(item.bpm)) }}
                                                </v-icon>
                                            </span>
                                        </template>
                                        <span>{{ getTextProcessed(item.bpm) }}</span>
                                    </v-tooltip>
                                </td>
                                <td align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon medium
                                                        class="ma-0 pa-0" :color="formatBoarded(item.boarded)">
                                                    {{ formatIcon(formatBoarded(item.boarded)) }}
                                                </v-icon>
                                            </span>
                                        </template>
                                        <span>{{ getTextBoarded(item.boarded) }}</span>
                                    </v-tooltip>
                                </td>
                                <td align="center">{{ formatDate(item.statusdate) }}</td>
                            </tr>
                        </template>
                    </v-data-table>
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
                    seatnbr: '',
                },
                headers: [
                    {
                        text: 'Bag Nbr',
                        align: 'center',
                        value: 'bagnbr',
                        tip: "Bag Number"
                    },
                    {
                        text: 'Seat Nbr',
                        align: 'center',
                        value: 'seatnbr',
                        tip: "Passenger Seat Number"
                    },
                    {
                        text: 'Autorized',
                        align: 'center',
                        value: 'bsm',
                        tip: "Bag is Autorized"
                    },
                    {
                        text: 'Processed',
                        align: 'center',
                        value: 'bpm',
                        tip: "Bag is Processed"
                    },
                    {
                        text: 'Pax Boarded',
                        align: 'center',
                        value: 'boarded'
                    },
                    {
                        text: 'TS',
                        align: 'center',
                        value: 'statusdate',
                        tip: "Last System Processing Timestamp"
                    }
                ],
                items: []
            }
        },
        methods: {
            getBagStatus() {
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
                    this.search.seatnbr = document.querySelector("input[id=seatnbr]").value;
                    this.dataAccess.getBagStatus('bagstatus', this.search.flightnbr, qdate, this.search.seatnbr, this.hub).then((response) => {
                        this.items = response.data;
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            formatDate(column) { 
                return util.formatDayHours(column);
            },
            getTextBSM(column) {
                return util.getTextBSM(column);
            },
            formatBSM(column) {
                return util.formatBSM(column);
            },
            getTextProcessed(column) {
                return util.getTextProcessed(column);
            },
            formatProcessed(column) {
                return util.formatProcessed(column);
            },
            getTextBoarded(column) {
                return util.getTextBoarded(column);
            },
            formatBoarded(column) {
                return util.formatBoarded(column);
            },
            onClick() {
                this.getBagStatus();
            },
            onClear() {
                this.items = [];
                this.$refs.flightnbr.reset();
                this.$refs.seatnbr.reset();
            },
            currentDate() {
                let currentdate = new Date();
                return util.formatDate(currentdate);
            },
            formatHRef(number) {
                return '/baginfo/' + number;
            },
            formatIcon(color) {
                if (color != null) return util.formatIcon(color);
            },
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.dataAccess = new DataAccess(this.$msal);
            this.search.flightdate = this.currentDate();
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

