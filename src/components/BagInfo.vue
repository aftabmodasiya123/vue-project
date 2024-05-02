<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="3">
                    <a @click="$router.go(-1)"><strong>BACK</strong></a> / <strong>MESSAGE</strong>
                </v-col>
            </v-row>
            <v-row no-gutters class="justify-space-around ma-2 pa-1">
                <v-col>
                    <v-card v-for="(msg, index) in items" v-bind:key="index" elevation="2" class="ma-2 pa-2">
                        <v-layout row wrap>
                            <v-flex x12 sm4>
                                <div class="text-caption">SMI: <strong>{{ formatNull(msg.smi) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">SLMI: <strong>{{ formatNull(msg.slmi) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Status Ind: <strong>{{ formatNull(msg.statusindicator) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Bag Irreg: <strong>{{ formatNull(msg.birreg) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Corporate Grp: <strong>{{ formatNull(msg.ccorp) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Remote Loc: <strong>{{ formatNull(msg.dremoteloc) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Baggage Exception: <strong>{{ formatNull(msg.eexcep) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Outbound Flight: <strong>{{ msg.ffltnr }}&nbsp;{{ formatDate(msg.fdate) }}&nbsp;{{ msg.fdest }}&nbsp;{{ msg.fclass }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Handling Location: <strong>{{ formatNull(msg.hhandterm) }}&nbsp;{{ msg.hhandbay }}&nbsp;{{ msg.hhandstdgte }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Inbound Flight: <strong>{{ msg.ifltnr }}&nbsp;{{ formatDate(msg.idate) }}&nbsp;{{ msg.iorigin }}&nbsp;{{ msg.iclass }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Processing Inf: <strong>{{ formatNull(msg.jreco) }}&nbsp;{{ msg.jagentid }}&nbsp;{{ msg.jscanid }}&nbsp;{{ msg.jreadloc }}&nbsp;{{ msg.jsentloc }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Message Printer: <strong>{{ formatNull(msg.kdmp) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">PNR: <strong>{{ formatNull(msg.lpnr) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Bag: <strong>{{ msg.nbagtag }}&nbsp;{{ msg.nnrtags }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Onwards Flight: <strong>{{ msg.ofltnr }}&nbsp;{{ formatDate(msg.odate) }}&nbsp;{{ msg.odest }}&nbsp;{{ msg.oclass }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Passenger: <strong>{{ formatNull(msg.ppaxname) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Airline: <strong>{{ formatNull(msg.rinternal) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Reconciliation: <strong>{{ formatBSM(formatNull(msg.sautl)) }}&nbsp;{{ msg.sseat }}&nbsp;{{ formatPAXStatus(msg.spaxck) }}&nbsp;{{ msg.spaxprof }}&nbsp;{{ formatProcessed(msg.sauttrans) }}&nbsp;{{ msg.sbagstatus }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Bag Tag: <strong>{{ formatNull(msg.ttagprinterid) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Loading: <strong>{{ formatNull(msg.uuld) }}&nbsp;{{ msg.ucompt }}&nbsp;{{ msg.utypeofbag }}&nbsp;{{ msg.udestcontainer }}&nbsp;{{ msg.uconttype }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Version: <strong>{{ formatNull(msg.vbagsourcind) }}&nbsp;{{ msg.vcity }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Pieces and Weight: <strong>{{ formatNull(msg.wpwindicator) }}&nbsp;{{ msg.wnrckbags }}&nbsp;{{ msg.wtotk }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Security: <strong>{{ formatNull(msg.xsecurity) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">FQTV: <strong>{{ formatNull(msg.yfqtv) }}</strong></div>
                            </v-flex>
                            <v-flex x12 sm4>
                                <div class="text-caption">Timestamp: <strong>{{ msg.timestamp }}</strong></div>
                            </v-flex>
                        </v-layout>
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
                search: "",
                itemsPerPage: 50,
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
            getBagInfo(id, bagnr) {
                try {
                    this.dataAccess.getBagInfo(id, bagnr).then((response) => {
                        this.items = [];
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            formatDate(column) {
                util.formatDayHours(column);
            },
            formatBSM(column) {
                if (column === 'Y') return 'Autorized';
                else if (column === 'N') return 'Not Autorized';
                else return '';
            },
            formatNull(column) {
                if ((!column || 0 === column.length)) return "-"
                else return column
            },
            formatProcessed(column) {
                if (column === 'Y') return 'Processed';
                else if (column === 'N') return 'Not Processed';
                else return '';
            },
            formatPAXStatus(column) {
                if (column === 'B') return 'Boarded';
                else if (column === 'N') return 'Not Boarded'
                else if (column === 'C') return 'Check-In'
                else if (column === 'S') return 'Standby'
                else return column;
            }
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.dataAccess = new DataAccess(this.$msal);
            this.getBagInfo('baginfo', this.bagnr);
            this.timer = setInterval(function () {
                this.getBagInfo('baginfo', this.bagnr);
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
</style>

