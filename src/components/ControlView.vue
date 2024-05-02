<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <PieChart :stations="hub" :smalls="1" class="mb-2" v-if="getWindowsWith() > 1264"/>
            <v-row v-if="messages != 'No messages'" no-gutters dense class="pa-1 ma-0" justify="start">
                <v-col md="12" id="scroll-container">
                    <v-col id="scroll-text">
                        {{ messages }}
                    </v-col>
                </v-col>
            </v-row>
            <v-row no-gutters class="pa-1 ma-0" justify="start">
                <v-col cols="4" sm="4">
                    <strong>ARRIVALS </strong><v-icon color="#FFD600">mdi-airplane-landing</v-icon>
                </v-col>
                <v-col cols="2" sm="1" class="justify-space-around text-caption">
                    <v-icon medium class="ma-0 pa-0" color="red darken-4" v-if="refresh">
                        mdi-web
                    </v-icon><span v-if="refresh" class="red--text text--darken-4">Loading...</span>
                </v-col>
                <v-col cols="3" sm="4" class="justify-space-around pa-1 ma-0">
                    <strong>DEPARTURES </strong><v-icon color="#1A237E">mdi-airplane-takeoff</v-icon>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="1" class="text-center">
                    <v-icon @click="openMessageDialog()">mdi-message-reply-text</v-icon>
                </v-col>
                <v-col cols="12" sm="1">
                    <v-text-field dense
                                  color="#B71C1C"
                                  v-model="searchtable"
                                  append-icon="mdi-magnify"
                                  label="Tail"
                                  single-line
                                  hide-details></v-text-field>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="4" sm="4">
                    <v-layout v-resize="onResize" child-flex>
                        <v-data-table :headers="headersIn"
                                      :items="itemsFilteredIn"
                                      :search="searchtable"
                                      disable-pagination
                                      disable-sort
                                      dense
                                      hide-default-footer
                                      class="elevation-1 ma-0 pa-0">
                            <template v-for="(h, index) in headersIn" v-slot:[`header.${h.value}`]="{ header }" :key="index">
                                <v-tooltip bottom v-bind:key="index">
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">{{ header.text }}</span>
                                    </template>
                                    <span>{{ header.tip }}</span>
                                </v-tooltip>
                            </template>
                            <template #item="{ item }">
                                <tr v-if="!isMobile">
                                    <!-- Flt Nr -->
                                    <td :class="getArrClass(item.fields)" align="left">
                                        <a @click="doFilterIn(item.fields.fltinid)">{{ item.fields.fltnr }}</a>
                                        <v-btn class="mr-0"  icon color="blue-grey lighten-4"
                                               @click="openFlightTotals(item.fields)">
                                            <v-icon small :color="(darkMode == true) ? '' : 'blue-grey darken-4'">mdi-chart-box</v-icon>
                                        </v-btn>
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
                                    </td>
                                    <!-- A/C -->
                                    <td :class="getArrClass(item.fields)" align="center">{{ formatAC(item.fields) }}</td>
                                    <!-- From -->
                                    <td :class="getArrClass(item.fields)" align="center">{{ item.fields.from_iata }}</td>
                                    <!-- STA -->
                                    <td :class="getArrClass(item.fields)" align="center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on">
                                                    {{ formatSTA(item.fields) }}
                                                </span>
                                            </template>
                                            <span>{{ getBTAText(item.fields) }}</span>
                                        </v-tooltip>
                                    </td>
                                     <!-- UTA -->
                                     <td :class="getArrClass(item.fields)" align="center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on" :class="formatUTADate(item.fields)">
                                                    {{ formatUTA(item.fields) }}
                                                </span>
                                            </template>
                                            <span>{{ getBTAText(item.fields) }}</span>
                                        </v-tooltip>
                                    </td>
                                    <!-- PB -->
                                    <td :class="getArrClass(item.fields)" align="left">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <div v-if="!item.fields.paxtotal || !item.fields.bagboard">
                                                    <v-icon size="20" color="#BDBDBD" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else-if="item.fields.bagboard == item.fields.paxtotal || (item.fields.bagboard / item.fields.paxtotal > 0.94)">
                                                    <v-icon size="20" color="#4CAF50" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-progress-circular 
                                                        size="19" 
                                                        width="6"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        v-if="formatPercentage(item.fields.bagboard, item.fields.paxtotal)"
                                                        :value="formatPercentage(item.fields.bagboard, item.fields.paxtotal)"
                                                        :color="formatOTP(item.fields)"
                                                    >
                                                    </v-progress-circular>
                                                    <span> {{item.fields.paxtotal - item.fields.bagboard}}</span>
                                                </div>
                                                </template>
                                            <span>Passenger Boarded: {{ formatPassengerPer(item.fields) }}</span>
                                        </v-tooltip>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td :class="getArrClass(item.fields)">
                                        <v-list-item-group class="d-flex justify-space-around flex-wrap pa-0 ma-0">
                                            <!-- Flt Nr -->
                                            <v-col cols="12" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersIn(0)"></v-list-item-subtitle>
                                                <v-list-item-title dense class="flex-content text-caption ma-0 pa-0">
                                                    <a class="ma-0 pa-0" @click="doFilterIn(item.fields.fltinid)">{{ item.fields.fltnr }}</a>
                                                    <v-btn class="ma-0 pa-0"  icon color="blue-grey lighten-4"
                                                           @click="openFlightTotals(item.fields)">
                                                        <v-icon small color="blue-grey darken-4">mdi-chart-box</v-icon>
                                                    </v-btn>
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
                                                                <v-icon small class="ma-0 pa-0">mdi-seat-recline-extra</v-icon>
                                                            </span>
                                                        </template>
                                                        <span> Boarding started {{ formatDate(item.fields.boardts) }}</span>
                                                    </v-tooltip>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- A/C -->
                                            <v-col cols="6" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersIn(1)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatAC(item.fields)"></v-list-item-title>
                                            </v-col>
                                            <!-- From -->
                                            <v-col cols="6" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersIn(2)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.fields.from_iata"></v-list-item-title>
                                            </v-col>
                                            <!-- STA -->
                                            <v-col cols="6" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersIn(3)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatSTA(item.fields)"></v-list-item-title>
                                            </v-col>
                                            <!-- UTA -->
                                            <v-col cols="6" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersIn(4)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on" :class="formatUTADate(item.fields)">
                                                                {{ formatUTA(item.fields) }}
                                                            </span>
                                                        </template>
                                                        <span>{{ getBTAText(item.fields) }}</span>
                                                    </v-tooltip>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- PB -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersIn(5)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <div v-if="!item.fields.paxtotal || !item.fields.bagboard">
                                                    <v-icon size="20" color="#BDBDBD">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else-if="item.fields.bagboard == item.fields.paxtotal || (item.fields.bagboard / item.fields.paxtotal > 0.94)">
                                                    <v-icon size="20" :color="formatOTP(item.fields)">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-progress-circular 
                                                        size="19" 
                                                        width="6"
                                                        :value="formatPercentage(item.fields.bagboard, item.fields.paxtotal)"
                                                        :color="formatOTP(item.fields)">
                                                    </v-progress-circular>
                                                    <span> {{item.fields.paxtotal - item.fields.bagboard}}</span>
                                                </div>
                                                </v-list-item-title>
                                            </v-col>
                                        </v-list-item-group>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-layout>
                </v-col>
                <v-col cols="2" sm="1" class="text-caption" align="center" v-if="isFiltered() == false">
                    <a @click="clearFilters()">
                        <img :src="require('./../assets/Airport.png')" :height="getPictureMobileSize()" :width="getPictureMobileSize()" /><br />
                    </a>
                    <h4>{{ hub }}<br />Airport</h4>
                </v-col>
                <v-col cols="1" sm="1" class="text-caption" align="center" v-else>
                    <a @click="clearFilters()">
                        <img :src="require('./../assets/Flight.png')" :height="getPictureMobileSize()" :width="getPictureMobileSize()" /><br />
                    </a>
                    <h4>{{ filteredFlight() }}</h4>
                    <div>{{ filteredToFrom() }}</div>
                    <div>{{ filteredRegistration() }}</div>
                    <div>{{ filteredBTD() }}</div>
                    <div>{{ filteredBTA() }}</div>
                </v-col>
                <v-col cols="6" sm="7">
                    <v-layout v-resize="onResize" child-flex>
                        <v-data-table dense
                                      :headers="headersOut"
                                      :items="itemsFilteredOut"
                                      :search="searchtable"
                                      hide-default-footer
                                      disable-pagination
                                      disable-sort
                                      class="elevation-1 pa-0 ma-0">
                            <template v-for="(h, index) in headersOut" v-slot:[`header.${h.value}`]="{ header }" :key="index">
                                <v-tooltip bottom v-bind:key="index">
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">{{ header.text }}</span>
                                    </template>
                                    <span>{{ header.tip }}</span>
                                </v-tooltip>
                            </template>
                            <template #item="{ item }">
                                <tr v-if="!isMobile">
                                    <!-- Flt Nr -->
                                    <td :class="getDepClass(item.fields)" align="left">
                                        <a @click="doFilterOut(item.fields.fltoutid)" href="#">{{ item.fields.fltnr }}</a>
                                        <v-btn class="ma-0 pa-0"  icon color="blue-grey lighten-4"
                                               @click="openFlightTotals(item.fields)">
                                            <v-icon small :color="(darkMode == true) ? '' : 'blue-grey darken-4'">mdi-chart-box</v-icon>
                                        </v-btn>
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
                                    </td>
                                    <!-- A/C -->
                                    <td :class="getDepClass(item.fields)" align="center">{{ formatAC(item.fields) }}</td>
                                    <!-- To -->
                                    <td :class="getDepClass(item.fields)" align="center">{{ item.fields.to_iata }}</td>
                                    <!-- STD -->
                                    <td :class="getDepClass(item.fields)" align="center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on">
                                                    {{ formatSTD(item.fields) }}
                                                </span>
                                            </template>
                                            <span>{{ getBTDText(item.fields) }}</span>
                                        </v-tooltip>
                                    </td>
                                    <!-- UTD -->
                                    <td :class="getDepClass(item.fields)" align="center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on" :class="formatUTDDate(item.fields)">
                                                    {{ formatUTD(item.fields) }}
                                                </span>
                                            </template>
                                            <span>{{ getBTDText(item.fields) }}</span>
                                        </v-tooltip>
                                    </td>
                                    <!-- Baggage -->
                                    <td :class="getDepClass(item.fields)" align="left">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <div v-if="!item.fields.bagproc || !item.fields.bagtotal || formatPercentage(item.fields.bagproc, item.fields.bagtotal) == 0 || formatPercentage(item.fields.bagproc, item.fields.bagtotal) > 94">
                                                    <v-icon size="20"  @click="pushH2H(item.fields)" :color="formatBaggage(item.fields)" v-bind="attrs" v-on="on">{{formatIcon(formatBaggage(item.fields))}}</v-icon>
                                                </div>
                                                <div v-else>
                                                <v-progress-circular 
                                                    @click="pushH2H(item.fields)"
                                                    size="19" 
                                                    width="6"
                                                    v-on="on"
                                                    :value="formatPercentage(item.fields.bagproc, item.fields.bagtotal)"
                                                    :color="formatBaggage(item.fields)"
                                                >
                                                </v-progress-circular>
                                                <span> {{item.fields.bagtotal - item.fields.bagproc}}</span>
                                            </div>
                                            </template>
                                            <span>{{ getBaggageText(item.fields) }}</span>
                                        </v-tooltip>
                                    </td>
                                    <!-- Passenger -->
                                    <td :class="getDepClass(item.fields)" align="left">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <div v-if="!item.fields.bagboard || !item.fields.paxtotal || formatPercentage(item.fields.bagboard, item.fields.paxtotal) == 0 || formatPercentage(item.fields.bagboard, item.fields.paxtotal) > 94">
                                                    <v-icon size="20"  @click="pushPT(item.fields)" :color="formatPT(item.fields)" v-bind="attrs" v-on="on">{{formatIcon(formatPassenger(item.fields))}}</v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-progress-circular 
                                                        @click="pushPT(item.fields)"
                                                        size="19" 
                                                        width="6"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        :value="formatPercentage(item.fields.bagboard, item.fields.paxtotal)"
                                                        :color="formatPT(item.fields)"
                                                        class="cursor-pointer"
                                                    >
                                                    </v-progress-circular>
                                                    <span> {{ item.fields.paxtotal - item.fields.bagboard}}</span>
                                                 </div>
                                            </template>
                                            <span> {{ getPassengerText(item.fields) }}</span>
                                        </v-tooltip>
                                    </td>
                                    <!-- TSAT -->
                                    <td :class="getDepClass(item.fields)" align="center">
                                        <span>
                                            {{ formatTSATDate(item.fields) }}
                                        </span>
                                    </td>
                                    <!-- ARDT -->
                                    <td :class="getDepClass(item.fields)" align="center">
                                        <span>
                                            {{ formatARDTDate(item.fields) }}
                                        </span>
                                    </td>
                                    <!-- TOBT -->
                                    <td :class="getDepClass(item.fields)" align="center">
                                        <span>
                                            {{ formatTOBTDate(item.fields) }}
                                        </span>
                                    </td>
                                    <!-- CTOT -->
                                    <td :class="getDepClass(item.fields)" align="center">
                                        <span>
                                            {{ formatCTOTDate(item.fields) }}
                                        </span>
                                    </td>
                                    <!-- Prio -->
                                    <td :class="getDepClass(item.fields)" align="center">
                                        <v-icon medium
                                                class="ma-0 pa-0" :color="formatPrio(item.fields)"
                                                @click="changePriority(item.fields)">
                                            {{ formatIcon(formatPrio(item.fields)) }}
                                        </v-icon>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td :class="getDepClass(item.fields)">
                                        <v-list-item-group class="d-flex justify-space-around flex-wrap pa-0 ma-0">
                                            <!-- Flt Nr -->
                                            <v-col cols="8" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(0)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <a class="ma-0 pa-0" @click="doFilterOut(item.fields.fltoutid)" href="#">{{ item.fields.fltnr }}</a>
                                                    <v-btn class="ma-0 pa-0"  icon color="blue-grey lighten-4"
                                                           @click="openFlightTotals(item.fields)">
                                                        <v-icon small color="blue-grey darken-4">mdi-chart-box</v-icon>
                                                    </v-btn>
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
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- A/C -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(1)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatAC(item.fields)"></v-list-item-title>
                                            </v-col>
                                            <!-- To -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(2)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="item.fields.to_iata"></v-list-item-title>
                                            </v-col>
                                            <!-- STD -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(3)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption" v-text="formatSTD(item.fields)"></v-list-item-title>
                                            </v-col>
                                            <!-- UTD -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(4)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on" :class="formatUTDDate(item.fields)">
                                                                {{ formatUTD(item.fields) }}
                                                            </span>
                                                        </template>
                                                        <span>{{ getBTDText(item.fields) }}</span>
                                                    </v-tooltip>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- Baggage -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(5)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <div v-if="!item.fields.bagproc || !item.fields.bagtotal || formatPercentage(item.fields.bagproc, item.fields.bagtotal) == 0 || (formatPercentage(item.fields.bagproc, item.fields.bagtotal) > 94)">
                                                                <v-icon size="20"  @click="pushH2H(item.fields)" :color="formatBaggage(item.fields)" v-bind="attrs" v-on="on">{{formatIcon(formatBaggage(item.fields))}}</v-icon>
                                                            </div>
                                                            <div v-else>
                                                                <v-progress-circular 
                                                                    @click="pushH2H(item.fields)"
                                                                    size="19" 
                                                                    width="6"
                                                                    v-on="on"
                                                                    :value="formatPercentage(item.fields.bagproc, item.fields.bagtotal)"
                                                                    :color="formatBaggage(item.fields)"
                                                                >
                                                                </v-progress-circular>
                                                                <span>{{item.fields.bagtotal - item.fields.bagproc}}</span>
                                                            </div>
                                                        </template>
                                                        <span> {{ getBaggageText(item.fields) }}</span>
                                                    </v-tooltip>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- Passenger -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(6)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <div v-if="!item.fields.bagboard || !item.fields.paxtotal || formatPercentage(item.fields.bagboard, item.fields.paxtotal) == 0 || (formatPercentage(item.fields.bagboard, item.fields.paxtotal) > 94)">
                                                                <v-icon size="20"  @click="pushPT(item.fields)" :color="formatPT(item.fields)" v-bind="attrs" v-on="on">{{formatIcon(formatPassenger(item.fields))}}</v-icon>
                                                            </div>
                                                            <div v-else>
                                                                <v-progress-circular 
                                                                    @click="pushPT(item.fields)"
                                                                    size="19" 
                                                                    width="6"
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                    :value="formatPercentage(item.fields.bagboard, item.fields.paxtotal)"
                                                                    :color="formatPT(item.fields)"
                                                                    class="cursor-pointer"
                                                                >
                                                                </v-progress-circular>
                                                                <span>{{ item.fields.paxtotal - item.fields.bagboard}}</span>
                                                            </div>
                                                        </template>
                                                        <span> {{ getPassengerText(item.fields) }}</span>
                                                    </v-tooltip>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- TSAT -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(7)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                {{ formatTSATDate(item.fields) }}
                                                            </span>
                                                        </template>
                                                        <span>{{ getTSATARDTText(item.fields) }}</span>
                                                    </v-tooltip>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- ARDT -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(8)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                {{ formatARDTDate(item.fields) }}
                                                            </span>
                                                        </template>
                                                        <span>{{ getTSATARDTText(item.fields) }}</span>
                                                    </v-tooltip>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- TOBT -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(9)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <span>
                                                        {{ formatTOBTDate(item.fields) }}
                                                    </span>
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- CTOT -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(10)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <span>
                                                        {{ formatCTOTDate(item.fields) }}
                                                    </span> 
                                                </v-list-item-title>
                                            </v-col>
                                            <!-- Prio -->
                                            <v-col cols="4" class="pa-0 ma-0">
                                                <v-list-item-subtitle class="flex-header text-caption" v-text="getHeadersOut(11)"></v-list-item-subtitle>
                                                <v-list-item-title class="flex-content text-caption">
                                                    <v-icon medium
                                                            class="ma-0 pa-0" :color="formatPrio(item.fields)"
                                                            @click="changePriority(item.fields)">
                                                        {{ formatIcon(formatPrio(item.fields)) }}
                                                    </v-icon>
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
        <!-- Popup -->
        <v-dialog v-model="popupdashboard"
                    max-width="800px"
                    transition="dialog-bottom-transition">
            <v-card>
                <v-card-title class="headline lighten-2">
                    Flight Dashboard
                    <v-spacer></v-spacer>
                    <v-icon medium class="mr-2" @click="closepopup()">mdi-window-close</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-row no-gutters>
                        <v-col class="text-center"><strong>FLT Nr</strong></v-col>
                        <v-col class="text-center"><strong>FROM - TO</strong></v-col>
                        <v-col class="text-center"><strong>REGISTRATION</strong></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">{{ dashboard.fltnr }}</v-col>
                        <v-col class="text-center">{{ dashboard.from_iata }} - {{ dashboard.to_iata }}</v-col>
                        <v-col class="text-center">{{ dashboard.ac_registration }}</v-col>
                    </v-row>
                    <v-row class="pa-2" no-gutters>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center"><strong>STD</strong></v-col>
                        <v-col class="text-center"><strong>ETD</strong></v-col>
                        <v-col class="text-center"><strong>ATD</strong></v-col>
                        <v-col class="text-center"><strong>DOOR CLOSED</strong></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">{{ formatDate(dashboard.std) }}</v-col>
                        <v-col class="text-center">{{ formatDate(dashboard.etd) }}</v-col>
                        <v-col class="text-center">{{ formatDate(dashboard.atd) }}</v-col>
                        <v-col class="text-center">{{ formatDate(dashboard.doorclosed) }}</v-col>
                    </v-row>
                    <v-row class="pa-2" no-gutters>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row no-gutters>
                        <v-col md="6" class="text-center"><strong>FROM</strong></v-col>
                        <v-col md="6" class="text-center"><strong>TO</strong></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center"><strong>TERMINAL</strong></v-col>
                        <v-col class="text-center"><strong>STAND </strong></v-col>
                        <v-col class="text-center"><strong>GATE</strong></v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-center"><strong>TERMINAL</strong></v-col>
                        <v-col class="text-center"><strong>STAND</strong></v-col>
                        <v-col class="text-center"><strong>BELT</strong></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">{{ dashboard.from_terminal }}</v-col>
                        <v-col class="text-center">{{ dashboard.from_stand }}</v-col>
                        <v-col class="text-center">{{ dashboard.from_gate }}</v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-center">{{ dashboard.to_terminal }}</v-col>
                        <v-col class="text-center">{{ dashboard.to_stand }}</v-col>
                        <v-col class="text-center">{{ dashboard.to_belt }}</v-col>
                    </v-row>
                    <v-row class="pa-2" no-gutters>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center"><strong>STA</strong></v-col>
                        <v-col class="text-center"><strong>ETA</strong></v-col>
                        <v-col class="text-center"><strong>ATA</strong></v-col>
                        <v-col class="text-center"><strong>ON BLOCK</strong></v-col>
                        <v-col class="text-center"><strong>DOOR OPEN</strong></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">{{ formatDate(dashboard.sta) }}</v-col>
                        <v-col class="text-center">{{ formatDate(dashboard.eta) }}</v-col>
                        <v-col class="text-center">{{ formatDate(dashboard.ata) }}</v-col>
                        <v-col class="text-center">{{ formatDate(dashboard.onblock) }}</v-col>
                        <v-col class="text-center">{{ formatDate(dashboard.dooropen) }}</v-col>
                    </v-row>
                    <v-row class="pa-2" no-gutters>
                        <v-divider></v-divider>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center"><strong>TBL</strong></v-col>
                        <v-col class="text-center"><strong>TBT</strong></v-col>
                        <v-col class="text-center"><strong>TR</strong></v-col>
                        <v-col class="text-center"><strong>UA</strong></v-col>
                        <v-col class="text-center"><strong>TB</strong></v-col>
                        <v-col class="text-center"><strong>TBP</strong></v-col>
                        <v-col class="text-center"><strong>PB OK</strong></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">{{ dashboard.baglocal }}</v-col>
                        <v-col class="text-center">{{ dashboard.bagtrans }}</v-col>
                        <v-col class="text-center">{{ dashboard.bagrush }}</v-col>
                        <v-col class="text-center">{{ dashboard.baguna }}</v-col>
                        <v-col class="text-center">{{ dashboard.bagtotal }}</v-col>
                        <v-col class="text-center">{{ dashboard.bagproc }}</v-col>
                        <v-col class="text-center">{{ dashboard.bagboard }}</v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
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
                hub: this.$store.getters.hub,
                timezone: this.$store.getters.timezone,
                darkMode: this.$store.getters.darkMode,
                isMobile: false,
                search: "",
                refresh: false,
                messages: 'No messages',
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
                    minstartboard: '',
                    ardtyellow: '',
                    ardtred: '',
                    tsatyellow: '',
                    tsatred: ''
                },
                headersIn: [
                    {
                        text: 'Flt Nr',
                        align: 'left',
                        value: 'fields.fltnr',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Flight Number'
                    },
                    {
                        text: 'A/C',
                        align: 'center',
                        value: 'fields.ac_registration',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Aircraft Registration'
                    },
                    {
                        text: 'From',
                        align: 'center',
                        value: 'fields.from_iata',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Origin'
                    },
                    {
                        text: 'STA',
                        align: 'center',
                        value: 'fields.sta',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Scheduled Time of Arrival'
                    },
                    {
                        text: 'UTA',
                        align: 'center',
                        value: 'fields.ata',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Updated Arrival Time (ETA or ATA)'
                    },
                    {
                        text: 'Passenger',
                        align: 'center',
                        value: 'fields.pb',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Flight passengers boarded percentage and total passengers missing'
                    }
                ],
                headersOut: [
                    {
                        text: 'Flt Nr',
                        align: 'left',
                        value: 'fields.fltnr',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Flight Number'
                    },
                    {
                        text: 'A/C',
                        align: 'center',
                        value: 'fields.ac_registration',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Aircraft Registration'
                    },
                    {
                        text: 'To',
                        align: 'center',
                        value: 'fields.to_iata',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Destination'
                    },
                    {
                        text: 'STD',
                        align: 'center',
                        value: 'fields.std',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Scheduled Departure Time'
                    },
                    {
                        text: 'UTD',
                        align: 'center',
                        value: 'fields.atd',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Updated Depature Time (ETD or ATD)'
                    },
                    {
                        text: 'Baggage',
                        align: 'center',
                        value: 'fields.h2h',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Hull to Hull - Forecasted minimum time to execute  baggage transfer from inbound to outbound flights'
                    },
                    {
                        text: 'Passenger',
                        align: 'center',
                        value: 'fields.pt',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Door to Door - Forecasted minimum time to execute passenger transfer from inbound to outbound flight'
                    },
                    {
                        text: 'TSAT',
                        align: 'center',
                        value: 'fields.bagmo',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Target Start-Up Approval Time'
                    },
                    {
                        text: 'ARDT',
                        align: 'center',
                        value: 'fields.bagmo',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Flight Aircraft Ready'
                    },
                    {
                        text: 'TOBT',
                        align: 'center',
                        value: 'fields.bagmo',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Target Off-Block Time'
                    },
                    {
                        text: 'CTOT',
                        align: 'center',
                        value: 'fields.bagmo',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Calculated Take Off Time'
                    },
                    {
                        text: 'Prio',
                        align: 'center',
                        value: '',
                        class: ['ma-0', 'pa-0'],
                        tip: 'Indicator of priority outbound flight'
                    },
                ],
                filterIn: '',
                filterOut: '',
                itemsIn: [],
                itemsOut: [],
                itemsInOut: [],
                itemsFilteredIn: [],
                itemsFilteredOut: [],
                itemsStation: [],
                itemsStationTimezones: [],
                priorityFlights: [],
                searchtable: '',
                dashboard: {
                    fltnum: '',
                    from: '',
                    to: '',
                    ac_registration: '',
                    std: '',
                    etd: '',
                    atd: '',
                    sta: '',
                    eta: '',
                    ata: '',
                    onblock: '',
                    dooropen: '',
                    doorclosed: '',
                    from_terminal: '',
                    from_stand: '',
                    from_gate: '',
                    to_terminal: '',
                    to_stand: '',
                    to_belt: '',
                    baglocal: '',
                    bagtransfer: '',
                    bagrush: '',
                    baguna: '',
                    bagtotal: '',
                    bagproc: '',
                    bagboard: ''
                },
                popupdashboard: false,
            }
        },
        watch: {
            popupstatus(val) {
                val || this.closepopup()
            }
        },
        methods: {
            onResize() {
                if (window.innerWidth < 769)
                    this.isMobile = true;
                else
                    this.isMobile = false;
            },
            getWindowsWith() {
                return window.innerWidth
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
                        this.rules.ardtyellow = data.ardtyellow;
                        this.rules.ardtred = data.ardtred;
                        this.rules.tsatyellow = data.tsatyellow;
                        this.rules.tsatred = data.tsatred;
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
                    this.rules.ardtyellow = '';
                    this.rules.ardtred = '';
                    this.rules.tsatyellow = '';
                    this.rules.tsatred = '';
                }
            },
            getViewInOut(id, hub) {
                try {
                    this.refresh = true;
                    this.dataAccess.getViewInOut(id, hub).then((response) => {
                        this.itemsInOut = response.data;
                        this.refresh = false;
                    })
                } catch (error) {
                    this.itemsInOut = [];
                }
            },
            getControlViewIn(id, hub) {
                try {
                    this.refresh = true;
                    this.dataAccess.getControlViewIn(id, hub).then((response) => {
                        this.itemsIn = response.data;
                        this.filter();
                        this.refresh = false;
                    })
                } catch (error) {
                    this.itemsIn = [];
                }
            },
            getControlViewOut(id, hub) {
                try {
                    this.refresh = true;
                    this.dataAccess.getControlViewOut(id, hub).then((response) => {
                        this.itemsOut = response.data;
                        this.filter();
                        this.refresh = false;
                    })
                } catch (error) {
                    this.itemsOut = [];
                }
            },    
            getStationList() {
                this.dataAccess.getStations('station').then((response) => {
                    for (var i in response.data) {
                        this.itemsStation.push(response.data[i]['fields']['station']);
                        this.itemsStationTimezones.push(response.data[i]['fields']['timezone']);
                    }
                });
            },
            getStatusColor(ratio) {
                return util.getStatusColor(ratio);
            },
            getUtilsPurple() {
                return util.purple;
            },
            getMessages() {
                let flightidsList = [];
                let registrationsList = [];
                for (let i in this.itemsFilteredIn) {
                    if (this.itemsFilteredIn[i].fields.fltindid != null && this.itemsFilteredIn[i].fields.fltindid != '') flightidsList.push(this.itemsFilteredIn[i].fields.fltinid);
                    if (this.itemsFilteredIn[i].fields.ac_registration != null && this.itemsFilteredIn[i].fields.ac_registration != '') registrationsList.push(this.itemsFilteredIn[i].fields.ac_registration);
                }
                for (let i in this.itemsFilteredOut) {
                    if (this.itemsFilteredOut[i].fields.fltoutdid != null && this.itemsFilteredOut[i].fields.fltoutdid != '') flightidsList.push(this.itemsFilteredOut[i].fields.fltoutid);
                    if (this.itemsFilteredOut[i].fields.ac_registration != null && this.itemsFilteredOut[i].fields.ac_registration != '') registrationsList.push(this.itemsFilteredOut[i].fields.ac_registration);
                }
                this.dataAccess.getActiveMessages('flightstatus', flightidsList, registrationsList, this.hub).then((response) => {
                    this.messages = '';
                    if (response.data.length == 0) this.messages = 'No messages';
                    for (let i in response.data) {
                        this.messages += this.formatMessage(response.data[i]) + '  *****  ';
                    }
                });
            },
            getPriorityFlights() {
                this.dataAccess.getPriorityFlights('flightstatus', this.hub).then((response) => {
                    this.priorityFlights = response.data;
                }); 
            },
            formatMessage(message) {
                let flight = '';
                if (message.flight != undefined && message.flight != null) {
                    flight = util.formatFlight(message.flight.operator, message.flight.flt_nr);
                    return message.fields.text + ' [' + flight + ']';
                }
                return message.fields.text;
            },
            filter() {
                this.itemsFilteredIn = [];
                this.itemsFilteredOut = [];
                var item;
                var itemInOut;
                var itemIn;
                var itemOut;
                if (this.filterIn != '' && this.filterOut == '') {
                    for (item of this.itemsIn) {
                        if (item.fields.fltinid == this.filterIn) {
                            this.itemsFilteredIn.push(item);
                            break;
                        }
                    }
                    for (itemInOut of this.itemsInOut) {
                        if (itemInOut.fields.fltinid == this.filterIn) {
                            for (itemOut of this.itemsOut) {
                                if (itemOut.fields.fltoutid == itemInOut.fields.fltoutid) {
                                    this.itemsFilteredOut.push(itemOut);
                                    break;
                                }
                            }
                        }
                    }
                } else if (this.filterOut != '' && this.filterIn == '') {
                    for (item of this.itemsOut) {
                        if (item.fields.fltoutid == this.filterOut) {
                            this.itemsFilteredOut.push(item);
                            break;
                        }
                    }
                    for (itemInOut of this.itemsInOut) {
                        if (itemInOut.fields.fltoutid == this.filterOut) {
                            for (itemIn of this.itemsIn) {
                                if (itemIn.fields.fltinid == itemInOut.fields.fltinid) {
                                    this.itemsFilteredIn.push(itemIn);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    this.itemsFilteredIn = [];
                    this.itemsFilteredOut = [];
                    let aux;
                    let lowerDate = new Date();
                    let higherGMTDate = util.addMinutesToDate(new Date(lowerDate.toGMTString()), 16*60);
                    let lowerGMTDateIn = util.addMinutesToDate(new Date(lowerDate.toGMTString()), -30);
                    let lowerGMTDateOut = util.addMinutesToDate(new Date(lowerDate.toGMTString()), -10);
                    
                    for (itemIn of this.itemsIn) {
                        var auxDate = (itemIn.fields.gmtata != null) ? itemIn.fields.gmtata : (itemIn.fields.gmteta != null) ? itemIn.fields.gmteta : itemIn.fields.gmtsta;
                        aux = new Date(auxDate + '+00:00');
                        if (aux < higherGMTDate) {
                            if (itemIn.fields.gmtata == null) {
                                this.itemsFilteredIn.push(itemIn);
                            } else if (aux > lowerGMTDateIn) {
                                this.itemsFilteredIn.push(itemIn);
                            }
                        }
                    }
                    for (itemOut of this.itemsOut) {
                        auxDate = (itemOut.fields.gmtatd != null) ? itemOut.fields.gmtatd : (itemOut.fields.gmtetd != null) ? itemOut.fields.gmtetd : itemOut.fields.gmtstd;
                        aux = new Date(auxDate + '+00:00');
                        if (aux < higherGMTDate) {
                            if (itemOut.fields.gmtatd == null) {
                                this.itemsFilteredOut.push(itemOut);
                            } else if (aux > lowerGMTDateOut) {
                                this.itemsFilteredOut.push(itemOut);
                            }
                        }
                    }
                    this.filterIn = '';
                    this.filterOut = '';
                }
            },
            clearFilters() {
                this.filterIn = '';
                this.filterOut = '';
                this.filter();
            },
            isFiltered() {
                return (this.filterIn != '' || this.filterOut != '');
            },
            flight() {
                if (this.isFiltered()) {
                    let flight = null;
                    if (this.filterOut != '') {
                        flight = this.itemsFilteredOut[0];
                    }
                    else {
                        flight = this.itemsFilteredIn[0];
                    }
                    return flight;
                }
            },
            filteredFlight() {
                let flight = this.flight();
                return flight.fields.fltnr;
            },
            filteredToFrom() {
                let flight = this.flight();
                return flight.fields.from_iata + ' - ' + flight.fields.to_iata;
            },
            filteredRegistration() {
                let flight = this.flight();
                return flight.fields.ac_registration;
            },
            filteredBTD() {
                let flight = this.flight();
                return 'BTD: ' + this.formatBTD(flight.fields);
            },
            filteredBTA() {
                let flight = this.flight();
                return 'BTA: ' + this.formatBTA(flight.fields);
            },
            doFilterIn(fltinid) {
                this.filterIn = fltinid;
                this.filterOut = '';
                this.filter();
            },
            doFilterOut(fltoutid) {
                this.filterOut = fltoutid;
                this.filterIn = '';
                this.filter();
            },
            isBoarding(bagboardts, atd) {
                return util.isBoarding(bagboardts, atd);
            },
            isIrregular(status) {
                return util.isCanceled(status);
            },
            isInFlight(item) {
                return util.isInFlight(item.atd, item.ata);
            },
            flightRef(item) {
                let flightref = 'http://www.radarbox.com/flight/' + item.fltnr.slice(0, 2) + Number(item.fltnr.slice(-4)).toString();
                if (this.isInFlight(item)) window.open(flightref, '_blank');
                return ''
            },
            formatDate(date) {
                return util.formatDayHours(date);
            },
            formatBTA(item) {
                if (item.sta == null) return '';
                if (item.ata != dateNull) return util.formatDayHours(item.ata) + 'A';
                if (item.eta != dateNull && item.eta != item.sta) return util.formatDayHours(item.eta) + 'E';
                return util.formatDayHours(item.sta);
            },
            formatSTA(item) {
                if (item.sta == null) return '';
                return util.formatDayHours(item.sta);
            },
            formatUTA(item) {
                if (item.sta == null) return '';
                if (item.ata != dateNull) return util.formatDayHours(item.ata) + 'A';
                if (item.eta != dateNull && item.eta != item.sta) return util.formatDayHours(item.eta) + 'E';
                return "";
            },
            formatBTD(item) {
                if (item.std == null) return '';
                if (item.atd != dateNull) return util.formatDayHours(item.atd) + 'A';
                if (item.etd != dateNull && item.etd != item.std) return util.formatDayHours(item.etd) + 'E';
                return util.formatDayHours(item.std);
            },
            formatSTD(item){
                if(item.std != dateNull) return util.formatDayHours(item.std)
                return ""
            },
            formatUTD(item){
                if (item.atd != dateNull) return util.formatDayHours(item.atd) + 'A';
                if (item.etd != dateNull) return util.formatDayHours(item.etd) + 'E';
                return '';
            },
            getBTAText(item) {
                if (item.sta == null) return '';
                if (item.ata != dateNull) return 'STA: ' + util.formatDayHours(item.sta) + ' / ETA: ' + util.formatDayHours(item.eta) + ' / ATA: ' + util.formatDayHours(item.ata);
                if (item.eta != dateNull && item.eta != item.sta) return 'STA: ' + util.formatDayHours(item.sta) + ' / ETA: ' + util.formatDayHours(item.eta);
                return 'STA: ' + util.formatDayHours(item.sta);
            },
            getBTDText(item) {
                if (item.std == null) return '';
                if (item.atd != dateNull) return 'STD: ' + util.formatDayHours(item.std) + ' / ETD: ' + util.formatDayHours(item.etd) + ' / ATD: ' + util.formatDayHours(item.atd);
                if (item.etd != dateNull && item.etd != item.std) return 'STD: ' + util.formatDayHours(item.std) + ' / ETD: ' + util.formatDayHours(item.etd);
                return 'STD: ' + util.formatDayHours(item.std);
            },
            formatFrom(item) {
                if (item.arr_from == null || item.arr_from == '') return '';
                return item.arr_from + ' ' + util.formatFlight(item.arr_operator, item.arr_fltnr);
            },
            formatTo(item) {
                if (item.dep_to == null || item.dep_to == '') return '';
                return item.dep_to + ' ' + util.formatFlight(item.dep_operator, item.dep_fltnr);
            },
            formatLT(fields) {
                var tzdep = util.getTimezone(fields.from_iata, this.itemsStation, this.itemsStationTimezones);
                if (tzdep == undefined) {
                    tzdep = this.timezone;
                }
                return  util.formatLT(fields.sta, fields.eta, fields.ata, fields.std, fields.etd, fields.atd, this.rules, this.timezone, tzdep);
            },
            getLTText(fields) {
                var tzdep = util.getTimezone(fields.from_iata, this.itemsStation, this.itemsStationTimezones);
                return (util.formatLT(fields.sta, fields.eta, fields.ata, fields.std, fields.etd, fields.atd, this.rules, this.timezone, tzdep) != util.green) ? 
                    util.getLTText(fields.sta, fields.eta, fields.ata, fields.std, fields.etd, fields.atd, this.rules, this.timezone, tzdep) + ' Min' : 'Ok';
            },
            formatBagMI(fields) {
                return util.formatBagMI(fields.std, fields.etd, fields.atd, fields.bagtotal, fields.bagproc, fields.paxtotal, fields.bagboard, this.rules);
            },
            getBagMIText(fields) {
                return util.getBagMIText(fields.std, fields.etd, fields.atd, fields.bagtotal, fields.bagproc, fields.paxtotal, fields.bagboard, this.rules);
            },
            formatCF(fields) {
                return util.formatCF(fields.cf, this.rules);
            },
            getCFText(fields) {
                return util.getCFText(fields.cf, this.rules);
            },
            formatBagMO(fields) {
                return util.formatBagMO(fields.std, fields.etd, fields.atd, fields.bagtotal, fields.bagproc, fields.paxtotal, fields.bagboard, this.rules);
            },
            getBagMOText(fields) {
                return util.getBagMOText(fields.std, fields.etd, fields.atd, fields.bagtotal, fields.bagproc, fields.paxtotal, fields.bagboard, this.rules);
            },
            formatPT(fields) {
                return util.formatPT(fields.pt, this.rules);
            },
            getPTText(fields) {
                return util.getPTText(fields.pt, this.rules);
            },
            formatH2H(fields) {
                return util.formatH2H(fields.h2h, this.rules);
            },
            getH2HText(fields) {
                return util.getH2HText(fields.h2h, this.rules);
            },
            formatPrio(fields) {
                return util.formatPrio(fields.fltoutid, this.priorityFlights);
            },
            formatOTP(fields) {
                if (util.isCanceled(fields.status)) return util.green;
                return util.formatOTP(fields.std, fields.etd, fields.atd, this.rules, this.timezone);
            },
            formatOTPMin(fields) {
                if (util.isCanceled(fields.status)) return '';
                return util.formatOTPMin(fields.std, fields.etd, fields.atd, this.rules, this.timezone);
            },
            formatIcon(color) {
                return util.formatIcon(color);
            },
            formatBagPer(value, base) {
                return util.formatBagPer(value, base);
            },
            formatPTPer(value, base) {
                return util.formatPTPer(value, base);
            },
            formatFlight(operator, fltnr) {
                return util.formatFlight(operator, fltnr);
            },
            formatBaggage(fields) {
                var h2h = this.formatH2H(fields);
                var bagmo = this.formatBagMO(fields);

                if(typeof (fields.atd) != 'undefined' && fields.atd != null && fields.atd != this.dateNull) {
                    return util.green;
                }
                if (bagmo == util.red || h2h == util.red) {
                    return util.red;
                }
                if (bagmo == util.yellow || h2h == util.yellow) {
                    return util.yellow;
                }
                return util.green;
            },
            formatPercentage(value, base) {
                if (base == null ||base == 0) return 0;
                let percentage = this.formatBagPer(value,base);
                if(percentage > 94 && percentage < 100) return 100;
                return percentage;
            },
            formatBaggagePer(fields) {
                var per = this.formatBagPer(fields.bagproc, fields.bagtotal);
                var text = "";
                if (per > 95 && typeof (fields.atd) != 'undefined' && fields.atd != null && fields.atd != this.dateNull) {
                    text = '100%*'
                }
                if (per == 0) {
                    text = ''
                }
                else if (per > 94 && per < 100) {
                    text = '100%*'
                } else {
                    text = '' + per + '%'
                }
                if(!fields.bagproc || !fields.bagtotal || per == 0 || per > 94 && per < 100 || per == 100 ) return text;
                return `${text} / Missing: ${fields.bagtotal - fields.bagproc}`

            },
            getBaggageText(fields) {
                var h2h = this.formatH2H(fields);
                var bagmo = this.formatBagMO(fields);

                var text = '';
                if(this.formatBaggagePer(fields)) text += `Bag: ${this.formatBaggagePer(fields)}`;
                if (bagmo != util.green) {
                    if (text != '') {
                        text += '; ';
                    }
                    text += 'BagM: ' + this.getBagMOText(fields);
                }
                if (h2h != util.green) {
                    if (text != '') {
                        text += '; ';
                    }
                    text += 'H2H: ' + this.getH2HText(fields);
                }
                if (text != '') {
                    return text;
                } else {
                    return 'Ok';
                }
            },
            formatPassenger(fields) {
                var pt = this.formatPT(fields);

                if (pt == util.red) {
                    return util.red;
                }
                if (pt == util.yellow) {
                    return util.yellow;
                }
                return util.green;
            },
            formatPassengerPer(fields) {
                var per = this.formatPTPer(fields.bagboard, fields.paxtotal)
                let text = ""
                if (per == 0) {
                    text = ''
                }
                else if (per > 94 && per < 100) {
                    text = '100%*'
                } else {
                    text = '' + per + '%'
                }
                if(!fields.bagboard || !fields.paxtotal || per == 0 || per > 94 && per < 100 || per == 100 ) return text;
                return `${text} / Missing: ${fields.paxtotal - fields.bagboard}`
            },
            getPassengerText(fields) {
                var pt = this.formatPT(fields);

                var text = '';
                if(this.formatPassengerPer(fields)) text += `Pas: ${this.formatPassengerPer(fields)}`;
                if (pt != util.green) {
                    if (text != '') {
                        text += '; ';
                    }
                    text += 'PT: ' + this.getPTText(fields);
                }
                if (text != '') {
                    return text;
                } else {
                    return 'Ok';
                }
            },
            formatARDT(fields) {
                return util.formatARDT(fields.std, fields.etd, fields.atd, fields.ardt, this.rules);
            },
            getARDTText(fields) {
                return util.getARDTText(fields.std, fields.etd, fields.atd, fields.ardt, this.rules);
            },
            formatARDTDate(fields) {
                if (typeof (fields.ardt) != 'undefined' && fields.ardt != null && fields.ardt != this.dateNull) {
                    return this.formatDate(fields.ardt);
                } else {
                    return ""
                }
            },
            formatTSAT(fields) {
                return util.formatTSAT(fields.std, fields.etd, fields.atd, fields.tsat, this.rules);
            },
            getTSATText(fields) {
                return util.getTSATText(fields.std, fields.etd, fields.atd, fields.tsat, this.rules);
            },
            formatTSATDate(fields) {
                if (typeof (fields.tsat) != 'undefined' && fields.tsat != null && fields.tsat != this.dateNull) {
                    return this.formatDate(fields.tsat);
                } else {
                    return ""
                } 
            },
            formatTOBTDate(fields){
                if (fields.tobt) {
                    return this.formatDate(fields.tobt);
                } else {
                    return ""
                } 
            },
            formatCTOTDate(fields){
                if (fields.ctot) {
                    return this.formatDate(fields.ctot);
                } else {
                    return ""
                } 
            },
            formatTSATARDTDate(fields) {
                var tsattext = this.formatTSATDate(fields);
                var ardttext = this.formatARDTDate(fields);
                if (tsattext == "-" && ardttext == "-") {
                    return ""
                } else {
                    return tsattext + " / " + ardttext;        
                }
            },
            formatTSATARDT(fields) {
                var tsat = this.formatTSAT(fields);
                var ardt = this.formatARDT(fields);
                if (tsat == util.red || ardt == util.red) {
                    var splitRed = util.red.split(' ');
                    return splitRed[0] + "--text" + " text--" + splitRed[0] + " font-weight-bold";
                } else if (tsat == util.yellow || ardt == util.yellow) {
                    var splitYellow = util.yellow.split(' ');
                    return splitYellow[0] + "--text" + " text--" + splitYellow[0] + " font-weight-bold";
                }
                return '';
            },
            formatUTDDate(fields) {
                var utd = this.formatOTP(fields);
                if (utd == util.red || utd == util.red) {
                    var splitRed = util.red.split(' ');
                    return splitRed[0] + "--text" + " text--" + splitRed[0] + " font-weight-bold";
                } else if (utd == util.yellow || utd == util.yellow) {
                    var splitYellow = util.yellow.split(' ');
                    return splitYellow[0] + "--text" + " text--" + splitYellow[0] + " font-weight-bold";
                }
                return '';
            },
            formatUTADate(fields) {
                var uta = this.formatLT(fields);
                if (uta == util.red || uta == util.red) {
                    var splitRed = util.red.split(' ');
                    return splitRed[0] + "--text" + " text--" + splitRed[0] + " font-weight-bold";
                } else if (uta == util.yellow || uta == util.yellow) {
                    var splitYellow = util.yellow.split(' ');
                    return splitYellow[0] + "--text" + " text--" + splitYellow[0] + " font-weight-bold";
                }
                return '';
            },
            getTSATARDTText(fields) {
                var tsat = this.formatTSAT(fields);
                var ardt = this.formatARDT(fields);
                var text = "";
                if (tsat != util.green) {
                    text += "TSAT: " + this.getTSATText(fields) + " ";
                }
                if (ardt != util.green) {
                    text += "ARDT: " + this.getARDTText(fields) + " ";
                }
                if (tsat == util.green && ardt == util.green) {
                    text = "Ok";
                }
                return text;
            },
            formatAC(fields) {
                if (fields.ac_registration != null) return fields.ac_registration.slice(2);
                return '';
            },
            classes(date, status) {
                if (util.isCanceled(status)) {
                    if (this.darkMode == true) {
                        return 'style-canceled-dark px-1 py-0 ma-0 text-caption';
                    }
                    else {
                        return 'style-canceled px-1 py-0 ma-0 text-caption';
                    }
                } 

                if (date == null || date == '' || date == dateNull) {
                    return 'style-row px-1 py-0 ma-0 text-caption';
                }
                else {
                    if (this.darkMode == true) {
                        return 'style-actual-dark px-1 py-0 ma-0 text-caption';
                    }
                    else {
                        return 'style-actual px-1 py-0 ma-0 text-caption';
                    }
                }
            },
            getArrClass(item) {
                let currentDate = util.convertTZ(new Date(), this.timezone);
                let sta = new Date(item.gmtsta + '+00:00');
                if (item.gmteta != null && item.gmteta != '' && item.gmteta != dateNull) {
                    sta = new Date(item.gmteta + '+00:00');
                }
                if (util.isCanceled(item.status) == false && (item.ata == null || item.ata == '' || item.ata == dateNull) && currentDate > sta) {
                    if (this.darkMode == true) {
                        return 'style-nodata-dark px-1 py-0 ma-0 text-caption';
                    }
                    else {
                        return 'style-nodata px-1 py-0 ma-0 text-caption';
                    }
                }
                return this.classes(item.ata, item.status);
            },
            getDepClass(item) {
                let currentDate = util.convertTZ(new Date(), this.timezone);
                let std = new Date(item.gmtstd + '+00:00');
                if (item.gmtetd != null && item.gmtetd != '' && item.gmtetd != dateNull) {
                    std = new Date(item.gmtetd + '+00:00');
                }
                if (util.isCanceled(item.status) == false && (item.atd == null || item.atd == '' || item.atd == dateNull) && currentDate > std) {
                    if (this.darkMode == true) {
                        return 'style-nodata-dark px-1 py-0 ma-0 text-caption';
                    }
                    else {
                        return 'style-nodata px-1 py-0 ma-0 text-caption';
                    }
                }
                return this.classes(item.atd, item.status);
            },
            getTurnaroundClass(item) {
                let limits = util.getTurnaroundLimits(this.hub);
                let turnaround = this.formatTurnaround(item);
                let style = 'style-principal';
                if (turnaround <= limits[1]) style = 'style-turnaround-yellow';
                if (turnaround <= limits[0]) style = 'style-turnaround-red';
                if (turnaround === '') style = 'style-principal';

                if (this.darkMode == true) {
                    style = style + '-dark';
                }

                return style;
            },
            pushFlight(item) {
                if (this.formatBagMO(item) != util.green) this.$router.push('/bagsflight/' + item.fltoutid);
            },
            pushH2H(item) {
                if (this.formatH2H(item) != util.green) this.$router.push('/h2h/' + item.fltoutid);
            },
            pushPT(item) {
                if (this.formatPT(item) != util.green) this.$router.push('/d2d/' + item.fltoutid);
            },
            closepopup() {
                this.dashboard.fltnum = '';
                this.dashboard.from = '';
                this.dashboard.to = '';
                this.dashboard.ac_registration = '';
                this.dashboard.std = '';
                this.dashboard.etd = '';
                this.dashboard.atd = '';
                this.dashboard.doorclose = '';
                this.dashboard.sta = '';
                this.dashboard.eta = '';
                this.dashboard.ata = '';
                this.dashboard.onblock = '';
                this.dashboard.dooropen = '';
                this.dashboard.doorclosed = '';
                this.dashboard.from_terminal = '';
                this.dashboard.from_stand = '';
                this.dashboard.from_gate = '';
                this.dashboard.to_terminal = '';
                this.dashboard.to_stand = '';
                this.dashboard.to_belt = '';
                this.dashboard.baglocal = '';
                this.dashboard.bagtransfer = '';
                this.dashboard.bagrush = '';
                this.dashboard.baguna = '';
                this.dashboard.bagtotal = '';
                this.dashboard.bagproc = '';
                this.dashboard.bagboard = '';
                this.popupdashboard = false;
            },
            openFlightTotals(item) {
                this.dashboard = JSON.parse(JSON.stringify(item));
                this.popupdashboard = true;
            },
            getHeadersIn(i) {
                return this.headersIn[i]['text'];
            },
            getHeadersOut(i) {
                return this.headersOut[i]['text'];
            },
            getPictureMobileSize() {
                if (!this.isMobile) return 80;
                else return 20;
            },
            openMessageDialog() {
                this.$router.push({ path: '/messages/-1' });
            },
            openMessagesFlightDialog(id) {
                this.$router.push({ path: '/messages/' + id });
            },
            changePriority(fields) {
                let index = this.priorityFlights.findIndex(flight => flight.pk === fields.fltoutid);
                if (index !== -1) {
                    this.priorityFlights.splice(index, 1);
                } else {
                    this.priorityFlights.push({ 'pk': fields.fltoutid });
                }
                this.dataAccess.changePriority('cntrlview', fields.fltoutid).then(() => {
                    this.getPriorityFlights('cntrl_view', this.hub);
                });
            }
        },
    mounted() {
            this.hub = this.$store.getters.hub;
            this.timezone = this.$store.getters.timezone;
            this.dataAccess = new DataAccess(this.$msal);
            this.getRules('cntrlview', this.hub);
            this.getViewInOut('cntrlview', this.hub);
            this.getControlViewIn('cntrlview', this.hub);
            this.getControlViewOut('cntrlview', this.hub);
            this.timer = setInterval(function () {
                this.getStationList();
                this.getRules('cntrlview', this.hub);
                this.getViewInOut('cntrlview', this.hub);
                this.getControlViewIn('cntrlview', this.hub);
                this.getControlViewOut('cntrlview', this.hub);
                this.getPriorityFlights('cntrlview', this.hub);
                this.getMessages();
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

    .style-nodata {
        vertical-align: middle;
        background-color: #FFECB3;
    }
    .style-nodata-dark {
        vertical-align: middle;
        background-color: #725604;
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
        background-color: #FFAB00;
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
        height: 20px;
    }

    .flex-content {
        list-style: none;
        font-weight: bold;
        height: 24px;
    }

    .content-left {
        text-align: left
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

