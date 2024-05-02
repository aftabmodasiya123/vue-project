<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="3" sm="3">
                    <strong v-if="flightid == undefined">PAX DOOR TO DOOR </strong>
                    <div v-else><a @click="$router.go(-1)"><strong>BACK</strong></a> / <strong>{{ formatFlight(flight) }}</strong></div>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="8" sm="5">
                    <v-card elevation="4">
                        <v-card-text class="caption active">
                            <v-row no-gutters class="justify-space-around ma-0 pa-0">
                                <v-col md="6">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon color="amber">mdi-alert</v-icon>
                                            </span>
                                        </template>
                                        <span> Flights / Passengers</span>
                                    </v-tooltip>
                                    Risk Missing Connection <strong>{{ calculateRisk().flights }} / {{ calculateRisk().pax }}</strong>
                                </v-col>
                                <v-col md="6">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon color="deep-orange darken-4">mdi-close-octagon</v-icon>
                                            </span>
                                        </template>
                                        <span> Flights / Passengers</span>
                                    </v-tooltip>
                                    Will Missing Connection <strong>{{ calculateMiss().flights }} / {{ calculateMiss().pax }}</strong>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="3">
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
                                      disable-sort
                                      :hide-default-header="isMobile" 
                                      class="ma-0 pa-0">
                            <template v-for="(h, index) in headers" v-slot:[`header.${h.value}`]="{ header }" :key="index">
                                <v-tooltip bottom v-bind:key="index">
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">{{ header.text }}</span>
                                    </template>
                                    <span>{{ header.tip }}</span>
                                </v-tooltip>
                            </template>
                            <template #item="{ item }">
                                <tr v-if="!isMobile">
                                    <td class="text-caption" align="left">{{ formatFlightInbound(item) }}</td>
                                    <td class="text-caption" align="center">{{ item.iorigin }}</td>
                                    <td class="text-caption" align="center">{{ item.stand }}</td>
                                    <td class="text-caption" align="center">{{ formatBTA(item) }}</td>
                                    <td class="text-caption" align="right">{{ item.sec }}</td>
                                    <td :class="(darkMode == true) ? 'style-principal-dark text-caption' : 'style-principal text-caption'"  align="center">{{ item.hub }}</td>
                                    <td :class="(darkMode == true) ? 'style-principal-dark text-caption' : 'style-principal text-caption'"  align="center">
                                        <v-icon medium
                                                class="ma-0 pa-0" :color="formatPT(item)">
                                            {{ formatIcon(formatPT(item)) }}
                                        </v-icon>
                                    </td>
                                    <td class="text-caption" align="left">
                                        <router-link :to="formatHRefOutbound(item)">{{ formatFlightOutbound(item) }}</router-link>
                                    </td>
                                    <td class="text-caption" align="center">{{ item.odest }}</td>
                                    <td class="text-caption" align="center">{{ item.gate }}</td>
                                    <td class="text-caption" align="center">{{ formatDate(item.etg) }}</td>
                                    <td class="text-caption" align="center">{{ formatDate(item.etcg) }}</td>
                                    <td class="text-caption" align="center">{{ formatBTD(item) }}</td>
                                    <td class="text-caption" align="right">{{ item.business }}</td>
                                    <td class="text-caption" align="right">{{ item.economy }}</td>
                                    <td class="text-caption" align="center">{{ item.status }}</td>
                                </tr>
                                <tr v-else>
                                    <td>
                                        <v-list-item-group class="d-flex justify-space-around flex-wrap pa-0 ma-0">
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(0)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatFlightInbound(item)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(1)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.iorigin"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(2)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.stand"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(3)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatBTA(item)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(4)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.sec"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(5)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.hub"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">Connectivity</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-icon medium
                                                            class="ma-0 pa-0" :color="formatPT(item)">
                                                        {{ formatIcon(formatPT(item)) }}
                                                    </v-icon>
                                                </v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(7)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <router-link :to="formatHRefOutbound(item)">{{ formatFlightOutbound(item) }}</router-link>
                                                </v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(8)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.odest"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(9)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.gate"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(10)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatDate(item.etg)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(11)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatDate(item.etcg)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(12)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatBTD(item)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(13)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.business"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(14)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.economy"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(15)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.status"></v-list-item-title>
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
                flightid: this.$route.params.flightId,
                flight: {
                    operator: '',
                    flt_nr: '',
                    std: '',
                    to_iata: '',
                },
                hub: this.$store.getters.hub,
                darkMode: this.$store.getters.darkMode,
                search: "",
                rules: {
                    ltyellow: '',
                    ltred: '',
                    arrivbagmavg: '',
                    otpyellow: '',
                    mct: '',
                    cfyellow: '',
                    cfred: '',
                    depbagmlimite: '',
                    depbagmred: '',
                    ptyellow: '',
                    ptred: '',
                    h2hyellow: '',
                    h2hred: '',
                    doorclosealert: '',
                    minstartboard: ''
                },
                headers: [
                    {
                        text: 'Flt Nr',
                        align: 'left',
                        value: 'ifltnr',
                        tip: 'Arrival Flight Number'
                    },
                    {
                        text: 'Origin',
                        align: 'center',
                        value: 'iorigin',
                        tip: 'Arrival Flight Origin'
                    },
                    {
                        text: 'Stand',
                        align: 'center',
                        value: 'stand',
                        tip: 'Arrival Flight Stand'
                    },
                    {
                        text: 'BTA',
                        align: 'center',
                        value: 'ieta',
                        tip: 'Best Time of Arrival'
                    },
                    {
                        text: 'Sec',
                        align: 'center',
                        value: 'sec',
                        tip: 'Time passengers takes door to door'
                    },
                    {
                        text: 'Time Left',
                        align: 'center',
                        value: 'hub',
                        tip: 'Time left for passengers door to door between inbound and outbound flight'
                    },
                    {
                        text: '',
                        align: 'center',
                        value: '',
                        tip: ''
                    },
                    {
                        text: 'Flr Nr',
                        align: 'left',
                        value: 'ofltnr',
                        tip: 'Departure Flight Number'
                    },
                    {
                        text: 'To',
                        align: 'center',
                        value: 'odest',
                        tip: 'Departure Flight Destination'
                    },
                    {
                        text: 'Gate',
                        align: 'center',
                        value: 'gate',
                        tip: 'Departure Flight Stand'
                    },
                    {
                        text: 'ETG',
                        align: 'center',
                        value: 'etl',
                        tip: 'Passegners Estimated Time to Gate'
                    },
                    {
                        text: 'ETCG',
                        align: 'center',
                        value: 'etl',
                        tip: 'Estimated Time to Close Gate'
                    },
                    {
                        text: 'BTD',
                        align: 'center',
                        value: 'etd',
                        tip: 'Estimated Time of Departure'
                    },
                    {
                        text: 'Bus',
                        align: 'center',
                        value: 'business',
                        tip: 'Number of Passengers in Business'
                    },
                    {
                        text: 'Eco',
                        align: 'center',
                        value: 'economy',
                        tip: 'Number of passengers in Economy'
                    },
                    {
                        text: 'Status',
                        align: 'center',
                        value: 'economy',
                        tip: 'Passenger Reservation Status'
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
            getD2D(id, hub) {
                try {
                    this.dataAccess.getD2D(id, hub, this.flightid).then((response) => {
                        this.items = [];
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            getRules(id, hub) {
                try {
                    this.dataAccess.getRules(id, hub).then((response) => {
                        let data = response.data[0].fields;
                        this.rules.ltyellow = data.ltyellow;
                        this.rules.ltred = data.ltred;
                        this.rules.arrivbagmavg = data.arrivbagmavg;
                        this.rules.otpyellow = data.otpyellow;
                        this.rules.mct = data.mct;
                        this.rules.cfyellow = data.cfyellow;
                        this.rules.cfred = data.cfred;
                        this.rules.depbagmlimite = data.depbagmlimite;
                        this.rules.depbagmred = data.depbagmred;
                        this.rules.ptyellow = data.ptyellow;
                        this.rules.ptred = data.ptred;
                        this.rules.h2hyellow = data.h2hyellow;
                        this.rules.h2hred = data.h2hred;
                        this.rules.doorclosealert = data.doorclosealert;
                        this.rules.minstartboard = 5;
                    })
                } catch (error) {
                    this.rules.ltyellow = '';
                    this.rules.ltred = '';
                    this.rules.arrivbagmavg = '';
                    this.rules.otpyellow = '';
                    this.rules.mct = '';
                    this.rules.cfyellow = '';
                    this.rules.cfred = '';
                    this.rules.depbagmlimite = '';
                    this.rules.depbagmred = '';
                    this.rules.ptyellow = '';
                    this.rules.ptred = '';
                    this.rules.h2hyellow = '';
                    this.rules.h2hred = '';
                    this.rules.doorclosealert = '';
                    this.rules.minstartboard = '';
                }
            },
            getStatusColor(ratio) {
                return util.getStatusColor(ratio);
            },
            formatDate(date) {
                return util.formatDayHours(date);
            },
            formatBTA(item) {
                if (item.ista == null) return '';
                if (item.iata != dateNull) return util.formatDayHours(item.iata) + 'A';
                if (item.ieta != dateNull && item.ieta != item.ista) return util.formatDayHours(item.ieta) + 'E';
                return util.formatDayHours(item.ista);
            },
            formatBTD(item) {
                if (item.ostd == null) return '';
                if (item.oatd != dateNull) return util.formatDayHours(item.oatd) + 'A';
                if (item.oetd != dateNull && item.oetd != item.ostd) return util.formatDayHours(item.oetd) + 'E';
                return util.formatDayHours(item.ostd);
            },
            formatHRefInbound(item) {
                return '/bagsflight/' + item.ifltinfoid;
            },
            formatHRefOutbound(item) {
                return '/bagsflight/' + item.ofltinfoid;
            },
            formatFlightInbound(item) {
                return item.ifltnr + ' ' + this.formatDate(item.istd);
            },
            formatFlightOutbound(item) {
                return item.ofltnr + ' ' + this.formatDate(item.ostd);
            },
            formatFlight(flight) {
                if (flight.operator != null && flight.operator != '') {
                    return util.formatFlight(flight.operator, flight.flt_nr) + ' ' + flight.to_iata + ' ' + util.formatDate(flight.std) + ' ' + this.formatBTD(flight);
                }
                else {
                    return '';
                }
            },
            formatPT(item) {
                return util.formatPT(item.hub, this.rules);
            },
            formatIcon(color) {
                return util.formatIcon(color);
            },
            calculate(color) {
                var calc = {
                    flights: 0,
                    pax: 0
                };
                for (var i in this.items) {
                    if (this.formatPT(this.items[i]) == color) {
                        calc.flights += 1;
                        calc.pax += this.items[i].business + this.items[i].economy;
                    }
                }
                return calc;
            },
            calculateRisk() {
                return this.calculate(util.yellow);
            },
            calculateMiss() {
                return this.calculate(util.red);
            },
            getFlight(id, flightid) {
                if (flightid != undefined) {
                    try {
                        this.dataAccess.getFlight(id, flightid).then((response) => {
                            this.flight = response.data[0]['fields'];
                        })
                    } catch (error) {
                        this.items = [];
                    }
                }
            },
            getHeaders(i) {
                return this.headers[i]['text'];
            }
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.dataAccess = new DataAccess(this.$msal);
            this.getRules('d2d', this.hub);
            this.getD2D('d2d', this.hub);
            this.getFlight('h2h', this.flightid);
            this.timer = setInterval(function () {
                this.getRules('d2d', this.hub);
                this.getD2D('d2d', this.hub);
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

    .style-principal-dark {
        vertical-align: middle;
        background-color: #37474F;
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

