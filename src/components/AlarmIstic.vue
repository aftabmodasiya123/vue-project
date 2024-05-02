<template>
    <v-app id="alarmistic">
        <v-container grid-list-md text-xs-center>
            <PieChart :stations="hub" :smalls="true" />
            <div class="ma-2 pa-2"></div>
            <v-container class="grey lighten-2">
                <v-row no-gutters class="ma-2 pa-2">
                    <v-col key="1" cols="12" md="12">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-h4 justify-center pa-0 ma-0">
                                Full System
                            </v-card-title>
                            <v-card-subtitle class="text-caption text-center pa-0 ma-0">
                                {{ formatNumberSystems() }}
                            </v-card-subtitle>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="100" :color="allSystemsColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters class="ma-2 pa-0 justify-center">
                    <v-col key="1" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-subtitle-2 justify-center pa-0 ma-0">
                                Flight Refresh
                            </v-card-title>
                            <v-card-subtitle class="text-caption text-center pa-0 ma-0">
                                {{ formatFlightRefresh() }}
                            </v-card-subtitle>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="flightRefreshColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="2" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-subtitle-2 justify-center pa-0 ma-0">
                                Baggage Messages
                            </v-card-title>
                            <v-card-subtitle class="text-caption text-center pa-0 ma-0">
                                {{ alarmistic.lastbag }}
                            </v-card-subtitle>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="baggageMessageColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="3" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-subtitle-2 justify-center pa-0 ma-0">
                                Passangers Messages
                            </v-card-title>
                            <v-card-subtitle class="text-caption text-center pa-0 ma-0">
                                {{ alarmistic.lastpax }}
                            </v-card-subtitle>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="paxMessageColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="4" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-subtitle-2 justify-center pa-0 ma-0">
                                Baggage Processing
                            </v-card-title>
                            <v-card-subtitle class="text-caption text-center pa-0 ma-0">
                                {{ alarmistic.lastinteg }}
                            </v-card-subtitle>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="baggageProcessingColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="5" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-subtitle-2 justify-center pa-0 ma-0">
                                Flight Processing
                            </v-card-title>
                            <v-card-subtitle class="text-caption text-center pa-0 ma-0">
                                {{ alarmistic.lastfltproc }}
                            </v-card-subtitle>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="flightProcessingColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters class="ma-8 pa-8 justify-center">
                    <v-col key="1" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-caption justify-center pa-0 ma-0">
                                FLT_INFO
                            </v-card-title>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="oldFlightColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="2" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-caption justify-center pa-0 ma-0">
                                BAGMSGS
                            </v-card-title>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="oldBagColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="3" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-caption justify-center pa-0 ma-0">
                                PAXMSGS
                            </v-card-title>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="oldPaxColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="4" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-caption justify-center pa-0 ma-0">
                                BAGINTEG
                            </v-card-title>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="oldBagIntegColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="5" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-caption justify-center pa-0 ma-0">
                                H2H
                            </v-card-title>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="oldH2HColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col key="6" cols="6" md="2">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-title class="text-caption justify-center pa-0 ma-0">
                                PTM_H2H
                            </v-card-title>
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon size="65" :color="oldD2DColor()">mdi-circle</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="1" class="text-caption ma-0 pa-0 text-center">
                        <v-card elevation="0"
                                shaped
                                tile
                                class="grey lighten-2">
                            <v-card-text class="text-center pa-1 ma-0">
                                <v-icon medium class="ma-0 pa-0" color="red darken-4" @click="cleanDB()">
                                    mdi-database-remove
                                </v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-container>
    </v-app>
</template>

