<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="12" sm="8">
                    <a @click="$router.go(-1)"><strong>BACK</strong></a> / <strong>{{ formatFlight(flight) }}</strong>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field dense
                                  color="#B71C1C"
                                  v-model="search"
                                  append-icon="mdi-magnify"
                                  label="Search"
                                  single-line
                                  hide-details></v-text-field>
                </v-col>
            </v-row>
            <v-row no-gutters class="justify-space-around ma-2 pa-1">
                <v-col cols="12">
                    <v-layout v-resize="onResize" child-flex>
                        <v-data-table dense
                                      :headers="headers"
                                      :items="items"
                                      :search="search"
                                      :items-per-page="itemsPerPage"
                                      :hide-default-header="isMobile"
                                      class="ma-0 pa-0">
                            <template #item="{ item }">
                                <tr v-if="!isMobile">
                                    <td align="left">
                                        <router-link :to="formatHRef(item)">{{ item.fields.number }}</router-link>
                                    </td>
                                    <td align="center">{{ item.fields.isrush }}</td>
                                    <td align="center">{{ item.fields.iseat }}</td>
                                    <td align="center">{{ item.fields.iaut }}</td>
                                    <td align="center">{{ item.fields.ifltnr }}</td>
                                    <td align="center">{{ formatSTD(item.fields.idate) }}</td>
                                    <td align="center">{{ item.fields.iorigin }}</td>
                                    <td align="center">{{ item.fields.bpmin }}</td>
                                    <td align="center">{{ item.fields.bsmboardi }}</td>
                                    <td class="style-principal" align="center">{{ item.fields.offp }}</td>
                                    <td class="style-principal" align="center">{{ item.fields.fseat }}</td>
                                    <td class="style-principal" align="center">{{ item.fields.faut }}</td>
                                    <td class="style-principal" align="center">{{ item.fields.bpmhub }}</td>
                                    <td class="style-principal" align="center">{{ item.fields.bsmboard }}</td>
                                    <td class="style-principal" align="center">{{ item.fields.ffltnr }}</td>
                                    <td class="style-principal" align="center">{{ formatSTD(item.fields.fdate) }}</td>
                                    <td class="style-principal" align="center">{{ item.fields.fdest }}</td>
                                    <td align="center">{{ formatDate(item.fields.timestamp) }}</td>
                                </tr>
                                <tr v-else>
                                    <td>
                                        <v-list-item-group class="d-flex justify-space-around flex-wrap pa-0 ma-0">
                                            <v-col cols="6" class="mx-0 my-1 pa-0">
                                         <v-list-item-subtitle class="flex-header text-caption">{{ getHeaders(0) }}</v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption">
                                            <router-link :to="formatHRef(item)">{{ item.fields.number }}</router-link>
                                         </v-list-item-title>
                                        </v-col>                                        
                                        <v-col cols="3" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption">{{ getHeaders(1) }}</v-list-item-subtitle>
                                         <v-list-item-title class="flex-content text-caption">{{ item.fields.isrush }}</v-list-item-title>
                                        </v-col>                                        
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption"> {{getHeaders(2)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption"> {{item.fields.iseat}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption"> {{getHeaders(3)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.iaut}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(4)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.ifltnr}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption"> {{getHeaders(5)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption"> {{item.fields.idate}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(6)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption"> {{item.fields.iorigin}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption"> {{getHeaders(7)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.bpmin}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption"> {{getHeaders(8)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.bsmboardi}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" > {{getHeaders(9)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.offp}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(10)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption"> {{item.fields.fseat}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" >{{getHeaders(11)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.faut}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(12)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.bpmhub}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(13)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{ item.fields.bsmboard}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(14)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.ffltnr}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(15)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.fdate}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="3" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(16)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.fdest}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="6" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(17)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.timestamp}}</v-list-item-title>
                                            </v-col>
                                        </v-list-item-group>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-layout>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import { Utils } from '../plugins/Utils';
    import { DataAccess } from '../plugins/DataAccess';

    const util = new Utils();
    const dateNull = util.dateNull;

    export default {
        data() {
            return {
                dataAccess: null,
                dow: util.getDoW(),
                isMobile: false,
                hub: this.$store.getters.hub,
                flightid: this.$route.params.flightId,
                search: "",
                itemsPerPage: 50,
                flight: {
                    operator: '',
                    flt_nr: '',
                    std: '',
                    to_iata: '',
                },
                headers: [
                    {
                        text: 'Bag Tag',
                        align: 'center',
                        sortable: true,
                        value: 'fields.number',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Bag Number"
                    },
                    {
                        text: 'Rush',
                        align: 'center',
                        sortable: false,
                        value: 'fields.isrush',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Is Rush Bag"
                    },
                    {
                        text: 'Seat',
                        align: 'center',
                        sortable: true,
                        value: 'fields.iseat',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Inbound Flight Passenger Seat Number"
                    },
                    {
                        text: 'Auth',
                        align: 'center',
                        sortable: false,
                        value: 'fields.iaut',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Bag is Autorized on Inbound Flight"
                    },
                    {
                        text: 'Flt',
                        align: 'center',
                        sortable: true,
                        value: 'fields.ifltnr',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Inbound Flight Number"
                    },
                    {
                        text: 'Date',
                        align: 'center',
                        sortable: true,
                        value: 'fields.idate',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Inbound Flight Schedule Departure Time"
                    },
                    {
                        text: 'Origin',
                        align: 'center',
                        sortable: true,
                        value: 'fields.iorigin',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Inbound Flight Origin"
                    },
                    {
                        text: 'BPM',
                        align: 'center',
                        sortable: false,
                        value: 'fields.bpmin',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Bag is Processed on Inbound Flight"
                    },
                    {
                        text: 'BB',
                        align: 'center',
                        sortable: false,
                        value: 'fields.bsmboardi',
                        class: ['ml-0', 'mr-0', 'pl-0', 'pr-0'],
                        tip: "Passengers is Boarded on Inbound Flight"
                    },
                    {
                        text: 'FFP',
                        align: 'center',
                        sortable: true,
                        value: 'fields.offp',
                        class: ['ma-0', 'pa-0'],
                        tip: "Passengers is Frequent Flyer"
                    },
                    {
                        text: 'Seat',
                        align: 'center',
                        sortable: true,
                        value: 'fields.fseat',
                        class: ['ma-0', 'pa-0'],
                        tip: "Outbound Flight Passenger Seat Number"
                    },
                    {
                        text: 'Auth',
                        align: 'center',
                        sortable: true,
                        value: 'fields.faut',
                        class: ['ma-0', 'pa-0'],
                        tip: "Bag is Autorized on Outbound Flight"
                    },
                    {
                        text: 'BPM',
                        align: 'center',
                        sortable: true,
                        value: 'fields.bpmhub',
                        class: ['ma-0', 'pa-0'],
                        tip: "Bag is Processed on Outbound Flight"
                    },
                    {
                        text: 'BB',
                        align: 'center',
                        sortable: true,
                        value: 'fields.bsmboard',
                        class: ['ma-0', 'pa-0'],
                        tip: "Bag is Board on Outbound Flight"
                    },
                    {
                        text: 'Flt',
                        align: 'center',
                        sortable: true,
                        value: 'fields.ffltnr',
                        class: ['ma-0', 'pa-0'],
                        tip: "Outbound Flight Number"
                    },
                    {
                        text: 'Date',
                        align: 'center',
                        sortable: true,
                        value: 'fields.fdate',
                        class: ['ma-0', 'pa-0'],
                        tip: "Outbound Flight Schedule Departure Time"
                    },
                    {
                        text: 'Dest',
                        align: 'center',
                        sortable: true,
                        value: 'fields.fdest',
                        class: ['ma-0', 'pa-0'],
                        tip: "Outbound Flight Destination"
                    },
                    {
                        text: 'TS',
                        align: 'center',
                        sortable: true,
                        value: 'fields.timestamp',
                        class: ['ma-0', 'pa-0'],
                        tip: "Last System Processing Timestamp for Bag"
                    }
                ],
                items: []
            }
        },
        methods: {
            onResize() {
                if (window.innerWidth < 769)
                    this.isMobile = true;
                else
                    this.isMobile = false;
            },
            getBags(id, flightid) {
                try {
                    this.dataAccess.getBags(id, flightid).then((response) => {
                        this.items = [];
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            getFlight(id, flightid) {
                try {
                    this.dataAccess.getFlight(id, flightid).then((response) => {
                        this.flight = response.data[0]['fields'];
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            getStatusColor(ratio) {
                return util.getStatusColor(ratio);
            },
            formatDate(date) {
                return util.formatDayHours(date);
            },
            formatSTD(date) {
                if (date != null) {
                    var dateAux = new Date(date);
                    return ('0' + dateAux.getDate()).slice(-2);
                }
                return '';
            },
            formatHRef(item) {
                return '/baginfo/' + item.fields.number;
            },
            formatMinToETD(column) {
                let etd = new Date(column);
                let now = new Date();

                var mintoetd = Math.round((((etd - now) % 86400000) % 3600000) / 60000); // minutes;
                if (mintoetd < 0) return '-';
                else return mintoetd;
            },
            formatFlight(flight) {
                if (flight.operator != null && flight.operator != '') {
                    return util.formatFlight(flight.operator, flight.flt_nr) + ' ' + flight.to_iata + ' ' + util.formatDate(flight.std) + ' ' + this.formatBTD(flight);
                }
                else {
                    return '';
                }
            },
            formatBTD(item) {
                if (item.std == null) return '';
                if (item.atd != dateNull) return util.formatHours(item.atd) + 'A';
                if (item.etd != dateNull) return util.formatHours(item.etd) + 'E';
                return util.formatHours(item.std);
            },
            getHeaders(i) {
                return this.headers[i]['text'];
            }
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.dataAccess = new DataAccess(this.$msal);   
            this.getBags('bagsflight', this.flightid);
            this.getFlight('bagsflight', this.flightid);
            this.timer = setInterval(function () {
                this.getBags('bagsflight', this.flightid);
            }.bind(this), 30000);
            
        },
        beforeUnmount() {
            clearInterval(this.timer);
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

    .flex-header {
        list-style: none;
    }

    .flex-content {
        list-style: none;
        font-weight: bold;
    }
</style>

