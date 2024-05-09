<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <PieChart :stations="hub" :smalls="true"/>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="3">
                    <strong>DEPARTURES </strong>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="4" offset-cols="8">
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
                                      hide-default-footer
                                      disable-pagination
                                      :hide-default-header="isMobile" 
                                      class="ma-0 pa-0">
                            <template #item="{ item }">
                                <tr v-if="!isMobile">
                                    <td :class="getClass(item.fields.atd)" align="left">
                                        <router-link :to="formatHRef(item)">{{ item.fields.ffltnr }}</router-link>
                                    </td>
                                    <td :class="getClass(item.fields.atd)" align="left">
                                        <v-icon small class="ma-0 pa-0" v-if="isInFlight(item.fields)" @click="flightRef(item.fields)">mdi-airplane</v-icon>
                                        <v-tooltip bottom v-if="isIrregular(item.fields.status)">
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on">
                                                    <v-icon small class="ma-0 pa-0" v-if="isIrregular(item.fields.status)">mdi-alert</v-icon>
                                                </span>
                                            </template>
                                            <span> {{ item.fields.status }}</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="isBoarding(item.fields.boardts, item.fields.atd)">
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on">
                                                    <v-icon small>mdi-seat-recline-extra</v-icon>
                                                </span>
                                            </template>
                                            <span> Boarding started {{ formatDate(item.fields.boardts) }}</span>
                                        </v-tooltip>
                                        <v-icon v-if="hasPrio(item.pk)" medium class="ma-0 pa-0" color="grey darken-3">mdi-pandora</v-icon>
                                    </td>
                                    <td :class="getClass(item.fields.atd)" align="center">{{ formatSTD(item.fields.std) }}</td>
                                    <td :class="getClass(item.fields.atd)" align="center">{{ formatBTD(item.fields) }}</td>
                                    <td :class="getClass(item.fields.atd)" align="center">{{ item.fields.fdest }}</td>
                                    <td :class="getClass(item.fields.atd)" align="right">{{ item.fields.lnrbags }}</td>
                                    <td :class="getClass(item.fields.atd)" align="right">{{ item.fields.tnrbags }}</td>
                                    <td :class="getClass(item.fields.atd)" align="right">{{ item.fields.isrushbag }}</td>
                                    <td :class="getClass(item.fields.atd)" align="right">{{ item.fields.unauthbag }}</td>
                                    <td :class="getClass(item.fields.atd)" align="right">{{ formatMinToETD(item.fields) }}</td>
                                    <td :class="getClass(item.fields.atd)" align="center">{{ item.fields.tbags }} / {{ item.fields.tbagsbpm }} / {{ item.fields.tbagsboard }}</td>
                                </tr>
                                <tr v-else>
                                    <td :class="getClass(item.fields.atd)">
                                        <v-list-item-group class="d-flex justify-space-around flex-wrap pa-0 ma-0">
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(0)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <router-link :to="formatHRef(item)">{{ item.fields.ffltnr }}</router-link>
                                                </v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">Situation</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-icon small class="ma-0 pa-0" v-if="isInFlight(item.fields)" @click="flightRef(item.fields)">mdi-airplane</v-icon>
                                                    <v-tooltip bottom v-if="isIrregular(item.fields.status)">
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                <v-icon small class="ma-0 pa-0" v-if="isIrregular(item.fields.status)">mdi-alert</v-icon>
                                                            </span>
                                                        </template>
                                                        <span> {{ item.fields.status }}</span>
                                                    </v-tooltip>
                                                    <v-tooltip bottom v-if="isBoarding(item.fields.boardts, item.fields.atd)">
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                <v-icon small>mdi-seat-recline-extra</v-icon>
                                                            </span>
                                                        </template>
                                                        <span> Boarding started {{ formatDate(item.fields.boardts) }}</span>
                                                    </v-tooltip>
                                                    <v-icon v-if="hasPrio(item.pk)" medium class="ma-0 pa-0" color="grey darken-3">mdi-pandora</v-icon>
                                                </v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(1)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{formatSTD(item.fields.std)}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(2)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{formatBTD(item.fields)}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(3)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.fdest}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(4)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.lnrbags}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(5)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption"> {{item.fields.tnrbags}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(6)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{item.fields.isrushbag}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">{{getHeaders(7)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">{{formatMinToETD(item.fields.etd)}}</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" >{{getHeaders(8)}}</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    {{ item.fields.tbags }} / {{ item.fields.tbagsbpm }} / {{ item.fields.tbagsboard }}
                                                </v-list-item-title>
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
    import PieChart from './PieChartPart.vue';
    import { Utils } from '../plugins/Utils';
    import { DataAccess } from '../plugins/DataAccess';

    const util = new Utils();
    const dateNull = util.dateNull;

    export default {
        components: {
            PieChart,
        },
        data() {
            return {
                dataAccess: null,
                dow: util.getDoW(),
                isMobile: false,
                hub: this.$store.getters.hub,
                timezone: this.$store.getters.timezone,
                darkMode: this.$store.getters.darkMode,
                priorityFlights: [],   
                search: "",
                status: {
                    netarr0: 0,
                    netarrall: 0,
                    netarr0ratio: 0,
                    hubarr0: 0,
                    hubarrall: 0,
                    hubarr0ratio: 0,
                    paxarr: 0,
                    caparr: 0,
                    lfarr: 0,
                    paxnet: 0,
                    capnet: 0,
                    lfnet: 0,
                    paxdep: 0,
                    capdep: 0,
                    lfdep: 0,
                    hubdep3: 0,
                    hubdepall: 0,
                    hubdep3ratio: 0,
                    hubdep15: 0,
                    hubdep15ratio: 0,
                    netdep15: 0,
                    netdepall: 0,
                    netdep15ratio: 0,
                },
                headers: [
                    {
                        text: 'Flt Nr',
                        align: 'left',
                        value: 'fields.ffltnr',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Flight Number'
                    },
                    {
                        text: '',
                        align: 'center',
                        value: '',
                        class: ['ma-1', 'pa-1']
                    },
                    {
                        text: 'STD',
                        align: 'center',
                        value: 'fields.fdate',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Schedule Departure Date'
                    },
                    {
                        text: 'BTD',
                        align: 'center',
                        value: 'fields.fdate',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Best Departure Date'
                    },
                    {
                        text: 'To',
                        align: 'center',
                        value: 'fields.fdest',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Destination'
                    },
                    {
                        text: 'Total Bags Local',
                        align: 'right',
                        value: 'fields.lnrbags',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Number of Local Bags'
                    },
                    {
                        text: 'Total Bags Transfer',
                        align: 'right',
                        value: 'fields.tnrbags',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Number of Transfer Bags'
                    },
                    {
                        text: 'Rush',
                        align: 'right',
                        value: 'fields.isrushbag',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Number of Rush Bags'
                    },
                    {
                        text: 'UnAut',
                        align: 'right',
                        value: 'fields.unauthbag',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Number of Unauthorized Bags'
                    },
                    {
                        text: 'Min to ETD',
                        align: 'center',
                        value: 'fields.etd',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Minutes to Estimated Time of Departure'
                    },
                    {
                        text: 'TB / TBP / PB Ok',
                        align: 'center',
                        value: '',
                        class: ['ma-1', 'pa-1'],
                        tip: 'Total Bags / Processed Bags / Passenger Boarded'
                    }
                ],
                items: [],
                formTitle: "",
            }
        },
        methods: {
            onResize() {
                if (window.innerWidth < 769)
                    this.isMobile = true;
                else
                    this.isMobile = false;
            },
            getOperationStatus(id, hub) {
                this.dataAccess.getOperationStatus(id, hub).then((response) => {
                    var operationStatus = response.data;
                    this.status.netarr0 = operationStatus.sum_netarr0;
                    this.status.netarrall = operationStatus.sum_netarr;
                    this.status.netarr0ratio = (this.status.netarrall != 0) ? Math.round(this.status.netarr0 / this.status.netarrall * 100) : 0;
                    this.status.hubarr0 = operationStatus.sum_hubfltarr0;
                    this.status.hubarrall = operationStatus.sum_huballarr;
                    this.status.hubarr0ratio = (this.status.hubarrall != 0) ? Math.round(this.status.hubarr0 / this.status.hubarrall * 100) : 0;
                    this.status.paxarr = operationStatus.sum_paxarr;
                    this.status.caparr = operationStatus.sum_caparr;
                    this.status.lfarr = (this.status.caparr != 0) ? Math.round(this.status.paxarr / this.status.caparr * 100) : 0;
                    this.status.paxnet = operationStatus.sum_pax;
                    this.status.capnet = operationStatus.sum_cap;
                    this.status.lfnet = (this.status.capnet != 0) ? Math.round(this.status.paxnet / this.status.capnet * 100) : 0;
                    this.status.paxdep = operationStatus.sum_paxdep;
                    this.status.capdep = operationStatus.sum_capdep;
                    this.status.lfdep = (this.status.capdep != 0) ? Math.round(this.status.paxdep / this.status.capdep * 100) : 0;
                    this.status.hubdep3 = operationStatus.sum_hubfltdep3;
                    this.status.hubdepall = operationStatus.sum_huballdep;
                    this.status.hubdep3ratio = (this.status.hubdepall != 0) ? Math.round(this.status.hubdep3 / this.status.hubdepall * 100) : 0;
                    this.status.hubdep15 = operationStatus.sum_hubfltdep15;
                    this.status.hubdep15ratio = (this.status.hubdepall != 0) ? Math.round(this.status.hubdep15 / this.status.hubdepall * 100) :0;
                    this.status.netdep15 = operationStatus.sum_netfltdep15;
                    this.status.netdepall = operationStatus.sum_netalldep;
                    this.status.netdep15ratio = (this.status.netdepall != 0) ? Math.round(this.status.netdep15 / this.status.netdepall * 100) :0;
                });
            },
            getDepartures(id, hub) {
                try {
                    this.dataAccess.getDepartures(id, hub).then((response) => {
                        this.items = [];
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            getPriorityFlights() {
                this.dataAccess.getPriorityFlights('departures', this.hub).then((response) => {
                    this.priorityFlights = response.data;
                });
            },
            getStatusColor(ratio) {
                return util.getStatusColor(ratio);
            },
            formatSTD(date) {
                return util.formatDayHours(date);
            },
            formatBTD(item) {
                if (item.std == null) return '';
                if (item.atd != dateNull) return util.formatDayHours(item.atd) + 'A';
                if (item.etd != dateNull && item.etd != item.std) return util.formatDayHours(item.etd) + 'E';
                return util.formatDayHours(item.std);
            },
            formatHRef(item) {
               return '/bagsflight/' + item.pk;
            },
            formatMinToETD(item) {
                let etd = new Date(item.std);
                if (item.etd != null) {
                    etd = new Date(item.etd);
                }
                var mintoetd = util.minToDate(etd, this.timezone);
                if (mintoetd < 0) return '-';
                else return mintoetd;
            },
            hasPrio(pk) {
                if (util.formatPrio(pk, this.priorityFlights) == util.priority) {
                    return true;
                } else {
                    return false;
                }
            },
            getClass(date) {
                if (this.darkMode == true) {
                    return (date == null || date == '' || date == dateNull) ? 'style-row pa-1 ma-1' : 'style-actual-dark pa-1 ma-1';
                }
                else {
                    return (date == null || date == '' || date == dateNull) ? 'style-row pa-1 ma-1' : 'style-actual pa-1 ma-1';
                }
            },
            isInFlight(item) {
                return util.isInFlight(item.atd, item.ata);
            },
            flightRef(item) {
                let flightref = 'http://www.radarbox.com/flight/' + item.ffltnr.slice(0, 2) + Number(item.ffltnr.slice(-4)).toString();
                if (this.isInFlight(item)) window.open(flightref, '_blank');
                return ''
            },
            isIrregular(status) {
                return util.isCanceled(status);
            },
            isBoarding(boardts, atd) {
                return util.isBoarding(boardts, atd);
            },
            formatDate(date) {
                return util.formatDayHours(date);
            },
            getHeaders(i) {
                return this.headers[i]['text'];
            }
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.timezone = this.$store.getters.timezone;
            this.dataAccess = new DataAccess(this.$msal);
            this.getOperationStatus('departures', this.hub);
            this.getPriorityFlights();
            this.getDepartures('departures', this.hub);
            this.timer = setInterval(function () {
                this.getOperationStatus('departures', this.hub);
                this.getDepartures('departures', this.hub);
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

    .style-actual-dark {
        vertical-align: middle;
        background-color: #37474F;
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

    .style-turnaround-red-dark {
        vertical-align: middle;
        background-color: #37474F;
        color: #F44336;
    }

    .style-turnaround-yellow {
        vertical-align: middle;
        background-color: #ECEFF1;
        color: #FFEB3B;
    }

    .style-turnaround-yellow-dark {
        vertical-align: middle;
        background-color: #37474F;
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

