<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="3" sm="3">
                    <strong v-if="flightid == undefined">HULL TO HULL </strong>
                    <div v-else><a @click="$router.go(-1)"><strong>BACK</strong></a> / <strong>{{ formatFlight(flight) }}</strong></div>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="8" sm="5">
                    <v-card elevation="4">
                        <v-card-text class="caption active">
                            <v-row no-gutters class="justify-space-around ma-0 pa-0">
                                <v-col sm="6">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon color="amber">mdi-alert</v-icon>
                                            </span>
                                        </template>
                                        <span> Flights / Bags</span>
                                    </v-tooltip>
                                    Risk Missing Connection <strong>{{ calculateRisk().flights }} / {{ calculateRisk().bags }}</strong>
                                </v-col>
                                <v-col sm="6">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon color="deep-orange darken-4">mdi-close-octagon</v-icon>
                                            </span>
                                        </template>
                                        <span> Flights / Bags</span>
                                    </v-tooltip>
                                    Will Missing Connection <strong>{{ calculateMiss().flights }} / {{ calculateMiss().bags }}</strong>
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
                    <v-layout v-resize="onResize" child-flex class="table-container">
                        <v-data-table dense
                                      :headers="headers"
                                      :items="items"
                                      :search="search"
                                      hide-default-footer
                                      disable-pagination
                                      disable-sort
                                      :hide-default-header="isMobile"
                                      class="ma-0 pa-0  flex-table"
                                      fixed-header
                                      >
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
                                    <td class="text-caption" align="center">{{ item.istand }}</td>
                                    <td class="text-caption" align="center">{{ formatBTA(item) }}</td>
                                    <td class="text-caption" align="center">-</td>
                                    <td class="text-caption" align="center">{{ formatDate(item.etu) }}</td>
                                    <td class="text-caption" align="right">{{ item.inrbags }}</td>
                                    <td :class="(darkMode == true) ? 'style-principal-dark text-caption' : 'style-principal text-caption'" align="center">{{ item.hub }}</td>
                                    <td :class="(darkMode == true) ? 'style-principal-dark text-caption' : 'style-principal text-caption'" align="center">
                                        <v-icon medium
                                                class="ma-0 pa-0" :color="formatH2H(item)">
                                            {{ formatIcon(formatH2H(item)) }}
                                        </v-icon>
                                    </td>
                                    <td class="text-caption" align="left">
                                        <router-link :to="formatHRefOutbound(item)">{{ formatFlightOutbound(item) }}</router-link>
                                    </td>
                                    <td class="text-caption" align="center">{{ item.odest }}</td>
                                    <td class="text-caption" align="center">{{ item.ostand }}</td>
                                    <td class="text-caption" align="right">{{ item.olnrbags }}</td>
                                    <td class="text-caption" align="center">{{ formatDate(item.etl) }}</td>
                                    <td class="text-caption" align="center">{{ formatBTD(item) }}</td>
                                    <td class="text-caption" align="center">-</td>
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
                                                <v-list-item-title class="flex-content text-caption" v-text="item.istand"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(3)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatBTA(item)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(4)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">-</v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(5)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatDate(item.etu)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(6)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.inrbags"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(7)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.hub"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption">Connectivity</v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-icon medium
                                                            class="ma-0 pa-0" :color="formatH2H(item)">
                                                        {{ formatIcon(formatH2H(item)) }}
                                                    </v-icon>
                                                </v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(9)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <router-link :to="formatHRefOutbound(item)">{{ formatFlightOutbound(item) }}</router-link>
                                                </v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(10)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.odest"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(11)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.ostand"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(12)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.olnrbags"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(13)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatDate(item.etl)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(14)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatBTD(item)"></v-list-item-title>
                                            </v-col>
                                            <v-col cols="4" class="mx-0 my-1 pa-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(15)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">-</v-list-item-title>
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
                        value: 'istand',
                        tip: 'Arrival Flight Stand'
                    },
                    {
                        text: 'BTA',
                        align: 'center',
                        value: 'ieta',
                        tip: 'Best Time of Arrival'
                    },
                    {
                        text: 'HO',
                        align: 'center',
                        value: 'hullopen',
                        tip: 'Hull Open'
                    },
                    {
                        text: 'ETU',
                        align: 'center',
                        value: 'etu',
                        tip: 'Estimated Time to Unload Bags'
                    },
                    {
                        text: 'NB',
                        align: 'right',
                        value: 'inrbags',
                        tip: 'Number of Transfer Bags'
                    },
                    {
                        text: 'Time Left',
                        align: 'center',
                        value: 'hub',
                        tip: 'Time left for baggage hull to hull between inbound and outbound flight'
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
                        text: 'Stand',
                        align: 'center',
                        value: 'ostand',
                        tip: 'Departure Flight Stand'
                    },
                    {
                        text: 'Local',
                        align: 'right',
                        value: 'olnrbags',
                        tip: 'Number of Local Bags'
                    },
                    {
                        text: 'ETL',
                        align: 'center',
                        value: 'etl',
                        tip: 'Estimated Time to Load Bags'
                    },
                    {
                        text: 'BTD',
                        align: 'center',
                        value: 'etd',
                        tip: 'Estimated Time of Departure'
                    },
                    {
                        text: 'HC',
                        align: 'center',
                        value: 'hullclose',
                        tip: 'Hull Close'
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
            getH2H(id, hub) {
                try {
                    this.dataAccess.getH2H(id, hub, this.flightid).then((response) => {
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
            formatH2H(item) {
                return util.formatH2H(item.hub, this.rules);
            },
            formatIcon(color) {
                return util.formatIcon(color);
            },
            calculate(color) {
                var calc = {
                    flights: 0,
                    bags: 0
                };
                for (var i in this.items) {
                    if (this.formatH2H(this.items[i]) == color) {
                        calc.flights += 1;
                        calc.bags += this.items[i].inrbags;
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
            this.getRules('h2h', this.hub);
            this.getH2H('h2h', this.hub);
            this.getFlight('h2h', this.flightid);
            this.timer = setInterval(function () {
                this.getRules('h2h', this.hub);
                this.getH2H('h2h', this.hub);
            }.bind(this), 30000);
        },
        beforeUnmount() {
            clearInterval(this.timer);
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    ::v-deep ::-webkit-scrollbar {
      width: 7px;
      background: #dfdfdf;
      border-radius:5px;
    }
    ::v-deep ::-webkit-scrollbar-thumb {
      background: #888; 
      border-radius: 5px;
    }
    .table-container {
        max-height:90vh;
        overflow-y: hidden;
    }
    .flex-table {
        display: flex;
    }
    ::v-deep .flex-table > div{
        width: 100%;
    }
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

