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
            <v-col v-if="home" md="3">
                <v-switch v-model="allSwitch"
                          label="All Flights"
                          color="red darken-3"
                          hide-details></v-switch>
            </v-col>
            <v-spacer></v-spacer>
            <v-col md="1" class="text-right">
                <v-icon @click="openMessageDialog()">mdi-message-reply-text</v-icon>
            </v-col>
        </v-row>
        <v-row no-gutters class="pa-1 ma-0" justify="start">
            <v-col cols="5" sm="6">
                <strong>ARRIVALS </strong><v-icon color="#FFD600">mdi-airplane-landing</v-icon>
            </v-col>
            <v-col cols="2" sm="2" class="justify-space-around text-caption">
                <v-icon medium class="ma-0 pa-0" color="red darken-4" v-if="refresh">
                    mdi-web
                </v-icon><span v-if="refresh" class="red--text text--darken-4">Loading...</span>
            </v-col>
            <v-col cols="5" sm="3">
                <strong>DEPARTURES </strong><v-icon color="#1A237E">mdi-airplane-takeoff</v-icon>
            </v-col>
            <v-col cols="12" sm="1">
                <v-text-field dense
                              color="#B71C1C"
                              v-model="search"
                              append-icon="mdi-magnify"
                              label="Tail"
                              single-line
                              hide-details></v-text-field>
            </v-col>
        </v-row>
        <v-row no-gutters
               class="justify-space-around">
            <v-col cols="12">
                <v-layout v-resize="onResize" child-flex class="table-container">
                    <v-data-table dense
                                  :headers="headers"
                                  :items="items"
                                  :search="search"
                                  hide-default-footer
                                  disable-pagination
                                  :hide-default-header="isMobile"
                                  class="ma-0 pa-0 flex-table"
                                  fixed-header
                                  >
                        <template #item="{ item }">
                            <tr v-if="!isMobile">
                                <!-- A/C -->
                                <td :class="baseClass()" align="left">{{ formatAC(item) }}</td>
                                <!-- From -->
                                <td :class="getArrClass(item)" align="left"><a @click="openMessagesFlightDialog(item.arr_flightid)">{{ formatFrom(item) }}</a></td>
                                <!-- STA -->
                                <td :class="getArrClass(item)" align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                {{ formatSTA(item) }}
                                            </span>
                                        </template>
                                        <span>{{ getSTAText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                <!-- UTA -->
                                <td :class="getArrClass(item)" align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on" :class="formatUTADate(item)">
                                                {{ formatUTA(item) }}
                                            </span>
                                        </template>
                                        <span>{{ getSTAText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                <!-- PAX -->
                                <td :class="getArrClass(item)" align="center">{{ item.arr_pax }}</td>
                                <!-- CI -->
                                <td :class="getArrClass(item)" align="center">{{ formatCargo(item.arr_cargo) }}</td>
                                <!-- Passenger -->
                                <td :class="getArrClass(item)" align="left">
                                    <div v-if="item.arr_fltnr == null"></div>
                                    <div v-else class="content-left">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <div v-if="item.arr_paxaut == null || item.arr_paxaut == 0">
                                                    <v-icon size="20" class="ml-4" color="#BDBDBD" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else-if="item.arr_paxaut == item.arr_paxboard">
                                                    <v-icon size="20" class="ml-4" color="#4CAF50" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else-if="item.arr_paxboard / item.arr_paxaut > 0.94">
                                                    <v-icon size="20" class="ml-4" color="#4CAF50" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else-if="item.arr_paxboard == 0">
                                                    <v-icon size="20" class="ml-4" color="#BDBDBD" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-progress-circular class="ml-4" size="19" width="6" v-bind="attrs" v-on="on"
                                                                         :value="formatPercentage(item.arr_paxboard, item.arr_paxaut)"
                                                                         :color="formatOTP(item)"></v-progress-circular>
                                                    <span> {{ item.arr_paxaut - item.arr_paxboard }}</span>
                                                </div>
                                            </template>
                                            <span>Pax: {{ formatPercentageText(item.arr_paxboard, item.arr_paxaut) }}</span>
                                        </v-tooltip>
                                    </div>
                                </td>
                                <!-- Stand In -->
                                <td :class="baseClass()" align="center">{{ item.arr_stand }}</td>
                                <!-- Turnaround -->
                                <td :class="getTurnaroundClass(item)" align="center"><strong>{{ formatTurnaround(item) }}</strong></td>
                                <!-- Stand Out -->
                                <td :class="baseClass()" align="center">{{ formatDepStand(item) }}</td>
                                <!-- CO -->
                                <td :class="getDepClass(item)" align="center">{{ formatCargo(item.dep_cargo) }}</td>
                                <!-- PAX -->
                                <td :class="getDepClass(item)" align="center">{{ item.dep_pax }}</td>
                                <!-- Passenger -->
                                <td :class="getDepClass(item)" align="left">
                                    <div v-if="item.dep_fltnr == null"></div>
                                    <div v-else>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <div v-if="!item.dep_paxboard || !item.dep_paxaut || item.dep_paxaut == item.dep_paxboard || (formatPercentage(item.dep_paxboard, item.dep_paxaut) > 94)">
                                                    <v-icon class="ml-4" size="20" :color="formatDepPtColor(item)" v-bind="attrs" v-on="on">{{formatIcon(formatDepPtColor(item))}}</v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-progress-circular class="ml-4" size="19" width="6" v-bind="attrs" v-on="on"
                                                                         :value="formatPercentage(item.dep_paxboard, item.dep_paxaut)"
                                                                         :color="formatDepPtColor(item)"></v-progress-circular>
                                                    <span v-on="on"> {{ item.dep_paxaut - item.dep_paxboard }}</span>
                                                </div>
                                            </template>
                                            <span>Pax: {{ formatPercentageText(item.dep_paxboard, item.dep_paxaut) }}</span>
                                        </v-tooltip>
                                    </div>
                                </td>
                                <!-- Baggage -->
                                <td :class="getDepClass(item)" align="left">
                                    <div v-if="item.dep_fltnr == null"></div>
                                    <div v-else class="content-left">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <div v-if="!item.dep_bagaut || !item.dep_bagproc || item.dep_bagaut == item.dep_bagproc || (formatPercentage(item.dep_bagproc,item.dep_bagaut) > 94)">
                                                    <v-icon class="ml-4" size="20" :color="formatDepBagColor(item)" v-bind="attrs" v-on="on">{{formatIcon(formatDepBagColor(item))}}</v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-progress-circular class="ml-4" size="19" width="6" v-bind="attrs" v-on="on"
                                                                         :value="formatPercentage(item.dep_bagproc,item.dep_bagaut)"
                                                                         :color="formatDepBagColor(item)"></v-progress-circular>
                                                    <span> {{ item.dep_bagaut - item.dep_bagproc }}</span>
                                                </div>
                                            </template>
                                            <span>Bag: {{ formatPercentageText(item.dep_bagproc,item.dep_bagaut) }}</span>
                                        </v-tooltip>
                                    </div>
                                </td>
                                <!-- To -->
                                <td :class="getDepClass(item)" align="center"><a @click="openMessagesFlightDialog(item.arr_flightid)">{{ formatTo(item) }}</a></td>
                                <!-- STD -->
                                <td :class="getDepClass(item)" align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">
                                                {{ formatSTD(item) }}
                                            </span>
                                        </template>
                                        <span>{{ getSTDText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                 <!-- UTD -->
                                 <td :class="getDepClass(item)" align="center">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on" :class="formatUTDDate
                                            (item)">
                                                {{ formatUTD(item) }}
                                            </span>
                                        </template>
                                        <span>{{ getSTDText(item) }}</span>
                                    </v-tooltip>
                                </td>
                                <!-- TSAT -->
                                <td :class="getDepClass(item)" align="center">
                                    <span>
                                        {{ formatTSATDate(item) }}
                                    </span>
                                </td>
                                <!-- ARDT -->
                                <td :class="getDepClass(item)" align="center">
                                    <span>
                                        {{ formatARDTDate(item) }}
                                    </span>
                                </td>
                                <!-- TOBT -->
                                <td :class="getDepClass(item)" align="center">
                                    <span>
                                        {{ formatTOBTDate(item) }}
                                    </span>
                                </td>
                                <!-- CTOT -->
                                <td :class="getDepClass(item)" align="center">
                                    <span>
                                        {{ formatCTOTDate(item) }}
                                    </span>
                                </td>
                                <!-- Prio -->
                                <td :class="getDepClass(item)" align="center">
                                    <div v-if="item.dep_fltnr == null"></div>
                                    <div v-else><v-icon medium
                                                class="ma-0 pa-0" :color="formatPrio(item)"
                                                @click="changePriority(item)">
                                            {{ formatIcon(formatPrio(item)) }}
                                        </v-icon>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else>
                                <td :class="getClass(item)">
                                    <v-list-item-group class="d-flex justify-space-around flex-wrap pa-0 ma-0">
                                        <!-- A/C -->
                                        <v-col cols="12" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(0)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatAC(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- From -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(1)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatFrom(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- STA -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(2)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatSTA(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- UTA -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(3)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span v-on="on" :class="formatUTADate(item)">
                                                            {{ formatUTA(item) }}
                                                        </span>
                                                    </template>
                                                    <span>{{ getSTAText(item) }}</span>
                                                </v-tooltip>
                                            </v-list-item-title>
                                        </v-col>
                                        <!-- PAX -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(4)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="item.arr_pax" @click="openMessagesFlightDialog(item.arr_flightid)"></v-list-item-title>
                                        </v-col>
                                        <!-- CI -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(5)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatCargo(item.arr_cargo)"></v-list-item-title>
                                        </v-col>
                                        <!-- Arr Pax % -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(6)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption">
                                                <div v-if="item.arr_fltnr == null"></div>
                                                <div v-else>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <div v-if="item.arr_paxaut == null || item.arr_paxaut == 0">
                                                                <v-icon size="10" color="#BDBDBD" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                            </div>
                                                            <div v-else-if="item.arr_paxaut == item.arr_paxboard">
                                                                <v-icon size="10" color="#4CAF50" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                            </div>
                                                            <div v-else-if="item.arr_paxboard / item.arr_paxaut > 0.94">
                                                                <v-icon size="10" color="#4CAF50" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                            </div>
                                                            <div v-else-if="item.arr_paxboard == 0">
                                                                <v-icon size="10" color="#BDBDBD" v-bind="attrs" v-on="on">mdi-panorama-fisheye</v-icon>
                                                            </div>
                                                            <div v-else>
                                                                <v-progress-circular size="9" width="1" v-bind="attrs" v-on="on"
                                                                                     :value="formatPercentage(item.arr_paxboard, item.arr_paxaut)"
                                                                                     color="#536DFE"></v-progress-circular>
                                                                <span> {{ item.arr_paxaut - item.arr_paxboard }}</span>
                                                            </div>
                                                        </template>
                                                        <span>Pax: {{ formatPercentageText(item.arr_paxboard, item.arr_paxaut) }}</span>
                                                    </v-tooltip>
                                                </div>
                                            </v-list-item-title>
                                        </v-col>
                                        <!-- Stand In -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(7)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="item.arr_stand"></v-list-item-title>
                                        </v-col>
                                        <!-- Turnaround -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(8)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatTurnaround(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- Stand Out -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(9)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatDepStand(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- CO -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(10)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatCargo(item.dep_cargo)"></v-list-item-title>
                                        </v-col>
                                        <!-- PAX -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(11)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="item.dep_pax"></v-list-item-title>
                                        </v-col>
                                        <!-- Dep Pax % -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(12)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption">
                                                <div v-if="item.dep_fltnr == null"></div>
                                                <div v-else>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <div v-if="!item.dep_paxboard || !item.dep_paxaut || item.dep_paxaut == item.dep_paxboard || (item.dep_paxboard / item.dep_paxaut > 0.94)">
                                                                <v-icon size="10" :color="formatDepPtColor(item)" v-bind="attrs" v-on="on">{{formatIcon(formatDepPtColor(item))}}</v-icon>
                                                            </div>
                                                            <div v-else>
                                                                <v-progress-circular size="9" width="1" v-bind="attrs" v-on="on"
                                                                                     :value="formatPercentage(item.dep_paxboard, item.dep_paxaut)"
                                                                                     :color="formatDepPtColor(item)"></v-progress-circular>
                                                                <span> {{ item.dep_paxaut - item.dep_paxboard }}</span>
                                                            </div>
                                                        </template>
                                                        <span>Pax: {{ formatPercentageText(item.dep_paxboard, item.dep_paxaut) }}</span>
                                                    </v-tooltip>
                                                </div>
                                            </v-list-item-title>
                                        </v-col>
                                        <!-- Dep Bag % -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(13)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption">
                                                <div v-if="item.dep_fltnr == null"></div>
                                                <div v-else>
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <div v-if="!item.dep_bagaut || !item.dep_bagproc || item.dep_bagaut == item.dep_bagproc || (item.dep_bagproc / item.dep_bagaut > 0.94)">
                                                                <v-icon size="10" :color="formatDepBagColor(item)" v-bind="attrs" v-on="on">{{formatIcon(formatDepBagColor(item))}}</v-icon>
                                                            </div>
                                                            <div v-else>
                                                                <v-progress-circular size="9" width="1" v-bind="attrs" v-on="on"
                                                                                     :value="formatPercentage(item.dep_bagproc,item.dep_bagaut)"
                                                                                     :color="formatDepBagColor(item)"></v-progress-circular>
                                                                <span> {{ item.dep_bagaut - item.dep_bagproc }}</span>
                                                            </div>
                                                        </template>
                                                        <span>Bag: {{ formatPercentageText(item.dep_bagproc,item.dep_bagaut) }}</span>
                                                    </v-tooltip>
                                                </div>
                                            </v-list-item-title>
                                        </v-col>
                                        <!-- To -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(14)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatTo(item)" @click="openMessagesFlightDialog(item.to_flightid)"></v-list-item-title>
                                        </v-col>
                                        <!-- STD -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(15)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatSTD(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- UTD -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(16)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span v-on="on" :class="formatUTDDate(item)">
                                                            {{ formatUTD(item) }}
                                                        </span>
                                                    </template>
                                                    <span>{{ getSTDText(item) }}</span>
                                                </v-tooltip>
                                            </v-list-item-title>
                                        </v-col>
                                        <!-- TSAT -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(17)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatTSATDate(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- ARDT -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(18)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatARDTDate(item)"></v-list-item-title>
                                        </v-col>
                                         <!-- TOBT -->
                                         <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(19)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatTOBTDate(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- CTOT -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(20)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption" v-text="formatCTOTDate(item)"></v-list-item-title>
                                        </v-col>
                                        <!-- Prio -->
                                        <v-col cols="4" class="mx-0 my-1 pa-0">
                                            <v-list-item-subtitle class="flex-header text-caption" v-text="getHeaders(21)"></v-list-item-subtitle>
                                            <v-list-item-title class="flex-content text-caption">
                                                <div v-if="item.dep_fltnr == null"></div>
                                                <div v-else><v-icon medium
                                                        class="ma-0 pa-0" :color="formatPrio(item)"
                                                        @click="changePriority(item)">
                                                        {{ formatIcon(formatPrio(item)) }}
                                                    </v-icon>
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
        </v-row>
        <!-- Popup -->
        <v-dialog v-model="popupstatus"
                  max-width="400px"
                  hide-overlay
                  transition="dialog-bottom-transition">
            <v-card>
                <v-card-title class="headline lighten-2">
                    Flight Status - {{ formTitle }}
                    <v-spacer></v-spacer>
                    <v-icon medium class="mr-2" @click="closepopup()">mdi-window-close</v-icon>
                </v-card-title>
                <v-data-table dense
                              :headers="headerStatus"
                              :items="itemsStatus"
                              hide-default-footer
                              disable-pagination>
                    <template v-slot:item.status="{item}">
                        {{ capitalize(item.status) }}
                    </template>
                    <template v-slot:item.status_datetime="{item}">
                        {{ formatDate(item.status_datetime) }}
                    </template>
                    <template v-slot:item.ts="{item}">
                        {{ formatStatus(item)}}
                    </template>
                </v-data-table>
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
                timezone: this.$store.getters.timezone,
                station: this.stations,
                darkMode: this.$store.getters.darkMode, 
                home: this.homes,
                isMobile: false,
                allSwitch: false,
                search: '',
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
                    minstartboard: ''
                },
                headers: [
                    { text: 'A/C', align: 'left', sortable: false, value: 'arr_ac_registration', tip: 'Aircraft Registration' },
                    { text: 'From', align: 'center', sortable: false, value: 'arr_from', tip: 'Inbound flight Origin' },
                    { text: 'STA', align: 'center', sortable: false, value: 'sta', tip: 'Inbound flight Schedule Time of Arrival' },
                    { text: 'UTA', align: 'center', sortable: false, value: 'uta', tip: 'Inbound flight updated Arrival Time (ETA or ATA)' },
                    { text: 'Booked', align: 'center', sortable: false, value: 'arr_pax', tip: 'Inbound flight number of passengers booked' },
                    { text: 'Cargo', align: 'center', sortable: false, value: 'ci', tip: 'Inbound flight cargo weight' },
                    { text: 'Boarded', align: 'center', sortable: false, value: 'arr_board', tip: 'Inbound flight passengers boarded percentage and total passengers missing' },
                    { text: 'Stand In', align: 'center', sortable: false, value: 'arr_stand', tip: 'Inbound flight stand' },
                    { text: 'Turnaround', align: 'center', sortable: false, value: 'turnaround', tip: 'Aircraft turnaround time' },
                    { text: 'Stand Out', align: 'center', sortable: false, value: 'dep_stand', tip: 'Outbound flight stand' },
                    { text: 'Cargo', align: 'center', sortable: false,value: 'co', tip: 'Outbound flight cargo weight' },
                    { text: 'Booked', align: 'center', sortable: false, value: 'dep_pax', tip: 'Outbound flight number of passengers booked' },
                    { text: 'Boarded', align: 'center', sortable: false, value: 'dep_board', tip: 'Outbound flight passengers boarded percentage and total passengers missing' },
                    { text: 'Baggage ', align: 'center', sortable: false, value: 'dep_processing', tip: 'Outbound flight baggage percentage and total baggage missing' },
                    { text: 'To', align: 'center', sortable: false, value: 'dep_to' , tip: 'Outbound flight destination'},
                    { text: 'STD', align: 'center', sortable: false, value: 'std', tip: 'Outbound flight Schedule Time of Departure' },
                    { text: 'UTD', align: 'center', sortable: false, value: 'utd', tip: 'Outbound flight updated Depature Time (ETD or ATD)' },
                    { text: 'TSAT', align: 'center', sortable: false, value: 'dep_tsat', tip: 'Outbound flight Target Start-Up Approval Time' },
                    { text: 'ARDT', align: 'center', sortable: false, value: 'dep_ardt', tip: 'Outbound flight Aircraft Ready' },
                    { text: 'TOBT', align: 'center', sortable: false, value: 'dep_tobt', tip: 'Outbound flight Target Off-Block Time' },
                    { text: 'CTOT', align: 'center', sortable: false, value: 'dep_ctot' , tip: 'Outbound flight Calculated Take Off Time'},
                    { text: 'Prio', align: 'center', sortable: false, value: '', tip: 'Indicator of priority outbound flight' }
                ],
                headerStatus: [
                    { text: 'Status', align: 'left', sortable: false, value: 'status' },
                    { text: 'Status Date Time', align: 'center', sortable: false, value: 'status_datetime' },
                    { text: 'Timestamp', align: 'center', sortable: false, value: 'ts' }
                ],
                items: [],
                itemsStatus: [],
                itemsStation: [],
                itemsStationTimezones: [],
                priorityFlights: [],
                isdep: true,
                popupstatus: false,
                formTitle: "",
            }
        },
        watch: {
            popupstatus(val) {
                val || this.closepopup()
            },
            allSwitch(val) {
                if (val) {
                    this.station = "ALL"
                }
                else {
                    this.station = this.$store.getters.hub;
                }
                this.refreshData();
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
                console.log(this.station)
                this.getStationList();
                if (this.itemsStation.length > 0) {
                    this.getPriorityFlights();
                    console.log(this.station)
                    this.getFlightStatus('flightstatus', this.station);
                }
            },
            getRules(id, hub) {
                try {
                    this.dataAccess.getRules(id, hub).then((response) => {
                        let data = response.data[0];
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
            getFlightStatus(id, station) {
                let aux;
                let lowerDate = new Date();
                lowerDate = util.convertTZ(lowerDate, util.getTimezone(station, this.itemsStation, this.itemsStationTimezones));
                let higherGMTDate = util.addMinutesToDate(new Date(lowerDate), 16*60);
                let lowerGMTDate = util.addMinutesToDate(new Date(lowerDate), -10);

                this.refresh = true;
                this.dataAccess.getFlightStatus(id, station).then((response) => {
                    this.items = [];
                    for (let i in response.data) {
                        var arrivalDate = (response.data[i]['fields']['arr_ata'] != null) ? response.data[i]['fields']['arr_ata'] : 
                            (response.data[i]['fields']['arr_eta'] != null) ? response.data[i]['fields']['arr_eta'] : 
                                response.data[i]['fields']['arr_sta'];
                        var departureDate = (response.data[i]['fields']['dep_atd'] != null) ? response.data[i]['fields']['dep_atd'] : 
                            (response.data[i]['fields']['dep_etd'] != null) ? response.data[i]['fields']['dep_etd'] : 
                                response.data[i]['fields']['dep_std'];
                        if (departureDate != null) {
                            aux = new Date(departureDate + '+00:00');
                        } else {
                            aux = new Date(arrivalDate + '+00:00');
                        }
                        if (aux > lowerGMTDate && aux < higherGMTDate) this.items.push(response.data[i]['fields']);
                    }
                    this.refresh = false;
                    this.getMessages();
                });
            },
            getPriorityFlights() {
                this.dataAccess.getPriorityFlights('flightstatus', this.hub).then((response) => {
                    this.priorityFlights = response.data;
                });
            },
            getMessages() {
                let flightidsList = [];
                let registrationsList = [];
                for (let i in this.items) {
                    if (this.items[i].arr_flightid != null && this.items[i].arr_flightid != '') flightidsList.push(this.items[i].arr_flightid);
                    if (this.items[i].to_flightid != null && this.items[i].to_flightid != '') flightidsList.push(this.items[i].to_flightid);
                    if (this.items[i].arr_ac_registration != null && this.items[i].arr_ac_registration != '') registrationsList.push(this.items[i].arr_ac_registration);
                    if (this.items[i].dep_ac_registration != null && this.items[i].dep_ac_registration != '') registrationsList.push(this.items[i].dep_ac_registration);
                }
                this.dataAccess.getActiveMessages('flightstatus', flightidsList, registrationsList, this.station).then((response) => {
                    this.messages = '';
                    if (response.data.length == 0) this.messages = 'No messages';
                    for (let i in response.data) {
                        this.messages += this.formatMessage(response.data[i]) + '  *****  ';
                    }
                });
            },
            getStationList() {
                this.dataAccess.getStations('station').then((response) => {
                    for (var i in response.data) {
                        this.itemsStation.push(response.data[i]['fields']['station']);
                        this.itemsStationTimezones.push(response.data[i]['fields']['timezone']);
                    }
                    this.getFlightStatus('flightstatus', this.station);
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
            formatSTA(item) {
                if (item.arr_sta != dateNull) return util.formatDayHours(item.arr_sta);
                return '';
            },
            formatUTA(item){
                if (item.arr_ata != dateNull) return util.formatDayHours(item.arr_ata)+'A';
                if (item.arr_eta != dateNull) return util.formatDayHours(item.arr_eta) + 'E';
                return ""
            },
            formatSTD(item) {
                if (item.dep_std != dateNull) return util.formatDayHours(item.dep_std);
                return '';
            },
            formatUTD(item) {
                if (item.dep_atd != dateNull) return util.formatDayHours(item.dep_atd)+'A';
                if (item.dep_etd != dateNull) return util.formatDayHours(item.dep_etd)+'E';
                return '';
            },
            getSTAText(item) {
                if (item.arr_sta == null) return '';
                if (item.arr_ata != dateNull) return 'STA: ' + util.formatDayHours(item.arr_sta) + ' / ETA: ' + util.formatDayHours(item.arr_eta) + ' / ATA: ' + util.formatDayHours(item.arr_ata);
                if (item.arr_eta != dateNull && item.arr_eta != item.arr_sta) return 'STA: ' + util.formatDayHours(item.arr_sta) + ' / ETA: ' + util.formatDayHours(item.arr_eta);
                return 'STA: ' + util.formatDayHours(item.arr_sta);
            },
            getSTDText(item) {
                if (item.dep_std == null) return '';
                if (item.dep_atd != dateNull) return 'STD: ' + util.formatDayHours(item.dep_std) + ' / ETD: ' + util.formatDayHours(item.dep_etd) + ' / ATD: ' + util.formatDayHours(item.dep_atd);
                if (item.dep_etd != dateNull && item.dep_etd != item.dep_std) return 'STD: ' + util.formatDayHours(item.dep_std) + ' / ETD: ' + util.formatDayHours(item.dep_etd);
                return 'STD: ' + util.formatDayHours(item.dep_std);
            },
            formatDate(date) {
                return util.formatDayHours(date);
            },
            formatAC(item) {
                if (item.arr_ac_registration != null && item.arr_ac_registration != '') return item.arr_ac_registration.slice(2) + ' ' + item.arr_equiptype;
                if (item.dep_ac_registration != null && item.dep_ac_registration != '') return item.dep_ac_registration.slice(2) + ' ' + item.dep_equiptype;
                return '';
            },
            formatFrom(item) {
                if (item.arr_from == null || item.arr_from == '') return '';
                return item.arr_from + ' ' + util.formatFlight(item.arr_operator, item.arr_fltnr);
            },
            formatTo(item) {
                if (item.dep_to == null || item.dep_to == '') return '';
                return item.dep_to + ' ' + util.formatFlight(item.dep_operator, item.dep_fltnr);
            },
            formatCargo(cargo) {
                if (cargo == null || cargo == '') return '';
                return util.formatCargo(cargo);
            },
            formatDepStand(item) {
                if (item.dep_terminal == null || item.dep_terminal == '') return item.dep_stand;
                return item.dep_stand + ' / ' + item.dep_terminal;
            },
            formatTurnaround(item) {
                if (item.arr_sta == null || item.arr_sta == '') return '';
                if (item.dep_std == null || item.dep_std == '') return '';
                let bta = util.bestDate(item.arr_sta, item.arr_eta, item.arr_ata)
                let btd = util.bestDate(item.dep_std, item.dep_etd, item.dep_atd)
                let minutes = util.diff_minutes(new Date(bta), new Date(btd))
                return parseInt(minutes);
            },
            formatPercentage(value, base) {
                if (base == null ||base == 0) return 0;
                let percentage = Math.round((value / base) * 100);
                return percentage;
            },
            formatPercentageText(value, base) {
                var per = this.formatPercentage(value, base);
                var text = ''
                if (per == 0) {
                    text = ''
                }
                else if (per > 94 && per < 100) {
                    text = '100%*'
                } else {
                    text = per + '%'
                }
                if(!base || !value || (value / base > 0.94) || value == base) return text;
                return `${text} / Missing: ${base - value}`
            },
            formatMissing(value, base) {
                if(!base || !value || (value / base > 0.94) || value == base) return '';
                return `Missing: ${base - value}`
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
            formatDepPtColor(fields) {
                return util.formatPT(fields.dep_pt, this.rules);
            },
            formatDepBagColor(item){
                var h2h = util.formatH2H(item.dep_h2h, this.rules); 
                var bagmo = util.formatBagMO(item.dep_std, item.dep_etd, item.dep_atd, item.dep_bagaut, item.dep_bagproc, item.dep_paxaut, item.dep_paxboard, this.rules);

                if(typeof (item.dep_atd) != 'undefined' && item.dep_atd != null && item.dep_atd != this.dateNull) {
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
            formatTSATDate(item) {
                if (item.dep_tsat) {
                    return this.formatDate(item.dep_tsat);
                } else {
                    return ""
                } 
            },
            formatARDTDate(item){
                if (item.dep_ardt) {
                    return this.formatDate(item.dep_ardt);
                } else {
                    return ""
                } 
            },
            formatTOBTDate(item){
                if (item.dep_tobt) {
                    return this.formatDate(item.dep_tobt);
                } else {
                    return ""
                } 
            },
            formatCTOTDate(item){
                if (item.dep_ctot) {
                    return this.formatDate(item.dep_ctot);
                } else {
                    return ""
                } 
            },
            formatLT(item) {
                var tzdep = util.getTimezone(item.from_iata, this.itemsStation, this.itemsStationTimezones);
                if (tzdep == undefined) {
                    tzdep = this.timezone;
                }
                return util.formatLT(item.arr_sta, item.arr_eta, item.arr_ata, item.arr_std, item.arr_etd, item.arr_atd, this.rules, this.timezone, tzdep);
            },
            formatUTADate(item) {
                var uta = this.formatLT(item);
                if (uta == util.red || uta == util.red) {
                    var splitRed = util.red.split(' ');
                    return splitRed[0] + "--text" + " text--" + splitRed[0] + " font-weight-bold";
                } else if (uta == util.yellow || uta == util.yellow) {
                    var splitYellow = util.yellow.split(' ');
                    return splitYellow[0] + "--text" + " text--" + splitYellow[0] + " font-weight-bold";
                }
                return '';
            },
            formatOTP(item) {
                return util.formatOTP(item.dep_std, item.dep_etd, item.dep_atd, this.rules, this.timezone);
            },
            formatUTDDate(item){
                var utd = this.formatLT(item);
                if (utd == util.red || utd == util.red) {
                    var splitRed = util.red.split(' ');
                    return splitRed[0] + "--text" + " text--" + splitRed[0] + " font-weight-bold";
                } else if (utd == util.yellow || utd == util.yellow) {
                    var splitYellow = util.yellow.split(' ');
                    return splitYellow[0] + "--text" + " text--" + splitYellow[0] + " font-weight-bold";
                }
                return '';
            },
            baseClass() {
                if (this.darkMode == true) {
                    return "style-principal-dark ma-0 pa-0 text-caption";
                } else {
                    return "style-principal ma-0 pa-0 text-caption";
                }
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
                    return 'style px-1 py-0 ma-0 text-caption';
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
            getTurnaroundClass(item) {
                let limits = util.getTurnaroundLimits(this.station);
                let turnaround = this.formatTurnaround(item);
                let style = 'ma-0 pa-1 style-principal';
                if (turnaround <= limits[1]) style = 'ma-0 pa-1 style-turnaround-yellow';
                if (turnaround <= limits[0]) style = 'ma-0 pa-1 style-turnaround-red';
                if (turnaround === '') style = 'ma-0 pa-1 style-principal';
                
                if (this.darkMode == true) {
                    style = style + '-dark';
                }
            
                return style;
            },
            closepopup() {
                this.popupstatus = false;
            },
            openStatus(id, operator, flt_nr, isdep) {
                this.itemsStatus = [];
                this.isdep = isdep;
                this.formTitle = "";
                this.dataAccess.getFlightStatusHist('home', id).then((response) => {
                    for (var i in response.data) {
                        this.itemsStatus.push(response.data[i]['fields']);
                    }
                    this.formTitle = operator + ('0000' + flt_nr).slice(-4);
                    this.popupstatus = true;
                });
            },
            capitalize(text) {
                return util.capitalized(text);
            },
            formatIcon(color) {
                return util.formatIcon(color);
            },
            formatPrio(item) {
                return util.formatPrio(item.dep_flightid, this.priorityFlights);
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
            changePriority(item) {
                let index = this.priorityFlights.findIndex(flight => flight.pk === item.dep_flightid);
                if (index !== -1) {
                    this.priorityFlights.splice(index, 1);
                } else {
                    this.priorityFlights.push({ 'pk': item.dep_flightid });
                }
                this.dataAccess.changePriority('flightstatus', item.dep_flightid).then(() => {
                    this.getPriorityFlights('flightstatus', this.hub);
                });
            }
        },
        mounted() {
            this.timezone = this.$store.getters.timezone;
            this.dataAccess = new DataAccess(this.$msal);
            this.refreshData();
            // this.timer = setInterval(function () {
            //     this.refreshData();
            // }.bind(this), 30000);
            
        },
        beforeUnmount() {
            clearInterval(this.timer);
        },
        created() {
            this.$emit("stations", this.station);
            this.$emit("homes", this.home);
        }
    };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    ::v-deep ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: #dfdfdf;
      border-radius:5px;
    }
    ::v-deep ::-webkit-scrollbar-thumb {
      background: #888; 
      border-radius: 5px;
    }
    .table-container {
        height:60vh;
        overflow-y: hidden;
    }
    .flex-table {
        display: flex;
    }
    ::v-deep .flex-table > div{
        width: 100vw;
    }
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

