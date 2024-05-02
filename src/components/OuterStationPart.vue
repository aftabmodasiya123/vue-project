<template>
    <div>
        <v-row v-if="messages != 'No messages'" no-gutters dense class="pa-1 ma-0" justify="start">
            <v-col md="12" id="scroll-container">
                <v-col id="scroll-text">
                    {{ messages }}
                </v-col>
            </v-col>
        </v-row>
        <v-row no-gutters class="pa-1 ma-0">
            <v-spacer></v-spacer>
            <v-col md="1" class="text-right">
                <v-icon @click="openMessageDialog()">mdi-message-reply-text</v-icon>
            </v-col>
        </v-row>
        <v-row no-gutters class="pa-1 ma-0" justify="start">
            <v-col cols="11">
                <v-combobox 
                    dense
                    multiple
                    label="Stations"
                    :items="itemsStation"
                    v-model="outerstations"
                    ></v-combobox>
            </v-col>
            <v-col md="1" class="text-right">
                <v-btn @click="clearStations()" class="mx-2" dense>Default</v-btn>
            </v-col>
        </v-row>
        <v-row no-gutters class="pa-1 ma-0" justify="start">
            <v-col cols="12" sm="1">
                <v-text-field dense
                              color="#B71C1C"
                              v-model="search"
                              append-icon="mdi-magnify"
                              label="Search"
                              single-line
                              hide-details></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="4" sm="3" class="text-center">
                <strong>ARRIVALS </strong><v-icon color="#FFD600">mdi-airplane-landing</v-icon>
            </v-col>
            <v-col cols="4" sm="2" class="justify-space-around text-caption">
                <v-icon medium class="ma-0 pa-0" color="red darken-4" v-if="refresh">
                    mdi-web
                </v-icon><span v-if="refresh" class="red--text text--darken-4">Loading...</span>
            </v-col>
            <v-col cols="4" sm="3"  class="text-center">
                <strong>DEPARTURES </strong><v-icon color="#1A237E">mdi-airplane-takeoff</v-icon>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="1" sm="1" class="mt-n3 mb-1">
                <v-switch v-model="history"
                          label="Day History"
                          color="red darken-3"
                          dense
                          hide-details></v-switch>
            </v-col>
        </v-row>
        <v-row no-gutters
               class="justify-space-around">
            <v-col cols="12">
                <v-layout v-resize="onResize" child-flex>
                    <v-data-table 
                                dense
                                  :headers="headers"
                                  :items="items"
                                  :search="search"
                                  fixed-header
                                  hide-default-footer
                                  disable-pagination
                                  :hide-default-header="isMobile"
                                  class="outerstations ma-0 pa-0">
                        <template #item="{ item }">
                            <tr>
                                <td :class="getTurnaroundClass(item)" align="center"><strong>{{ formatTurnaroundText(item) }}</strong></td>
                                <td :class="getBaseClass()" align="left">{{ formatAC(item) }}</td>
                                <td :class="getClass(item)" align="left">
                                    <a @click="openMessagesFlightDialog(item.arrivals)">{{ formatArrFlight(item) }}</a>
                                    <v-btn v-if="item.arrivals != null" class="mr-0" text icon color="blue-grey lighten-4"
                                            @click="openFlightTotals(item, 'A')">
                                        <v-icon small :color="(darkMode == true) ? '' : 'blue-grey darken-4'">mdi-chart-box</v-icon>
                                    </v-btn>
                                    <v-icon small class="ma-0 pa-0" v-if="isArrInFlight(item)" @click="flightArrRef(item)">mdi-airplane</v-icon>
                                    <v-tooltip bottom v-if="isArrIrregular(item)">
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon small class="ma-0 pa-0" v-if="isArrIrregular(item)">mdi-alert</v-icon>
                                            </span>
                                        </template>
                                        <span> {{ item.arr_status }}</span>
                                    </v-tooltip>
                                </td>
                                <td :class="getArrClass(item)" align="center">
                                    {{ formatSTA(item) }}
                                </td>
                                <td :class="getArrClass(item)" align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                {{ formatBTA(item) }}
                                            </span>
                                        </template>
                                        <span>{{ getBTAText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                <td :class="getArrClass(item)" align="center">
                                    <v-tooltip  v-if="item.arr_sta != null" bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon small
                                                        class="mr-1" :color="formatLT(item)">
                                                    {{ formatIcon(formatLT(item)) }}
                                                </v-icon>
                                            </span>
                                        </template>
                                        <span>{{ getLTText(item) }}</span>
                                    </v-tooltip>
                                    <v-tooltip  v-if="item.arrivals != null && item.arrivals_delays != null && item.arrivals_delays.length > 0" bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon small
                                                        class="ml-1" :color="(darkMode == true) ? '' : 'blue-grey darken-4'">
                                                    mdi-history
                                                </v-icon>
                                            </span>
                                        </template>
                                        <span class="line-break-span">{{ getDelayText(item.arrivals_delays) }}</span>
                                    </v-tooltip>
                                    <v-icon small v-else-if="item.arrivals != null"
                                            class="mr-0" color="blue-grey lighten-4">
                                        mdi-history
                                    </v-icon>
                                </td>
                                <td :class="getPDOClass(item)" v-if="item.arrivals == null" align="center"></td>
                                <td :class="getPDOClass(item)" v-else-if="item.arr_ata == null" align="center"></td>
                                <td :class="getPDOClass(item)" v-else-if="item.arr_pdo == null && item.arr_pdc == null" align="center">
                                    <v-icon small
                                            class="ma-0 pa-0" 
                                            :color="getPDOColor(item)">
                                        {{ formatIcon(getPDOColor(item)) }}
                                    </v-icon>
                                </td>
                                <td :class="getPDOClass(item)" v-else-if="item.arr_pdo != null && item.arr_pdc == null" align="center">
                                    {{ formatPDO(item) }} /
                                    <v-icon small
                                            class="ma-0 pa-0" 
                                            :color="getCDOColor(item)">
                                        {{ formatIcon(getCDOColor(item)) }}
                                    </v-icon>
                                </td>
                                <td :class="getPDOClass(item)" v-else-if="item.arr_pdo == null && item.arr_pdc != null" align="center">
                                    <v-icon small
                                            class="ma-0 pa-0" 
                                            :color="getPDOColor(item)">
                                        {{ formatIcon(getPDOColor(item)) }}
                                    </v-icon> / {{ formatCDO(item) }}
                                </td>
                                <td :class="getPDOClass(item)" v-else align="center">
                                    {{ formatPDO(item) }} / {{ formatCDO(item) }}
                                </td>
                                <td :class="getArrClass(item)" align="center">{{ item.arr_from }}</td>
                                <td :class="getBaseClass()" align="center">
                                    {{ item.hub }}
                                    <v-tooltip  bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon small
                                                    @click="openContacts(item.hub)"
                                                        class="mr-0" :color="(darkMode == true) ? '' : 'blue-grey darken-4'">
                                                    mdi-cellphone-basic
                                                </v-icon>
                                            </span>
                                        </template>
                                        <span>{{ item.contact }}</span>
                                    </v-tooltip>
                                </td>
                                <td :class="getDepClass(item)" align="center">{{ item.dep_to }}</td>
                                <td :class="getDepClass(item)" align="left">
                                    <a @click="openMessagesFlightDialog(item.arrivals)">{{ formatDepFlight(item) }}</a>
                                    <v-btn v-if="item.departures != null" 
                                            class="mr-0" text icon color="blue-grey lighten-4"
                                            @click="openFlightTotals(item, 'D')">
                                        <v-icon small :color="(darkMode == true) ? '' : 'blue-grey darken-4'">mdi-chart-box</v-icon>
                                    </v-btn>
                                    <v-icon small class="ma-0 pa-0" v-if="isDepInFlight(item)" @click="flightDepRef(item)">mdi-airplane</v-icon>
                                    <v-tooltip bottom v-if="isDepIrregular(item)">
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon small class="ma-0 pa-0" v-if="isDepIrregular(item)">mdi-alert</v-icon>
                                            </span>
                                        </template>
                                        <span> {{ item.dep_status }}</span>
                                    </v-tooltip>
                                </td>
                                <td :class="getDepClass(item)" align="center">
                                    {{ formatSTD(item) }}
                                </td>
                                <td :class="getDepClass(item)" align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                {{ formatBTD(item) }}
                                            </span>
                                        </template>
                                        <span>{{ getBTDText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                <td :class="getDepClass(item)" align="center">
                                    <v-tooltip  v-if="item.departures != null && item.departures_delays != null && item.departures_delays.length > 0" bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                <v-icon small
                                                        class="mr-0" :color="(darkMode == true) ? '' : 'blue-grey darken-4'">
                                                    mdi-history
                                                </v-icon>
                                            </span>
                                        </template>
                                        <span class="line-break-span">{{ getDelayText(item.departures_delays) }}</span>
                                    </v-tooltip>
                                    <v-icon small v-else-if="item.departures != null"
                                            class="mr-0" color="blue-grey lighten-4">
                                        mdi-history
                                    </v-icon>
                                </td>
                                <td :class="getDepClass(item)" v-if="item.dep_startbrdng == null && !shouldHaveStartBoarding(item)" align="center"></td>
                                <td :class="getDepClass(item)" v-else-if="item.dep_startbrdng == null && shouldHaveStartBoarding(item)" align="center">
                                    {{ getStartBoardingColor(item) }}<v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon small v-on="on"
                                                    class="ma-0 pa-0" :color="getStartBoardingColor(item)">
                                                {{ formatIcon(getStartBoardingColor(item)) }}
                                            </v-icon>
                                        </template>
                                        <span>{{ getStartBoardingText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                <td :class="getDepClass(item)" v-else align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <div v-if="item.dep_paxaut == item.dep_paxboard">
                                                {{ formatStartBoardingText(item) }} / {{ formatEndBoardingText(item) }}
                                            </div>
                                            <div v-on="on" v-else>
                                                {{ formatStartBoardingText(item) }}
                                                &nbsp;
                                                <v-progress-circular size="19" width="6" 
                                                    :value="formatPercentage(item.dep_paxboard, item.dep_paxaut)"
                                                    :color="getEndBoardingColor(item)"></v-progress-circular>
                                            </div>
                                        </template>
                                        <span>{{ getEndBoardingText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                <td :class="getPDCClass(item)" v-if="item.departures == null" align="center"></td>
                                <td :class="getPDCClass(item)" v-else-if="item.dep_startbrdng == null" align="center"></td>
                                <td :class="getPDCClass(item)" v-else-if="item.dep_pdc == null && item.dep_cdc == null" align="center">
                                    <v-icon small
                                            class="ma-0 pa-0" 
                                            :color="getPDCColor(item)">
                                        {{ formatIcon(getPDCColor(item)) }}
                                    </v-icon>
                                </td>
                                <td :class="getPDCClass(item)" v-else-if="item.dep_pdc != null && item.dep_cdc == null" align="center">
                                    {{ formatPDC(item) }} / 
                                    <v-icon small
                                            class="ma-0 pa-0" 
                                            :color="getCDCColor(item)">
                                        {{ formatIcon(getCDCColor(item)) }}
                                    </v-icon>
                                </td>
                                <td :class="getPDCClass(item)" v-else-if="item.dep_pdc == null && item.dep_cdc != null" align="center">
                                    <v-icon small
                                            class="ma-0 pa-0" 
                                            :color="getPDCColor(item)">
                                        {{ formatIcon(getPDCColor(item)) }}
                                    </v-icon> / {{ formatCDC(item) }}
                                </td>
                                <td :class="getPDCClass(item)" v-else align="center">
                                    {{ formatPDC(item) }} / {{ formatCDC(item) }}
                                </td>
                                <td :class="getDepClass(item)" align="center">
                                    {{ formatARDT(item) }}
                                    <v-icon v-if="shouldHaveARDT(item)" medium
                                                class="ma-0 pa-0" :color="getARDTColor(item)">
                                            {{ formatIcon(getARDTColor(item)) }}
                                        </v-icon></td>
                                <td :class="getDepClass(item)" align="right">{{ formatATD(item) }}</td>
                                <td :class="getDepClass(item)" align="center">
                                    <v-icon  v-if="item.dep_atd != null" medium
                                            class="ma-0 pa-0" :color="formatOTP(item)">
                                        {{ formatIcon(formatOTP(item)) }}
                                    </v-icon>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-layout>
            </v-col>
        </v-row>
        <!-- Popup -->
        <v-dialog v-model="popupcontacts"
                  max-width="800px"
                  hide-overlay
                  transition="dialog-bottom-transition">
            <v-card>
                <v-card-title class="headline lighten-2">
                    Station - {{ station }}
                    <v-spacer></v-spacer>
                <v-icon medium class="mr-2" @click="popupcontacts = false">mdi-window-close</v-icon>
                </v-card-title>
                <v-data-table dense
                              :headers="headerContacts"
                              :items="stationContacts"
                              hide-default-footer
                              disable-pagination>
                </v-data-table>
            </v-card>
        </v-dialog>
        <v-dialog v-model="popupdashboardft"
                    max-width="800px"
                    transition="dialog-bottom-transition">
            <v-card>
                <v-card-title class="headline lighten-2">
                    Flight Dashboard
                    <v-spacer></v-spacer>
                    <v-icon medium class="mr-2" @click="closepopupFlightTotals()">mdi-window-close</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-row no-gutters>
                        <v-col class="text-center"><strong>PAX</strong></v-col>
                        <v-col class="text-center"><strong>Cargo</strong></v-col>
                        <v-col class="text-center"><strong>Authorized</strong></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">{{ dashboard.pax }}</v-col>
                        <v-col class="text-center">{{ dashboard.cargo }}</v-col>
                        <v-col class="text-center">{{ dashboard.authorized }}</v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { Utils } from '../plugins/Utils';
    import { DataAccess } from '../plugins/DataAccess';

    const util = new Utils();
    const dateNull = util.dateNull;

    export default {
        props: ['stations', 'homes'],
        data() {
            return {
                dataAccess: null,
                dow: util.getDoW(),
                timezone: 'UTC', //this.$store.getters.timezone,
                outerstations: this.$store.getters.outerstations,
                darkMode: this.$store.getters.darkMode,
                home: this.homes,
                isMobile: false,
                history: false,
                search: '',
                refresh: false,
                station: '',
                messages: 'No messages',
                rules: {
                    'ltyellow': 0,
                    'ltred': 0,
                    'otpyellow': 0,
                    'mttt': 0,
                    'pcdo': 0,
                    'pcdc': 0,
                    'startbrdng': 0,
                    'endbrdng': 0
                },
                headers: [
                    { text: 'Rotation', align: 'center', sortable: false, value: '' },
                    { text: 'A/C', align: 'center', sortable: false, value: 'arr_ac_registration' },
                    { text: 'Inbound', align: 'left', sortable: false, value: 'arrivals' },
                    { text: 'STA', align: 'center', sortable: false, value: 'arr_sta' },
                    { text: 'BTA', align: 'center', sortable: false, value: 'arr_sta' },
                    { text: 'Delay', align: 'center', sortable: false, value: '' },
                    { text: 'PDO/CDO', align: 'center', sortable: false, value: 'arr_cdo' },
                    { text: 'From', align: 'center', sortable: false, value: 'arr_from' },
                    { text: 'Outer', align: 'center', sortable: false, value: 'hub' },
                    { text: 'To', align: 'center', sortable: false, value: 'dep_to' },
                    { text: 'Outbound', align: 'left', sortable: false, value: 'dep_flightid' },
                    { text: 'STD', align: 'center', sortable: false, value: 'dep_std' },
                    { text: 'BTD', align: 'center', sortable: false, value: 'dep_std' },
                    { text: 'Delay', align: 'center', sortable: false, value: '' },
                    { text: 'Boarding', align: 'center', sortable: false, value: 'dep_startbrdng' },
                    { text: 'PDC/CDC', align: 'center', sortable: false, value: 'dep_cdc' },
                    { text: 'ARDT', align: 'center', sortable: false, value: 'dep_ardt' },
                    { text: 'ATD', align: 'center', sortable: false, value: 'dep_atd' },
                    { text: '', align: 'center', sortable: false, value: '' }
                ],
                headerContacts: [
                    { text: 'Provider', align: 'left', sortable: false, value: 'provider' },
                    { text: 'Service', align: 'center', sortable: false, value: 'service' },
                    { text: 'Contact Type', align: 'center', sortable: false, value: 'contact_type' },
                    { text: 'Contact', align: 'center', sortable: false, value: 'contact' },
                ],
                items: [],
                itemsStation: [],
                itemsDayDelays: [],
                itemTurnaroundRules: [],
                stationContacts: [],
                itemsStationTimezones: [],
                selectedItems: [],
                priorityFlights: [],
                isdep: true,
                popupcontacts: false,
                formTitle: "",
                dashboard: {
                    fltnum: '',
                    from: '',
                    to: '',
                    ac_registration: '',
                    from_terminal: '',
                    from_stand: '',
                    from_gate: '',
                    to_terminal: '',
                    to_stand: '',
                    to_belt: '',
                    pax: '',
                    cargo: '',
                    authorized: '',
                    processed: ''
                },
                popupdashboardft: false
            }
        },
        watch: {
            popupcontacts(val) {
                val || this.closepopupContacts()
            },
            outerstations(newItems) {
                this.outerstations = newItems;
                this.getOuterStations('outerstations', this.outerstations);
                this.$store.commit('set_outerstations',this.outerstations);
            },
            history() {
                this.refreshData();
            }
        },
        methods: {
            onResize() {
                if (window.innerWidth < 769) {
                    this.isMobile = true;
                } else {
                    this.isMobile = false;
                }
            },
            refreshData() {
                this.getStationList();
                if (this.itemsStation.length > 0) {
                    this.getOuterStations('outerstations', this.outerstations);
                    this.getDayDelays('outerstations');
                    this.getMessages();
                }
                this.getMessages();
            },
            getRules(id, hub) {
                try {
                    this.dataAccess.getRules(id, hub).then((response) => {
                        if (response.data.length > 0) {
                            let data = response.data[0]['fields'];
                            this.rules.ltyellow = data.ltyellow;
                            this.rules.ltred = data.ltred;
                            this.rules.otpyellow = data.otpyellow;
                            this.rules.mttt = data.mttt;
                            this.rules.pcdo = data.pcdo;
                            this.rules.pcdc = data.pcdc;
                            this.rules.startbrdng = data.startbrdng;
                            this.rules.endbrdng = data.endbrdng;
                        }
                    })
                } catch (error) {
                    this.rules.ltyellow = 0;
                    this.rules.ltred = 0;
                    this.rules.otpyellow = 0;
                    this.rules.mttt = 0;
                    this.rules.pcdo = 0;
                    this.rules.pcdc = 0;
                    this.rules.startbrdng = 0;
                    this.rules.endbrdng = 0;
                }
            },
            getTurnaroundRules(id, hub) {
                try {
                    this.dataAccess.getTurnaroundRules(id, hub).then((response) => {
                        this.itemTurnaroundRules = response.data;
                    })
                } catch (error) {
                    this.itemTurnaroundRules = [];
                }
            },
            getStatusColor(ratio) {
                return util.getStatusColor(ratio);
            },
            getOuterStations(id, stations) {
                let aux;
                let lowerDate = new Date().toISOString();
                let higherGMTDate = util.addMinutesToDate(new Date(lowerDate), 16 * 60);
                let lowerGMTDate = util.addMinutesToDate(new Date(lowerDate), -15);
                if (this.history) {
                    lowerGMTDate.setHours(0, 0, 0, 0);
                }
                                
                this.refresh = true;
                this.dataAccess.getOuterStations(id, stations).then((response) => {
                    this.items = [];
                    for (let i in response.data) {
                        var departureDate = (response.data[i]['fields']['dep_atd'] != null) ? response.data[i]['fields']['dep_atd'] : 
                            (response.data[i]['fields']['dep_etd'] != null) ? response.data[i]['fields']['dep_etd'] : 
                                (response.data[i]['fields']['dep_std'] != null) ? response.data[i]['fields']['dep_std'] :
                                    (response.data[i]['fields']['arr_ata'] != null) ? response.data[i]['fields']['arr_ata'] :
                                        (response.data[i]['fields']['arr_eta'] != null) ? response.data[i]['fields']['arr_eta'] :
                                            response.data[i]['fields']['arr_sta']  
                        aux = new Date(departureDate + '+00:00');
                        
                        if (aux > lowerGMTDate && aux < higherGMTDate &&
                            response.data[i]['fields']['arrivals'] != null &&
                            response.data[i]['fields']['departures'] != null)
                        {
                            this.items.push(response.data[i]['fields']);
                        }
                    }
                    this.syncDelays();
                    this.refresh = false;
                });
            },
            getMessages() {
                let flightidsList = [];
                let registrationsList = [];
                for (let i in this.items) {
                    if (this.items[i].arrivals != null && this.items[i].arrivals != '') flightidsList.push(this.items[i].arrivals);
                    if (this.items[i].departures != null && this.items[i].departures != '') flightidsList.push(this.items[i].departures);
                    if (this.items[i].arr_ac_registration != null && this.items[i].arr_ac_registration != '') registrationsList.push(this.items[i].arr_ac_registration);
                    if (this.items[i].dep_ac_registration != null && this.items[i].dep_ac_registration != '') registrationsList.push(this.items[i].dep_ac_registration);
                }
                this.dataAccess.getActiveMessages('outerstations', flightidsList, registrationsList, this.outerstations[0]).then((response) => {
                    this.messages = '';
                    if (response.data.length == 0) this.messages = 'No messages';
                    for (let i in response.data) {
                        this.messages += this.formatMessage(response.data[i]) + '  *****  ';
                    }
                });
            },
            getStationList() {
                this.dataAccess.getStations('outerstation').then((response) => {
                    for (var i in response.data) {
                        this.itemsStation.push(response.data[i]['fields']['station']);
                        this.itemsStationTimezones.push(response.data[i]['fields']['timezone']);
                    }
                    if (this.outerstations != undefined && this.outerstations.length > 0) {
                        this.getOuterStations('outerstations', this.outerstations);
                    }
                });
            },
            getDayDelays(id) {
                this.dataAccess.getDayDelays(id).then((response) => {
                    this.itemsDayDelays = [];
                    for (var i in response.data) {
                        this.itemsDayDelays.push(response.data[i]['fields']);
                    }
                    this.syncDelays();
                });
            },
            closepopupContacts() {
                this.popupcontacts = false;
            },
            openContacts(station) {
                this.dataAccess.getStationManagerContacts('outerstations', station).then((response) => {
                    this.stationContacts = [];
                    this.station = station;
                    for (var i in response.data) {
                        this.stationContacts.push(response.data[i]['fields']);
                    }
                    this.popupcontacts = true;
                });
            },
            syncDelays() {
                for (let j in this.items) {
                    this.items[j].arrivals_delays = [];
                    this.items[j].departures_delays = [];
                    for (var i in this.itemsDayDelays) {
                        if (this.itemsDayDelays[i]['fltinfoid'] === this.items[j].arrivals) {
                            this.items[j].arrivals_delays.push(this.itemsDayDelays[i]);
                        }
                        if (this.itemsDayDelays[i]['fltinfoid'] === this.items[j].departures) {
                            this.items[j].departures_delays.push(this.itemsDayDelays[i]);
                        }
                    }
                }
            },
            formatMessage(message) {
                let flight = '';
                if (message.flight != undefined && message.flight != null) {
                    flight = util.formatFlight(message.flight.operator, message.flight.flt_nr);
                    return message.fields.text + ' [' + flight + ']';
                }
                return message.fields.text;
            },
            formatDate(date) {
                if (date == null) return '';
                if (date == dateNull) return '';
                return util.formatDayHours(date);
            },
            formatSTA(item) {
                if (item.arr_sta == null) return '';
                return util.formatDayHours(item.arr_sta);
            },
            formatBTA(item) {
                if (item.arr_sta == null) return '';
                if (item.arr_ata != dateNull) return util.formatDayHours(item.arr_ata) + 'A';
                if (item.arr_eta != dateNull && item.arr_eta != item.arr_sta) return util.formatDayHours(item.arr_eta) + 'E';
                return util.formatDayHours(item.arr_sta);
            },
            formatSTD(item) {
                if (item.dep_std == null) return '';
                return util.formatDayHours(item.dep_std);
            },
            formatBTD(item) {
                if (item.dep_std == null) return '';
                if (item.dep_atd != dateNull) return util.formatDayHours(item.dep_atd)+'A';
                if (item.dep_etd != dateNull && item.dep_etd != item.dep_std) return util.formatDayHours(item.dep_etd)+'E';
                return util.formatDayHours(item.dep_std);
            },
            getBTAText(item) {
                if (item.arr_sta == null) return '';
                if (item.arr_ata != dateNull) return 'STA: ' + util.formatDayHours(item.arr_sta) + ' / ETA: ' + util.formatDayHours(item.arr_eta) + ' / ATA: ' + util.formatDayHours(item.arr_ata);
                if (item.arr_eta != dateNull && item.arr_eta != item.arr_sta) return 'STA: ' + util.formatDayHours(item.arr_sta) + ' / ETA: ' + util.formatDayHours(item.arr_eta);
                return 'STA: ' + util.formatDayHours(item.arr_sta);
            },
            getBTDText(item) {
                if (item.dep_std == null) return '';
                if (item.dep_atd != dateNull) return 'STD: ' + util.formatDayHours(item.dep_std) + ' / ETD: ' + util.formatDayHours(item.dep_etd) + ' / ATD: ' + util.formatDayHours(item.dep_atd);
                if (item.dep_etd != dateNull && item.dep_etd != item.dep_std) return 'STD: ' + util.formatDayHours(item.dep_std) + ' / ETD: ' + util.formatDayHours(item.dep_etd);
                return 'STD: ' + util.formatDayHours(item.dep_std);
            },
            formatAC(item) {
                if (item.arr_ac_registration != null && item.arr_ac_registration != '') return item.arr_ac_registration + ' ' + item.arr_equiptype;
                if (item.dep_ac_registration != null && item.dep_ac_registration != '') return item.dep_ac_registration + ' ' + item.dep_equiptype;
                return '';
            },
            formatArrFlight(item) {
                if (item.arr_from == null || item.arr_from == '') return '';
                return util.formatFlight(item.arr_operator, item.arr_fltnr);
            },
            formatDepFlight(item) {
                if (item.dep_to == null || item.dep_to == '') return '';
                return util.formatFlight(item.dep_operator, item.dep_fltnr);
            },
            formatTurnaround(item) {
                if (item.arr_sta == null || item.arr_sta == '') return '';
                if (item.dep_std == null || item.dep_std == '') return '';
                let bta = util.bestDate(item.arr_sta, item.arr_eta, item.arr_ata)
                let btd = util.bestDate(item.dep_std, item.dep_etd, item.dep_atd)
                let minutes = util.diff_minutes(new Date(bta), new Date(btd));
                return minutes;
            },
            formatTurnaroundText(item) {
                if (item.arrivals == null || item.departures == null) {
                    return ''
                }
                let minutes = this.formatTurnaround(item);
                let hours = Math.floor(minutes / 60);
                let mins = minutes % 60;
                return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
            },
            formatArrStatus(item) {
                if (item.arr_fltnr === '') return '';
                return util.formatArrStatus(item.arr_sta, item.arr_eta, item.arr_ata, item.arr_status);
            },
            formatDepStatus(item) {
                if (item.dep_fltnr === '') return '';
                return util.formatDepStatus(item.dep_std, item.dep_etd, item.dep_atd, item.dep_status);
            },
            formatStatus(item) {
                if (this.isdep) return this.formatDate(item.tsdep);
                return this.formatDate(item.tsarr);
            },
            classes(date, status) {
                if (util.isCanceled(status)) {
                    if (this.darkMode == true) {
                        return 'style-canceled-dark ma-0 pa-0 text-caption';
                    }
                    else {
                        return 'style-canceled ma-0 pa-0 text-caption';
                    }
                }
                else {
                    if (this.darkMode == true) {
                        return (date == null || date == '' || date == dateNull) ? 'style ma-0 pa-0 text-caption' : 'style-actual-dark ma-0 pa-0 text-caption';
                    }
                    else {
                        return (date == null || date == '' || date == dateNull) ? 'style ma-0 pa-0 text-caption' : 'style-actual ma-0 pa-0 text-caption';
                    }
                }
                
            },
            getBaseClass() {
                if (this.darkMode == true) {
                    return "style-principal-dark ma-0 pa-0 text-caption";
                }
                else {
                    return "style-principal ma-0 pa-0 text-caption";
                }
            },
            getClass(item) {
                if (util.isCanceled(item.arr_status)) this.classes(item.arr_ata, item.arr_status);
                if (util.isCanceled(item.dep_status)) this.classes(item.dep_atd, item.dep_status);
                if (item.arr_ata == null || item.arr_ata == '' || item.arr_ata == dateNull) return this.classes(item.arr_ata, item.arr_status);
                if (item.dep_atd == null || item.dep_atd == '' || item.dep_atd == dateNull) return this.classes(item.arr_ata, item.arr_status);
                return this.classes(item.dep_atd, item.dep_status);
            },
            getArrClass(item) {
                return this.classes(item.arr_ata, item.arr_status);
            },
            getDepClass(item) {
                return this.classes(item.dep_atd, item.dep_status);
            },
            getStationEquipmentLimit(mttt, hub, equip) {
                let turnaroundRules = this.itemTurnaroundRules.filter(i => i['fields']['station'] === hub);
                turnaroundRules = turnaroundRules.filter(i => i['fields']['equip'] === equip);
                if (turnaroundRules.length > 0) {
                    return turnaroundRules[0]['fields']['turnaround_minutes'];
                }
                let turnaroundRulesLIS = this.itemTurnaroundRules.filter(i => i['fields']['station'] === 'LIS');
                turnaroundRulesLIS = turnaroundRules.filter(i => i['fields']['equip'] === equip);
                if (turnaroundRulesLIS.length > 0) {
                    return turnaroundRulesLIS[0]['fields']['turnaround_minutes'];
                }
                return mttt;
            },
            getTurnaroundClass(item) {
                let hub = item.hub;
                let equip = item.dep_equiptype;
                let limit = this.getStationEquipmentLimit(this.rules.mttt, hub, equip);
                let turnaround = this.formatTurnaround(item);
                let style = 'style-principal ma-0 pa-1';
                if (this.darkMode == true) {
                    style = 'style-principal-dark ma-0 pa-1';   
                }
                if (turnaround <= limit) {
                    if (this.darkMode == true) {
                        style = 'style-turnaround-red-dark ma-0 pa-1';
                    }
                    else {
                        style = 'style-turnaround-red ma-0 pa-1';
                    }
                }
                if (turnaround === '') {
                    if (this.darkMode == true) {
                        style = 'style-principal-dark ma-0 pa-1';
                    }
                    else {
                        style = 'style-principal ma-0 pa-1';
                    }
                }
                return style;
            },
            capitalize(text) {
                return util.capitalized(text);
            },
            formatIcon(color) {
                return util.formatIcon(color);
            },
            formatDepSemaphore(item) {
                if (typeof (item.dep_atd) != 'undefined' && item.dep_atd != null && item.dep_atd != this.dateNull) {
                    return util.formatOTP(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone);
                }
                var cf = util.formatCF(item.dep_cf, item.dep_std, item.dep_etd, this.rules);
                var h2h = util.formatH2H(item.dep_h2h, this.rules); 
                var pt = util.formatPT(item.dep_pt, this.rules);
                var bagmo = util.formatBagMO(item.dep_std, item.dep_etd, item.dep_atd, item.dep_bagaut, item.dep_bagproc, item.dep_paxaut, item.dep_paxboard, this.rules);
                var otp = util.formatOTP(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone);
                
                if (otp == util.red || h2h == util.red || pt == util.red || cf == util.red || bagmo == util.red) {
                    return util.red;
                } else if (otp == util.yellow || h2h == util.yellow || pt == util.yellow || cf == util.yellow || bagmo == util.yellow) {
                    return util.yellow;
                } else if (otp == util.grey) {
                    return util.grey;
                } 
                return util.green;
            },
            getDepSemaphoreText(item) {
                if (typeof (item.dep_atd) != 'undefined' && item.dep_atd != null && item.dep_atd != this.dateNull) {
                    return 'OTP: ' + util.formatOTPMin(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone) + ' Min';
                }
                var cf = util.formatCF(item.dep_cf, item.dep_std, item.dep_etd, this.rules);
                var h2h = util.formatH2H(item.dep_h2h, this.rules); 
                var pt = util.formatPT(item.dep_pt, this.rules);
                var bagmo = util.formatBagMO(item.dep_std, item.dep_etd, item.dep_atd, item.dep_bagaut, item.dep_bagproc, item.dep_paxaut, item.dep_paxboard, this.rules);
                var otp = util.formatOTP(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone);
                
                var text = '';
                if (otp != util.green) {
                    if (util.formatOTPMin(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone) > 0) {
                        text += 'OTP: ' + util.formatOTPMin(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone) + ' Min';
                    }
                }
                if (h2h != util.green) {
                    if (text != '') {
                        text += '<br>'
                    }
                    text += 'H2H: ' + util.getH2HText(item.dep_h2h, this.rules);
                }
                if (pt != util.green) {
                    if (text != '') {
                        text += '<br>'
                    }
                    text += 'PT: ' + util.getPTText(item.dep_pt, this.rules);
                }
                if (bagmo != util.green) {
                    if (text != '') {
                        text += '<br>'
                    }
                    text += 'BAGM: ' + util.getBagMOText(item.dep_std, item.dep_etd, item.dep_atd, item.dep_bagaut, item.dep_bagproc, item.dep_paxaut, item.dep_paxboard, this.rules);
                }
                if (cf != util.green) {
                    if (text != '') {
                        text += '<br>'
                    }
                    text += 'CF: ' + util.getCFText(item.dep_cf, item.dep_std, item.dep_etd, this.rules);
                }
                if (text != '') {
                    return text;
                } else {
                    return '0k'
                }
            },
            getHeaders(i) {
                return this.headers[i]['text'];
            },
            openMessageDialog() {
                this.$router.push({ path: '/messages/-1' });
            },
            openMessagesFlightDialog(id) {
                this.$router.push({ path: '/messages/' + id });
            },
            isBoarding(bagboardts, atd) {
                return util.isBoarding(bagboardts, atd);
            },
            isIrregular(status) {
                return util.isCanceled(status);
            },
            isArrInFlight(item) {
                return util.isInFlight(item.arr_atd, item.arr_ata);
            },
            isDepInFlight(item) {
                return util.isInFlight(item.dep_atd, item.dep_ata);
            },
            flightRef(operator, fltnr, atd, ata) {
                let flightref = 'http://www.radarbox.com/flight/' + operator + Number(fltnr).toString();
                if (this.isInFlight(atd, ata)) window.open(flightref, '_blank');
                return ''
            },
            isArrBoarding(item) {
                if (item == null) return '';
                return '';
            },
            isDepBoarding(item) {
                if (item == null) return '';
                return '';
            },
            isArrIrregular(item) {
                if (item == null) return '';
                return '';
            },
            isDepIrregular(item) {
                if (item == null) return '';
                return '';
            },
            flightArrRef(item) {
                return this.flightRef(item.arr_operator, item.arr_fltnr);
            },
            flightDepRef(item) {
                return this.flightRef(item.dep_operator, item.dep_fltnr);
            },
            getDOColor(door, ata) {
                return util.formatDO(door, ata, this.rules, this.timezone);
            },
            formatDOClass(station, door, ata) {
                var color = this.getDOColor(door, ata);
                return this.formatTextColor(color, this.rules)
            },
            getPDOColor(item) { 
                return this.getDOColor(item.arr_pdo, item.arr_ata);
            },
            formatPDO(item) {
                if (item.arr_pdo == null) {
                    return ''
                }
                return util.formatDayHours(item.arr_pdo);
            },  
            getCDOColor(item) {
                return this.getDOColor(item.arr_cdo, item.arr_ata);
            },
            formatCDO(item) {
                if (item.arr_cdo == null) {
                    return ''
                }
                return util.formatDayHours(item.arr_cdo);
            },    
            getDCColor( door, std, etd) {
                return util.formatDC(door, std, etd, this.rules, this.timezone);
            },
            formatDCClass(station, door, std, etd) {
                var color = this.getDCColor(door, std, etd);
                return this.formatTextColor(color, this.rules)
            },
            getPDCColor(item) {
                return this.getDCColor(item.dep_pdc, item.dep_std, item.dep_etd);
            },
            formatPDC(item) {
               if (item.dep_pdc == null) {
                    return ''
                }
                return util.formatDayHours(item.dep_pdc);
            },
            getCDCColor(item) {
                return this.getDCColor(item.dep_cdc, item.dep_std, item.dep_etd);
            },
            formatCDC(item) {
                if (item.dep_cdc == null) {
                    return ''
                }
                return util.formatDayHours(item.dep_cdc);
            },
            getStartBoardingColor(item) {
                return util.getStartBoardingColor(item.dep_startbrdng, item.dep_std, item.dep_etd, this.rules, this.timezone);
            },
            formatStartBoardingText(item) {
                if (typeof (item.dep_startbrdng) == 'undefined' || item.dep_startbrdng == null || item.dep_startbrdng == this.dateNull) {
                    return '-';
                }
                return util.formatDayHours(item.dep_startbrdng);
            },
            getStartBoardingText(item) {
                let text = ''
                if (this.shouldHaveEndBoarding(item)) {
                    text += util.formatBoardingMin(item.dep_startbrdng, item.dep_std, item.dep_etd);
                } else {
                    text += this.formatStartBoardingText(item);
                }
                return text;
            },
            calculateEndBoardingTime(item) {
                let x = item.dep_paxaut - item.dep_paxboard;
                x = Math.round(x / 10);
                let utcDate = new Date(new Date().toUTCString());
                let newDate = util.addMinutesToDate(utcDate, x);
                return newDate;
            },
            getEndBoardingColor(item) {
                let endBoarding = this.calculateEndBoardingTime(item)
                return util.getEndBoardingColor(endBoarding, item.dep_std, item.dep_etd, this.rules, this.timezone);
            },
            formatEndBoardingText(item) {
                if (typeof (item.dep_endbrdng) == 'undefined' || item.dep_endbrdng == null || item.dep_endbrdng == this.dateNull) {
                    return '-';
                }
                return util.formatDayHours(item.dep_endbrdng);
            },
            getEndBoardingText(item) {
                let text = '';
                if (this.shouldHaveEndBoarding(item)) {
                    let endBoarding = this.calculateEndBoardingTime(item)
                    text += util.formatBoardingMin(endBoarding, item.dep_std, item.dep_etd) + '(' + item.dep_paxaut - item.dep_paxboard + ')';
                } else {
                    text += 'Missing: ' + (item.dep_paxaut - item.dep_paxboard) + ' pax';
                }
                return text; 
            },
            formatTextColor(color) {
                if (color == util.red) {
                    var splitRed = util.red.split(' ');
                    return " " + splitRed[0] + "--text" + " text--" + splitRed[0] + " font-weight-bold";
                }
                return '';
            },
            getPDOClass(item) {
                return this.getArrClass(item) + this.formatDOClass(item.arr_pdo, item.arr_ata);
            },
            getCDOClass(item) {
                return this.getArrClass(item) + this.formatDOClass(item.arr_cdo, item.arr_ata);
            },
            shouldHaveStartBoarding(item) {
                if (item.dep_startbrdng == null && this.getStartBoardingColor(item) != util.green) {
                    return true;
                } else {
                    return false;
                }
            },
            shouldHaveEndBoarding(item) {
                if (item.dep_endbrdng == null && this.getEndBoardingColor(item) != util.green) {
                    return true;
                } else {
                    return false;
                }
            },
            getPDCClass(item) {
                return this.getDepClass(item) + this.formatDCClass(item.dep_pdc, item.dep_std, item.dep_etd);
            },
            getCDCClass(item) {
                return this.getDepClass(item) + this.formatDCClass(item.dep_cdc, item.dep_std, item.dep_etd);
            },
            formatOTP(item) {
                return util.formatOTP(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone);
            },
            getARDTColor(item) {
                return util.formatARDT(item.dep_std, item.dep_etd, item.dep_atd, item.dep_ardt, this.rules);
            },
            shouldHaveARDT(item) {
                if (item.dep_ardt == null && this.getARDTColor(item) != util.green) {
                    return true;
                } else {
                    return false;
                }
            },
            formatARDT(item) {
                if (item.dep_ardt == null) {
                    return ''
                }
                return util.formatDayHours(item.dep_ardt);
            },
            formatATD(item) {
                if (item.dep_atd == null) {
                    return '-'
                }
                return util.formatDayHours(item.dep_atd);
            },
            formatLT(item) {
                return util.formatLT(item.arr_sta, item.arr_eta, item.arr_ata, item.arr_std, item.arr_etd, item.arr_atd, this.rules, this.timezone, this.timezone);
            },
            getLTText(item) {
                return (util.formatLT(item.arr_sta, item.arr_eta, item.arr_ata, item.arr_std, item.arr_etd, item.arr_atd, this.rules, this.timezone, this.timezone) != util.green) ?
                    util.getLTText(item.arr_sta, item.arr_eta, item.arr_ata, item.arr_std, item.arr_etd, item.arr_atd, this.rules, this.timezone, this.timezone) + ' Min' : 'Ok';
            },
            closepopupFlightTotals() {
                this.dashboard.pax = '';
                this.dashboard.cargo = '';
                this.dashboard.authorized = '';
                this.dashboard.processed = '';
                this.popupdashboardft = false;
            },
            openFlightTotals(item, type) {
                if (type == 'A') {
                    this.dashboard.pax = item.arr_pax;
                    this.dashboard.cargo = item.arr_cargo;
                    this.dashboard.authorized = item.arr_bagaut;
                    this.dashboard.processed = item.arr_bagproc;
                    this.popupdashboardft = true;
                } 
                if (type == 'D') {
                    this.dashboard.pax = item.dep_pax;
                    this.dashboard.cargo = item.dep_cargo;
                    this.dashboard.authorized = item.dep_bagaut;
                    this.dashboard.processed = item.dep_bagproc;
                    this.popupdashboardft = true;
                }
            },
            clearStations() {
                this.outerstations = []
                for (let index in this.itemsStation) {
                    if (this.itemsStation[index] != 'LIS') {
                        this.outerstations.push(this.itemsStation[index]);
                    }
                }
            },
            formatPercentage(value, base) {
                if (base == null ||base == 0) return 0;
                let percentage = Math.round((value / base) * 100);
                return percentage;
            },
            formatPercentageText(value, base) {
                var per = this.formatPercentage(value, base);
                if (per == 0) {
                    return ''
                }
                else if (per > 94 && per < 100) {
                    return '100%*'
                }
                return '' + per + '%'
            },
            getDelayText(item) {
                let text = "Delays: ";
                for (var i in item) {
                    text += item[i].delay_type + ' ' + item[i].delay_code + item[i].delay_sub_code + ' ' + item[i].minutes + ' min; '
                }
                return text;
            }
        },
        mounted() {
            this.dataAccess = new DataAccess(this.$msal);
            this.getRules();
            this.getTurnaroundRules();
            this.refreshData();
            this.timer = setInterval(function () {
                this.refreshData();
            }.bind(this), 30000);
            
        },
        beforeUnmount() {
            clearInterval(this.timer);
        },
        created() {
            this.$emit("stations", this.outerstations);
            this.$emit("homes", this.home);
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
        background-color: #114214;
    }
    
    .style-canceled {
        vertical-align: middle;
        background-color: #B0BEC5;
    }
    .style-canceled-dark {
        vertical-align: middle;
        background-color: #1b3c4d;
    }
    
    .style {
        font-size-adjust: 0.5;
        vertical-align: middle;
    }
    
    .style-principal {
        font-size-adjust: 0.5;
        vertical-align: middle;
        background-color: #ECEFF1;
    }
    .style-principal-dark {
        vertical-align: middle;
        background-color: #37474F;
    }
    
    .style-turnaround-red {
        font-size-adjust: 0.5;
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
        font-size-adjust: 0.5;
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
 
    .outerstations1 {
        height: 500px; /* Set the desired height for the table container */
        overflow-y: auto; /* Add a vertical scrollbar when needed */
    }

    #scroll-container {
        border: 2px solid #B0BEC5;
        border-radius: 5px;
        overflow: hidden;
        font-size: 25px;
        white-space: nowrap;
    }

    #scroll-text {
        /* animation properties */
        -moz-transform: translateX(100%);
        -webkit-transform: translateX(100%);
        transform: translateX(100%);
        -moz-animation: my-animation 15s linear infinite;
        -webkit-animation: my-animation 15s linear infinite;
        animation: my-animation 15s linear infinite;
        padding: 0px 0px 0px 0px;
    }

    /* for Firefox */
    @-moz-keyframes my-animation {
        from {
            -moz-transform: translateX(100%);
        }

        to {
            -moz-transform: translateX(-100%);
        }
    }

    /* for Chrome */
    @-webkit-keyframes my-animation {
        from {
            -webkit-transform: translateX(100%);
        }

        to {
            -webkit-transform: translateX(-100%);
        }
    }

    @keyframes my-animation {
        from {
            -moz-transform: translateX(100%);
            -webkit-transform: translateX(100%);
            transform: translateX(100%);
        }

        to {
            -moz-transform: translateX(-100%);
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
        }
    }

</style>