<script>
    import PieChart from './PieChartPart.vue';
    import { Utils } from '../plugins/Utils';
    import { DataAccess } from '../plugins/DataAccess';

    const util = new Utils();

    export default {
        components: {
            PieChart,
        },
        data() {
            return {
                dataAccess: null,
                timezone: this.$store.getters.timezone,
                hub: this.$store.getters.hub,
                isMobile: false,
                allSwitch: false,
                alarmistic: {
                    "notatd": undefined,
                    "notata": undefined,
                    "firstatd": util.dateNull,
                    "firstata": util.dateNull,
                    "laststd": util.dateNull,
                    "lastbag": undefined,
                    "lastpax": undefined,
                    "lastinteg": undefined,
                    "lastfltproc": undefined,
                    "oldflt": util.dateNull,
                    "oldbag": util.dateNull,
                    "oldpax": util.dateNull,
                    "oldinteg": util.dateNull,
                    "oldh2h": util.dateNull,
                    "oldptm": util.dateNull
                }
            }
        },
        methods: {
            onResize() {
                if (window.innerWidth < 769)
                    this.isMobile = true;
                else
                    this.isMobile = false;
            },
            refreshData() {
                this.getAlarmistic('alarmistic');
            },
            getAlarmistic(id) {
                this.refresh = true;
                this.dataAccess.getAlarmistic(id).then((response) => {
                    this.alarmistic = response.data;
                });
            },
            cleanDB() {
                this.dataAccess.cleandb('alarmistic').then(() => {
                    this.refreshData();
                });
            },
            numberSystems() {
                var systems = 0;
                if (this.flightRefreshColor() !== util.green) systems++;
                if (this.baggageMessageColor() !== util.green) systems++;
                if (this.paxMessageColor() !== util.green) systems++;
                if (this.baggageProcessingColor() !== util.green) systems++;
                if (this.flightProcessingColor() !== util.green) systems++;
                if (this.oldFlightColor() !== util.green) systems++;
                if (this.oldBagColor() !== util.green) systems++;
                if (this.oldPaxColor() !== util.green) systems++;
                if (this.oldBagIntegColor() !== util.green) systems++;
                if (this.oldH2HColor() !== util.green) systems++;
                if (this.oldD2DColor() !== util.green) systems++;
                return systems;
            },
            allSystemsColor() {
                if (this.numberSystems() > 0) {
                    if (this.flightRefreshColor() === util.red) return util.red;
                    if (this.baggageMessageColor() === util.red) return util.red;
                    if (this.paxMessageColor() === util.red) return util.red;
                    if (this.baggageProcessingColor() === util.red) return util.red;
                    if (this.flightProcessingColor() === util.red) return util.red;
                    if (this.oldFlightColor() === util.red) return util.yellow;
                    if (this.oldBagColor() === util.red) return util.yellow;
                    if (this.oldPaxColor() === util.red) return util.yellow;
                    if (this.oldBagIntegColor() === util.red) return util.yellow;
                    if (this.oldH2HColor() === util.red) return util.yellow;
                    if (this.oldD2DColor() === util.red) return util.yellow;
                    if (this.flightRefreshColor() === util.yellow) return util.yellow;
                    if (this.baggageMessageColor() === util.yellow) return util.yellow;
                    if (this.paxMessageColor() === util.yellow) return util.yellow;
                    if (this.baggageProcessingColor() === util.yellow) return util.yellow;
                    if (this.flightProcessingColor() === util.yellow) return util.yellow;
                    if (this.oldFlightColor() === util.yellow) return util.yellow;
                    if (this.oldBagColor() === util.yellow) return util.yellow;
                    if (this.oldPaxColor() === util.yellow) return util.yellow;
                    if (this.oldBagIntegColor() === util.yellow) return util.yellow;
                    if (this.oldH2HColor() === util.yellow) return util.yellow;
                    if (this.oldD2DColor() === util.yellow) return util.yellow;
                }
                else return util.green;
            },
            flightRefreshColor() {
                if (this.alarmistic['notatd'] != undefined && this.alarmistic['notata'] != undefined) {
                    if (this.alarmistic['notatd'] > 0 && this.alarmistic['notata'] > 0) return util.red;
                    return util.green;
                }
            },
            baggageMessageColor() {
                if (this.alarmistic['lastbag'] != undefined) {
                    if (this.alarmistic['lastbag'] >= 0) return util.green;
                    if (this.alarmistic['lastbag'] > -10) return util.yellow;
                    return util.red;
                }
            },
            paxMessageColor() {
                if (this.alarmistic['lastpax'] != undefined) {
                    if (this.alarmistic['lastpax'] >= -60) return util.green;
                    if (this.alarmistic['lastpax'] > -120) return util.yellow;
                    return util.red;
                }
            },
            baggageProcessingColor() {
                if (this.alarmistic['lastinteg'] != undefined) {
                    if (this.alarmistic['lastinteg'] >= 0) return util.green;
                    if (this.alarmistic['lastinteg'] > -10) return util.yellow;
                    return util.red;
                }
            },
            flightProcessingColor() {
                if (this.alarmistic['lastfltproc'] != undefined ) {
                    if (this.alarmistic['lastfltproc'] >= 0) return util.green;
                    if (this.alarmistic['lastfltproc'] > -10) return util.yellow;
                    return util.red;
                }
            },
            oldFlightColor() {
                var now = new Date();
                if (this.alarmistic['oldflt'] != undefined && this.alarmistic['oldflt'] != util.dateNull) {
                    let aux = util.convertTZ(this.alarmistic['oldflt'], this.timezone);
                    var diffMs = (now - aux);
                    var diffMins = Math.floor(diffMs / 86400000);
                    if (diffMins > 35) return util.red;
                    if (diffMins > 30) return util.yellow;
                    return util.green;
                }
            },
            oldBagColor() {
                var now = new Date();
                if (this.alarmistic['oldbag'] != undefined && this.alarmistic['oldbag'] != util.dateNull) {
                    let aux = util.convertTZ(this.alarmistic['oldbag'], this.timezone);
                    var diffMs = (now - aux);
                    var diffMins = Math.floor(diffMs / 86400000);
                    if (diffMins > 15) return util.red;
                    if (diffMins > 7) return util.yellow;
                    return util.green;
                }
            },
            oldPaxColor() {
                var now = new Date();
                if (this.alarmistic['oldpax'] != undefined && this.alarmistic['oldpax'] != util.dateNull) {
                    let aux = util.convertTZ(this.alarmistic['oldpax'], this.timezone);
                    var diffMs = (now - aux);
                    var diffMins = Math.floor(diffMs / 86400000);
                    if (diffMins > 15) return util.red;
                    if (diffMins > 7) return util.yellow;
                    return util.green;
                }
            },
            oldBagIntegColor() {
                var now = new Date();
                if (this.alarmistic['oldinteg'] != undefined && this.alarmistic['oldinteg'] != util.dateNull) {
                    let aux = util.convertTZ(this.alarmistic['oldinteg'], this.timezone);
                    var diffMs = (now - aux);
                    var diffMins = Math.floor(diffMs / 86400000);
                    if (diffMins > 15) return util.red;
                    if (diffMins > 7) return util.yellow;
                    return util.green;
                }
            },
            oldH2HColor() {
                var now = new Date();
                if (this.alarmistic['oldh2h'] != undefined && this.alarmistic['oldh2h'] != util.dateNull) {
                    let aux = util.convertTZ(this.alarmistic['oldh2h'], this.timezone);
                    var diffMs = (now - aux);
                    var diffMins = Math.floor(diffMs / 86400000);
                    if (diffMins > 15) return util.red;
                    if (diffMins > 7) return util.yellow;
                    return util.green;
                }
            },
            oldD2DColor() {
                var now = new Date();
                if (this.alarmistic['oldptm'] != undefined && this.alarmistic['oldptm'] != util.dateNull) {
                    let aux = util.convertTZ(this.alarmistic['oldptm'], this.timezone);
                    var diffMs = (now - aux);
                    var diffMins = Math.floor(diffMs / 86400000);
                    if (diffMins > 15) return util.red;
                    if (diffMins > 7) return util.yellow;
                    return util.green;
                }
            },
            formatDate(dt) {
                if (dt != undefined && dt != util.dateNull) return util.formatDayHours(dt);
                else return ""
            },
            formatFlightRefresh() {
                var output = ""
                if (this.alarmistic.firstatd != undefined && this.alarmistic.firstatd != util.dateNull)
                    output += this.formatDate(this.alarmistic.firstatd)
                else
                    output += "Ok";
                output += " - ";
                if (this.alarmistic.firstata != undefined && this.alarmistic.firstata != util.dateNull)
                    output += this.formatDate(this.alarmistic.firstata);
                else
                    output += "Ok";
                return output;  
            },
            formatNumberSystems() {
                if (this.alarmistic.laststd != undefined && this.alarmistic.laststd != util.dateNull)
                    return this.numberSystems() + " / 11 [" + this.formatDate(this.alarmistic.laststd) + "]";
                else
                    return this.numberSystems() + " / 11 ";
        }
        },
        mounted() {
            this.dataAccess = new DataAccess(this.$msal);
            this.refreshData();
            this.timer = setInterval(function () {
                this.refreshData();
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
        background-color: #B0BEC5;
    }

    .style {
        vertical-align: middle;
    }

    .style-principal {
        vertical-align: middle;
        background-color: #ECEFF1;
        border-left-color: #F44336;
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



