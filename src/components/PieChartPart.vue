<template>
  <v-layout v-resize="onResize" child-flex>
    <v-row no-gutters>
      <v-col cols="12" class="ma-0 pr-1">
        <v-row no-gutters>
          <v-col key="1" cols="12" class="mb-1 mt-0 pa-0" v-if="small == false">
            <v-card elevation="5" class=".rounded-card">
              <v-card-title class="text-title-2 justify-left mb-n4 pa-0">
                <v-icon
                  v-if="showNetwork"
                  class="mr-2 my-0"
                  @click="changeNetwork()"
                >
                  mdi-alpha-n-box
                </v-icon>
                <v-icon v-else class="mr-2 my-0" @click="changeNetwork()">
                  mdi-arrow-left-bold-hexagon-outline
                </v-icon>
                <strong class="text-h6">Network</strong>
                <v-spacer></v-spacer>
                <strong class="text-caption mr-2">
                  {{ status.info_update }}
                </strong>
                <div class="d-flex flex-nowrap align-center ml-1">
                  <v-switch
                    v-model="history"
                    color="black"
                    dense
                    class="text-caption"
                    :disabled="canHistory"
                  />
                  <strong class="text-caption mr-2">Previous Day</strong>
                </div>
              </v-card-title>
              <v-card-text class="text-subtitle-1 ma-0 pa-0" v-if="showNetwork">
                <v-row class="text-center ma-0">
                  <!-- OTP -->
                  <v-col cols="12" md="12" lg="6" xl="6" class="ma-0 pa-1">
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong class="text-subtitle-1">OTP</strong>
                        &nbsp;
                        <div class="font-italic">
                          (Target: {{ getStatusTarget() }}%)
                        </div>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row
                          class="text-center mb-n4 align-center justify-bottom"
                        >
                          <v-col cols="0" lg="1"></v-col>
                          <v-col cols="4" md="3" lg="2" class="mt-0 pa-0">
                            <v-col cols="12" class="ma-0 pa-0 text-subtitle-2">
                              LH D15
                            </v-col>
                            <v-tooltip location="bottom">
                              <template v-slot:activator="{ props }">
                                <v-col cols="12" v-bind="props" class="mt-n2 pa-0">
                                  <apexchart
                                    :key="key"
                                    type="radialBar"
                                    :height="chartsValues.chartHeightDeparture"
                                    :options="chartOptionsDepartureLH15"
                                    :series="seriesDepartureLH15"
                                  />
                                </v-col>
                              </template>
                              <span>
                                D15: {{ status.netdeplh15 }} /
                                {{ status.netdeplh }}
                              </span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="4" md="3" lg="2" class="mt-0 pa-0">
                            <v-col cols="12" class="ma-0 pa-0 text-subtitle-2">
                              MH D15
                            </v-col>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-col cols="12" v-on="on" class="mt-n2 pa-0">
                                  <apexchart
                                    :key="key"
                                    type="radialBar"
                                    :height="chartsValues.chartHeightDeparture"
                                    :options="chartOptionsDepartureMH15"
                                    :series="seriesDepartureMH15"
                                  />
                                </v-col>
                              </template>
                              <span>
                                D15: {{ status.netdepmh15 }} /
                                {{ status.netdepmh }}
                              </span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="4" md="3" lg="2" class="mt-0 pa-0">
                            <v-col cols="12" class="ma-0 pa-0 text-subtitle-2">
                              PGA D15
                            </v-col>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-col cols="12" v-on="on" class="mt-n2 pa-0">
                                  <apexchart
                                    :key="key"
                                    type="radialBar"
                                    :height="chartsValues.chartHeightDeparture"
                                    :options="chartOptionsDeparturePGA15"
                                    :series="seriesDeparturePGA15"
                                  />
                                </v-col>
                              </template>
                              <span>
                                D15: {{ status.netdeppga15 }} /
                                {{ status.netdeppga }}
                              </span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="12" md="3" lg="5" class="mt-0 pa-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-col v-on="on" class="mt-n6 pa-0">
                                  <apexchart
                                    :key="key"
                                    type="radialBar"
                                    :height=
                                      chartsValues.chartHeightDepartureNet
                                    
                                    :options=chartOptionsDeparture15
                                    :series=seriesDeparture15
                                  />
                                </v-col>
                              </template>
                              <span>
                                D15: {{ status.netdep15 }} / {{ status.netdep }}
                              </span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="0" lg="1"></v-col>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="4"
                                md="3"
                                lg="2"
                                v-on="on"
                                class="mt-n5 text-body-2"
                              >
                                LH D0:
                                <strong class="text-h6 font-weight-black">
                                  {{ status.netdeplh3ratio }}%
                                </strong>
                              </v-col>
                            </template>
                            <span>
                              LH D0: {{ status.netdeplh3 }} /
                              {{ status.netdeplh }}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="4"
                                md="3"
                                lg="2"
                                v-on="on"
                                class="mt-n5 text-body-2"
                              >
                                MH D0:
                                <strong class="text-h6 font-weight-black">
                                  {{ status.netdepmh3ratio }}%
                                </strong>
                              </v-col>
                            </template>
                            <span>
                              MH D0: {{ status.netdepmh3 }} /
                              {{ status.netdepmh }}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="4"
                                md="3"
                                lg="2"
                                v-on="on"
                                class="mt-n5 text-body-2"
                              >
                                PGA D0:
                                <strong class="text-h6 font-weight-black">
                                  {{ status.netdeppga3ratio }}%
                                </strong>
                              </v-col>
                            </template>
                            <span>
                              PGA D0: {{ status.netdeppga3 }} /
                              {{ status.netdeppga }}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="12"
                                md="3"
                                lg="5"
                                v-on="on"
                                class="mt-n5 text-body-2"
                              >
                                Net D0:
                                <strong class="text-h6 font-weight-black">
                                  {{ status.netdep3ratio }}%
                                </strong>
                              </v-col>
                            </template>
                            <span>
                              Net D0: {{ status.netdep3 }} / {{ status.netdep }}
                            </span>
                          </v-tooltip>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Total Operation -->
                  <v-col cols="12" md="6" lg="3" xl="3" class="ma-0 pa-1">
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong class="text-subtitle-1">Total Operation</strong>
                        &nbsp;
                        <div class="font-italic">
                          (Target: {{ getCompletionTarget() }}%)
                        </div>
                      </v-card-title>
                      <v-card-text class="ma-0 pa-0">
                        <v-row
                          justify="center"
                          class="ma-0 pa-0 justify-center fill-height"
                        >
                          <v-col
                            cols="11"
                            sm="6"
                            md="6"
                            lg="6"
                            class="ma-0 px-3"
                          >
                            <v-col cols="12" class="ma-0 pa-0">
                              <v-card
                                dense
                                :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                              >
                                <v-col cols="12" class="mt-2 pa-0 text-h5">
                                  <strong>{{ status.netdall }}</strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n1 mb-1 pa-0 text-body-2"
                                >
                                  Total Leg
                                </v-col>
                              </v-card>
                            </v-col>
                            <v-col cols="12" class="ma-0 pa-0">
                              <v-card
                                dense
                                :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                              >
                                <v-col cols="12" class="mt-2 pa-0 text-h5">
                                  <strong>{{ status.netdep }}</strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n1 mb-1 pa-0 text-body-2"
                                >
                                  Departed
                                </v-col>
                              </v-card>
                            </v-col>
                            <v-col cols="12" class="ma-0 pa-0">
                              <v-card
                                dense
                                :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                              >
                                <v-col cols="12" class="mt-2 pa-0 text-h5">
                                  <strong>{{ status.cc }}</strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n1 mb-1 pa-0 text-body-2"
                                >
                                  Cancelled
                                </v-col>
                              </v-card>
                            </v-col>
                          </v-col>
                          <v-col
                            cols="11"
                            sm="6"
                            md="6"
                            lg="6"
                            class="ma-0 px-3"
                          >
                            <v-col cols="12" class="ma-0 pa-0">
                              <v-card
                                dense
                                :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                              >
                                <v-col cols="12" class="mt-2 pa-0 text-h5">
                                  <strong>{{ status.netdepratio }}%</strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n1 mb-1 pa-0 text-body-2"
                                >
                                  Execution
                                </v-col>
                              </v-card>
                            </v-col>
                            <v-col cols="12" class="ma-0 pa-0">
                              <v-card
                                dense
                                :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                              >
                                <v-col cols="12" class="mt-2 pa-0 text-h5">
                                  <strong
                                    :style="{
                                      color: this.getCompletionColor(
                                        this.status.completionratio,
                                      ),
                                    }"
                                  >
                                    {{ status.completionratio }}%
                                  </strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n1 mb-1 pa-0 text-body-2"
                                >
                                  Completion Rate
                                </v-col>
                              </v-card>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Other Flights -->
                  <v-col cols="12" md="6" lg="3" xl="3" class="ma-0 pa-1">
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong
                          class="text-subtitle-1"
                          v-if="getWindowsWith() > smSize"
                        >
                          Other Flights
                        </strong>
                        <strong class="text-subtitle-1" v-else>
                          Other Flights ({{ numberOfOtherFlights() }})
                        </strong>
                        <v-icon
                          class="ml-2"
                          size="small"
                          v-if="getWindowsWith() <= smSize"
                          @click="openOtherFlights()"
                        >
                          mdi-eye
                        </v-icon>
                      </v-card-title>
                      <v-card-text class="ma-0 pa-0" v-if="showOtherFlights()">
                        <v-row
                          class="text-center ma-0 pa-0 justify-center fill-height"
                        >
                          <v-col cols="3" class="ml-1 mr-1 mt-n2 mb-2 pa-0">
                            <v-card
                              dense
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="text-center mt-4 mb-2 pa-0">
                                <v-col cols="12" class="ma-0 pa-0 text-caption">
                                  Cargo
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.cargoall }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Total Legs
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.cargodeparted }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Departed
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.cargocc }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Cancelled
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col cols="3" class="ml-1 mr-1 mt-n2 mb-2 pa-0">
                            <v-card
                              dense
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="text-center mt-4 mb-2 pa-0">
                                <v-col cols="12" class="ma-0 pa-0 text-caption">
                                  ACMI
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.acmiall }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Total Legs
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.acmideparted }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Departed
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.acmicc }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Cancelled
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col cols="3" class="ml-1 mr-1 mt-n2 mb-2 pa-0">
                            <v-card
                              dense
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="text-center mt-4 mb-2 pa-0">
                                <v-col cols="12" class="ma-0 pa-0 text-caption">
                                  Charters
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.chartersall }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Total Legs
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.chartersdeparted }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Operated
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col cols="12" class="mt-2 pa-0 text-body-1">
                                  <strong>{{ status.charterscc }}</strong>
                                </v-col>
                              </v-row>
                              <v-row class="text-center ma-0 pa-0">
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-caption"
                                >
                                  Cancelled
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- On Time Performance -->
                  <v-col cols="12" md="6" lg="5" xl="5" class="ma-0 pa-1">
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 mr-3 pa-0"
                      >
                        <strong class="text-subtitle-1">
                          On Time Performance
                        </strong>
                      </v-card-title>
                      <v-card-text class="ma-0 pa-0">
                        <v-row class="text-center ma-0 pa-0">
                          <v-spacer></v-spacer>
                          <v-col
                            cols="11"
                            class="mt-n4 mb-n2 pa-0 d-flex justify-center"
                          >
                            <!-- <apexchart
                              :key="keyNetHours"
                              type="area"
                              :height="chartsValues.chartHeightNetHours"
                              :width="chartsValues.chartWidthNetHours"
                              :options="chartOptionsNetHours"
                              :series="seriesNetHours"
                            /> -->
                          </v-col>
                          <v-spacer></v-spacer>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Network Delay Codes -->
                  <v-col cols="12" md="6" lg="4" xl="4" class="ma-0 pa-1">
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 mr-3 pa-0"
                      >
                        <strong class="text-subtitle-1">
                          Network Delay Codes
                        </strong>
                      </v-card-title>
                      <v-card-text class="ma-0 pa-0">
                        <v-row class="text-center ma-0">
                          <v-spacer></v-spacer>
                          <v-col
                            cols="12"
                            class="mt-n4 mb-n2 pa-0 d-flex justify-center"
                          >
                            <apexchart
                              :key="keyDelay"
                              type="bar"
                              :width="chartsValues.chartWidthDelay"
                              :options="chartOptionsDelaysNetwork"
                              :series="seriesDelaysNetwork"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- AOG List -->
                  <v-col cols="12" md="12" lg="3" xl="3" class="ma-0 pa-1">
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong
                          class="text-subtitle-1"
                          v-if="getWindowsWith() > smSize"
                        >
                          AOG List
                        </strong>
                        <strong class="text-subtitle-1" v-else>
                          AOG List ({{ numberOfAOG() }})
                        </strong>
                        <v-icon
                          class="ml-2"
                          size="small"
                          v-if="getWindowsWith() <= smSize"
                          @click="openAOG()"
                        >
                          mdi-eye
                        </v-icon>
                      </v-card-title>
                      <v-card-text
                        class="text-subtitle-1 mt-2 pa-0"
                        v-if="showAOG()"
                      >
                        <v-row class="text-center ma-0">
                          <v-spacer></v-spacer>
                          <v-col cols="11" class="mt-n2 pa-0">
                            <v-data-table
                              :headers="headersAOG"
                              :items="itemsAOG"
                              :items-per-page="3"
                              dense
                            >
                              <template v-slot:item>
                                {{ formatDate(item.fields.start) }}
                              </template>
                              <template v-slot:items>
                                {{ formatDate(items.fields.end) }}
                              </template>
                            </v-data-table>
                          </v-col>
                          <v-spacer></v-spacer>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Cancellations -->
                  <v-col
                    cols="12"
                    md="12"
                    lg="3"
                    xl="3"
                    class="ma-0 pa-1"
                    v-if="!showHub && showNetwork"
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong
                          class="text-subtitle-1"
                          v-if="getWindowsWith() > smSize"
                        >
                          Cancellations
                        </strong>
                        <strong class="text-subtitle-1" v-else>
                          Cancellations ({{ numberOfCancellations() }})
                        </strong>
                        <v-icon
                          class="ml-2"
                          size="small"
                          v-if="getWindowsWith() <= smSize"
                          @click="openCancellations()"
                        >
                          mdi-eye
                        </v-icon>
                      </v-card-title>
                      <v-card-text
                        class="text-subtitle-1 mt-2 pa-0"
                        v-if="showCancellations()"
                      >
                        <v-row class="text-center ma-0 pa-0">
                          <v-spacer></v-spacer>
                          <v-col cols="11" class="mt-n2 pa-0">
                            <v-data-table
                              :headers="headersCancellation"
                              :items="itemsCancellation"
                              :items-per-page="3"
                              dense
                            >
                              <template v-slot:item>
                                {{ formatDate(item.fields.std) }}
                              </template>
                            </v-data-table>
                          </v-col>
                          <v-spacer></v-spacer>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col key="2" cols="12" class="mb-1 mt-1 pa-0">
            <v-card elevation="5" class=".rounded-card">
              <v-card-title
                class="text-title-2 justify-left mb-n4 pa-0"
                v-if="small == false"
              >
                <v-icon v-if="showHub" class="mr-2 my-0" @click="changeHub()">
                  mdi-alpha-h-box
                </v-icon>
                <v-icon v-else class="mr-2 my-0" @click="changeHub()">
                  
                </v-icon>
                <strong class="text-h6">Hub {{ this.station }}</strong>
                <v-spacer></v-spacer>
                <strong class="text-caption mr-2">
                  {{ status.info_update }}
                </strong>
                <div class="d-flex flex-nowrap align-center ml-1">
                  <v-switch
                    v-model="history"
                    color="black"
                    dense
                    class="text-caption"
                    :disabled="canHistory"
                  ></v-switch>
                  <strong class="text-caption mr-2">Previous Day</strong>
                </div>
              </v-card-title>
              <v-card-text class="text-subtitle-1 ma-0 pa-0" v-if="showHub">
                <v-row class="text-center ma-0">
                  <v-col cols="12" class="ma-0 pa-1" v-if="small == false">
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong class="text-subtitle-1">Targets</strong>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row justify="center" class="ma-0 pa-0">
                          <v-col
                            cols="2"
                            class="mx-1 mb-2 pa-0"
                            v-if="small == false"
                          >
                            <v-card
                              dense
                              class="fill-height ma-0 pa-0"
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="ma-0">
                                <v-col
                                  cols="12"
                                  class="mt-1 pa-0 text-center text-body-1"
                                >
                                  <strong>{{ status.delay_tsat }} min</strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-center text-caption"
                                >
                                  Avg TSAT Delay
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="2"
                            class="mx-1 mb-2 pa-0"
                            v-if="small == false"
                          >
                            <v-card
                              dense
                              class="fill-height ma-0 pa-0"
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="ma-0">
                                <v-col
                                  cols="12"
                                  class="mt-1 pa-0 text-center text-body-1"
                                >
                                  <strong>{{ status.tsatfltratio }}%</strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-center text-caption"
                                >
                                  TSAT Target
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="2"
                            class="mx-1 mb-2 pa-0"
                            v-if="small == false"
                          >
                            <v-card
                              dense
                              class="fill-height ma-0 pa-0"
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="ma-0">
                                <v-col
                                  cols="12"
                                  class="mt-1 pa-0 text-center text-body-1"
                                >
                                  <strong>{{ status.ardtfltratio }}%</strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-center text-caption"
                                >
                                  ARDT Target
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="2"
                            class="mx-1 mb-2 pa-0"
                            v-if="small == false"
                          >
                            <v-card
                              dense
                              class="fill-height ma-0 pa-0"
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="ma-0">
                                <v-col
                                  cols="12"
                                  class="mt-1 pa-0 text-center text-body-1"
                                >
                                  <strong>
                                    {{ status.withtobtfltratio }}%
                                  </strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-center text-caption"
                                >
                                  TOBT Target
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col
                            cols="2"
                            class="mx-1 mb-2 pa-0"
                            v-if="small == false"
                          >
                            <v-card
                              dense
                              class="fill-height ma-0 pa-0"
                              :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                            >
                              <v-row class="ma-0">
                                <v-col
                                  cols="12"
                                  class="mt-1 pa-0 text-center text-body-1"
                                >
                                  <strong>
                                    {{ formatTOBT(status.tobtflt) }}
                                  </strong>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mt-n2 pa-0 text-center text-caption"
                                >
                                  TOBT Average
                                </v-col>
                              </v-row>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Arrival -->
                  <v-col
                    cols="12"
                    md="6"
                    :lg="small == false ? 4 : 3"
                    :xl="small == false ? 4 : 3"
                    class="ma-0 pa-1"
                    :order="showNetwork == true && small == false ? 1 : 1"
                    v-if="
                      small == false ||
                      (small == true && getWindowsWith() > smSize)
                    "
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong class="text-subtitle-1">Arrival</strong>
                        &nbsp;
                        <div class="font-italic">
                          (Target: {{ getStatusTarget() }}%)
                        </div>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row class="text-center ma-0">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="6"
                                v-on="on"
                                class="mt-n2 pa-0 justify-left"
                              >
                                <!-- <apexchart :key="key" 
                                                                    type="radialBar" 
                                                                    :height="chartsValues.chartHeightHub" 
                                                                    :options="chartOptionsHubArrival0" 
                                                                    :series="seriesHubArrival0"/>             -->
                              </v-col>
                            </template>
                            <span>
                              A0: {{ status.hubarr0 }} / {{ status.hubarr }}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="6"
                                v-on="on"
                                class="mt-n4 pa-0 justigy-right"
                              >
                                <!-- <apexchart :key="key" 
                                                                    type="radialBar" 
                                                                    :height="chartsValues.chartHeightHub" 
                                                                    :options="chartOptionsHubArrival15" 
                                                                    :series="seriesHubArrival15"/>             -->
                              </v-col>
                            </template>
                            <span>
                              A15: {{ status.hubarr15 }} / {{ status.hubarr }}
                            </span>
                          </v-tooltip>
                          <v-col
                            cols="12"
                            class="mt-n1 pa-0 fill-height"
                            v-if="small == false"
                          >
                            <v-row class="ma-0 pa-0">
                              <v-spacer></v-spacer>
                              <v-col cols="4" class="mx-1 pa-0">
                                <v-card
                                  dense
                                  class="fill-height"
                                  :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                >
                                  <v-row class="ma-0">
                                    <v-col
                                      cols="12"
                                      class="mt-1 pa-0 text-center text-body-1"
                                    >
                                      <strong>
                                        {{ status.hubarr }} /
                                        {{ status.hubaall }}
                                      </strong>
                                    </v-col>
                                    <v-col
                                      cols="12"
                                      class="mt-n2 pa-0 text-center text-caption"
                                    >
                                      Arrived
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </v-col>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-col cols="4" class="mx-1 pa-0">
                                    <v-card
                                      dense
                                      v-on="on"
                                      class="fill-height"
                                      :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                    >
                                      <v-row class="ma-0">
                                        <v-col
                                          cols="12"
                                          class="mt-1 pa-0 text-center text-body-1"
                                        >
                                          <strong>{{ status.lfarr }}%</strong>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          class="mt-n2 pa-0 text-center text-caption"
                                        >
                                          Load Factor
                                        </v-col>
                                      </v-row>
                                    </v-card>
                                  </v-col>
                                </template>
                                <span>
                                  {{ status.paxarr }} / {{ status.caparr }}
                                </span>
                              </v-tooltip>
                              <v-spacer></v-spacer>
                            </v-row>
                          </v-col>
                          <v-col
                            cols="12"
                            class="mt-1 mb-n2 pa-0 fill-height text-caption"
                            v-if="small == false"
                          >
                            Bridge Performance
                          </v-col>
                          <v-col
                            cols="12"
                            class="mx-2 my-n6 pa-0 d-flex justify-center"
                            v-if="small == false"
                          >
                            <!-- <apexchart :key="key" 
                                                            type="bar" 
                                                            :height="chartsValues.chartHeightBar" 
                                                            :width="chartsValues.chartWidthBar" 
                                                            :options="chartOptionsBrgArrival" 
                                                            :series="seriesBrgArrival"/>             -->
                          </v-col>
                          <v-col
                            cols="12"
                            class="mt-1 mb-n2 pa-0 fill-height text-caption"
                            v-if="small == false"
                          >
                            Passengers In
                          </v-col>
                          <v-col
                            cols="12"
                            class="mx-2 my-n6 pa-0 d-flex justify-center"
                            v-if="small == false"
                          >
                            <!-- <apexchart :key="key" 
                                                            type="bar" 
                                                            :height="chartsValues.chartHeightBar" 
                                                            :width="chartsValues.chartWidthBar" 
                                                            :options="chartOptionsPaxArrival" 
                                                            :series="seriesPaxArrival"/>             -->
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Connectivity -->
                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="4"
                    class="ma-0 pa-1"
                    v-if="small == false"
                    :order="small == false ? 2 : 4"
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong class="text-subtitle-1">Connectivity</strong>
                        &nbsp;
                        <div class="font-italic">
                          (Target: {{ getConnectivityTarget() }}%)
                        </div>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row justify="center" class="ma-0 pa-0">
                          <v-col cols="12" class="ma-0 px-1">
                            <v-row justify="center" class="ma-1 pa-0">
                              <v-col cols="4" class="ma-0 pa-0">
                                <v-card
                                  dense
                                  :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                >
                                  <v-col cols="12" class="mt-2 pa-0 text-h5">
                                    <strong
                                      :style="{
                                        color: this.getConnectivityColor(
                                          this.status.connectivity,
                                        ),
                                      }"
                                    >
                                      {{ status.connectivity }}%
                                    </strong>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    class="mt-n1 mb-1 pa-0 text-body-2"
                                  >
                                    Connectivity
                                  </v-col>
                                </v-card>
                              </v-col>
                              <v-col cols="4" class="ma-0 px-2 py-0">
                                <v-card
                                  dense
                                  :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                >
                                  <v-col cols="12" class="mt-2 pa-0 text-h5">
                                    <strong>{{ status.misstransf }}</strong>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    class="mt-n1 mb-1 pa-0 text-body-2"
                                  >
                                    Miss
                                  </v-col>
                                </v-card>
                              </v-col>
                              <v-col cols="4" class="ma-0 pa-0">
                                <v-card
                                  dense
                                  :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                >
                                  <v-col cols="12" class="mt-2 pa-0 text-h5">
                                    <strong>0</strong>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    class="mt-n1 mb-1 pa-0 text-body-2"
                                  >
                                    Overnights
                                  </v-col>
                                </v-card>
                              </v-col>
                            </v-row>
                            <v-row justify="center" class="ma-1 pa-0">
                              <v-col cols="12" class="ma-0 pa-0">
                                <v-card
                                  dense
                                  :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                >
                                  <v-row justify="center" class="ma-0 pa-0">
                                    <v-col cols="12" class="mt-2 pa-0 text-h5">
                                      <strong>
                                        {{ status.paxtransfers }}%
                                      </strong>
                                    </v-col>
                                    <v-col
                                      cols="12"
                                      class="mt-n1 mb-1 pa-0 text-body-2"
                                    >
                                      PAX Transfers
                                    </v-col>
                                  </v-row>
                                  <v-row justify="center" class="ma-0 pa-0">
                                    <v-col cols="4" class="mt-2 pa-0 text-h5">
                                      <strong>
                                        {{ formatNumber(status.inbooked) }}
                                      </strong>
                                    </v-col>
                                    <v-col cols="4" class="mt-2 pa-0 text-h5">
                                      <strong>
                                        {{ formatNumber(status.totaltransf) }}
                                      </strong>
                                    </v-col>
                                    <v-col cols="4" class="mt-2 pa-0 text-h5">
                                      <strong>
                                        {{ formatNumber(status.outbooked) }}
                                      </strong>
                                    </v-col>
                                    <v-col
                                      cols="4"
                                      class="mt-n1 mb-1 pa-0 text-body-2"
                                    >
                                      Booked Inbound
                                    </v-col>
                                    <v-col
                                      cols="4"
                                      class="mt-n1 mb-1 pa-0 text-body-2"
                                    >
                                      Transfers
                                    </v-col>
                                    <v-col
                                      cols="4"
                                      class="mt-n1 mb-1 pa-0 text-body-2"
                                    >
                                      Booked Outbound
                                    </v-col>
                                  </v-row>
                                  <v-row justify="center" class="ma-0 pa-0">
                                    <v-col cols="4" class="mt-2 pa-0 text-h5">
                                      <strong>
                                        {{ formatNumber(status.inchecked) }}
                                      </strong>
                                    </v-col>
                                    <v-col
                                      cols="4"
                                      class="mt-2 pa-0 text-h5"
                                    ></v-col>
                                    <v-col cols="4" class="mt-2 pa-0 text-h5">
                                      <strong>
                                        {{ formatNumber(status.outchecked) }}
                                      </strong>
                                    </v-col>
                                    <v-col
                                      cols="4"
                                      class="mt-n1 mb-1 pa-0 text-body-2"
                                    >
                                      Checked Inbound
                                    </v-col>
                                    <v-col
                                      cols="4"
                                      class="mt-n1 mb-1 pa-0 text-body-2"
                                    ></v-col>
                                    <v-col
                                      cols="4"
                                      class="mt-n1 mb-1 pa-0 text-body-2"
                                    >
                                      Checked Outbound
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Departure -->
                  <v-col
                    cols="12"
                    md="6"
                    :lg="small == false ? 4 : 3"
                    :xl="small == false ? 4 : 3"
                    class="ma-0 pa-1"
                    order="3"
                    v-if="
                      small == false ||
                      (small == true && getWindowsWith() > smSize)
                    "
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong class="text-subtitle-1">Departure</strong>
                        &nbsp;
                        <div class="font-italic">
                          (Target: {{ getStatusTarget() }}%)
                        </div>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row class="text-center ma-0">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="6"
                                v-on="on"
                                class="mt-n2 pa-0 justify-left"
                              >
                                <!-- <apexchart :key="key" 
                                                                    type="radialBar" 
                                                                    :height="chartsValues.chartHeightHub" 
                                                                    :options="chartOptionsHubDeparture0" 
                                                                    :series="seriesHubDeparture0"/>             -->
                              </v-col>
                            </template>
                            <span>
                              D0: {{ status.hubdep3 }} / {{ status.hubdep }}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-col
                                cols="6"
                                v-on="on"
                                class="mt-n4 pa-0 justify-right"
                              >
                                <!-- <apexchart :key="key" 
                                                                    type="radialBar" 
                                                                    :height="chartsValues.chartHeightHub" 
                                                                    :options="chartOptionsHubDeparture15" 
                                                                    :series="seriesHubDeparture15"/>             -->
                              </v-col>
                            </template>
                            <span>
                              D15: {{ status.hubdep15 }} / {{ status.hubdep }}
                            </span>
                          </v-tooltip>
                          <v-col
                            cols="12"
                            class="mt-n1 pa-0 fill-height"
                            v-if="small == false"
                          >
                            <v-row class="ma-0 pa-0">
                              <v-spacer></v-spacer>
                              <v-col cols="4" class="mx-1 pa-0">
                                <v-card
                                  dense
                                  class="fill-height ma-0 pa-0"
                                  :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                >
                                  <v-row class="ma-0">
                                    <v-col
                                      cols="12"
                                      class="mt-1 pa-0 text-center text-body-1"
                                    >
                                      <strong>
                                        {{ status.hubdep }} /
                                        {{ status.hubdall }}
                                      </strong>
                                    </v-col>
                                    <v-col
                                      cols="12"
                                      class="mt-n2 pa-0 text-center text-caption"
                                    >
                                      Departed
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </v-col>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-col cols="4" class="mx-1 pa-0">
                                    <v-card
                                      dense
                                      v-on="on"
                                      class="fill-height ma-0 pa-0"
                                      :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                    >
                                      <v-row class="ma-0">
                                        <v-col
                                          cols="12"
                                          class="mt-1 pa-0 text-center text-body-1"
                                        >
                                          <strong>{{ status.lfdep }}%</strong>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          class="mt-n2 pa-0 text-center text-caption"
                                        >
                                          Load Factor
                                        </v-col>
                                      </v-row>
                                    </v-card>
                                  </v-col>
                                </template>
                                <span>
                                  {{ status.paxarr }} / {{ status.caparr }}
                                </span>
                              </v-tooltip>
                              <v-spacer></v-spacer>
                            </v-row>
                          </v-col>
                          <v-col
                            cols="12"
                            class="mt-1 mb-n2 pa-0 fill-height text-caption"
                            v-if="small == false"
                          >
                            Bridge Performance
                          </v-col>
                          <v-col
                            cols="12"
                            class="mx-2 my-n6 pa-0 d-flex justify-center"
                            v-if="small == false"
                          >
                            <!-- <apexchart :key="key" 
                                                            type="bar" 
                                                            :height="chartsValues.chartHeightBar" 
                                                            :width="chartsValues.chartWidthBar" 
                                                            :options="chartOptionsBrgDeparture" 
                                                            :series="seriesBrgDeparture"/>             -->
                          </v-col>
                          <v-col
                            cols="12"
                            class="mt-1 mb-n2 pa-0 fill-height text-caption"
                            v-if="small == false"
                          >
                            Passengers Out
                          </v-col>
                          <v-col
                            cols="12"
                            class="mx-2 my-n6 pa-0 d-flex justify-center"
                            v-if="small == false"
                          >
                            <!-- <apexchart :key="key" 
                                                            type="bar" 
                                                            :height="chartsValues.chartHeightBar" 
                                                            :width="chartsValues.chartWidthBar" 
                                                            :options="chartOptionsPaxDeparture" 
                                                            :series="seriesPaxDeparture"/>             -->
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Hub Delay Codes -->
                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="4"
                    class="ma-0 pa-1"
                    v-if="small == false"
                    order="4"
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 mr-3 pa-0"
                      >
                        <strong class="text-subtitle-1">Hub Delay Codes</strong>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row class="text-center ma-0">
                          <v-col
                            cols="12"
                            class="mt-n4 mb-n2 pa-0 d-flex justify-center"
                          >
                            <apexchart
                              :key="keyDelay"
                              type="bar"
                              :width="chartsValues.chartWidthDelay"
                              :options="chartOptionsDelaysHub"
                              :series="seriesDelaysHub"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- On Time Performance -->
                  <v-col
                    cols="12"
                    md="6"
                    :lg="small == false ? 4 : 6"
                    :xl="small == false ? 4 : 6"
                    class="ma-0 pa-1"
                    :order="small == false ? 5 : 2"
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 pa-0"
                      >
                        <strong class="text-subtitle-1">
                          On Time Performance
                        </strong>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row class="text-center justify-center ma-0">
                          <v-col
                            cols="11"
                            class="mt-n6 mb-n4 pa-0 d-flex justify-center"
                          >
                            <!-- <apexchart :key="keyHours" 
                                                            type="line" 
                                                            :height="chartsValues.chartHeightHubHours" 
                                                            :width="chartsValues.chartWidthHubHours" 
                                                            :options="chartOptionsHours" 
                                                            :series="seriesHours"/>          -->
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- GroundOps Delay Codes -->
                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="4"
                    class="ma-0 pa-1"
                    v-if="small == false"
                    order="7"
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-title
                        class="text-subtitle-2 justify-left ml-2 mt-2 mb-0 mr-3 pa-0"
                      >
                        <strong class="text-subtitle-1">
                          GroundOps's Delay Codes
                        </strong>
                      </v-card-title>
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row class="text-center ma-0">
                          <v-col
                            cols="12"
                            class="mt-n4 mb-n2 pa-0 d-flex justify-center"
                          >
                            <!-- <apexchart :key="keyDelay" 
                                                                type="bar" 
                                                                :width="chartsValues.chartWidthDelay" 
                                                                :options="chartOptionsDelaysGO" 
                                                                :series="seriesDelaysGO"/>    -->
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <!-- Ground Force SLA -->
                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    xl="12"
                    class="mx-0 my-0 pa-1"
                    v-if="small == false && showHub && !showNetwork"
                    order="8"
                  >
                    <v-card
                      elevation="0"
                      outlined
                      class=".rounded-card fill-height"
                    >
                      <v-card-text class="text-subtitle-1 ma-0 pa-0">
                        <v-row class="text-center ma-0">
                          <v-col cols="12" class="ma-0 pa-0">
                            Ground Force SLA
                          </v-col>
                          <v-col cols="12" class="ma-0 pa-0">
                            <v-row class="ma-0 pa-0 justify-center">
                              <v-col
                                v-for="(kpi, index) in itemsGFSLA"
                                v-bind:key="index"
                                cols="6"
                                xl="4"
                                class="mx-0 my-1 px-1 py-0"
                              >
                                <v-card
                                  dense
                                  class="fill-height"
                                  :color="((darkMode == true) ? '#263238' : '#ECEFF1')"
                                >
                                  <v-row class="ma-0">
                                    <v-col
                                      cols="3"
                                      class="ma-0 pa-0 text-body-1"
                                    >
                                      {{ kpi.fields.result }}%
                                    </v-col>
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-col
                                          cols="3"
                                          v-on="on"
                                          class="my-1 px-2 py-0 text-caption"
                                        >
                                          {{ getGFKPICode(kpi.fields.name) }}
                                        </v-col>
                                      </template>
                                      <span>
                                        {{
                                          getGFKPIDescription(kpi.fields.name)
                                        }}
                                      </span>
                                    </v-tooltip>
                                    <v-col
                                      cols="4"
                                      class="my-1 pa-0 text-caption"
                                    >
                                      {{ kpi.fields.kpi }}
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { Utils } from '../plugins/Utils'
import { DataAccess } from '../plugins/DataAccess'
import VueApexCharts from 'vue3-apexcharts'

const util = new Utils()

export default {
  props: ['stations', 'smalls'],
    components: {
      apexchart: VueApexCharts,
  },
  data() {
    return {
      history: 0,
      canHistory: true,
      dataAccess: null,
      dow: util.getDoW(),
      station: this.$store.getters.station,
      small: this.smalls,
      darkMode: this.$store.getters.darkMode,
      key: 0,
      keyHours: 0,
      keyNetHours: 0,
      keyDelay: 0,
      headersCancellation: [
        {
          text: 'Flt Nr',
          align: 'left',
          value: 'fields.fltnr',
          class: ['ma-1', 'pa-1'],
          tip: 'Flight Number',
        },
        {
          text: 'STD',
          align: 'center',
          value: 'fields.std',
          class: ['ma-1', 'pa-1'],
          tip: 'Schedule Departure Date',
        },
        {
          text: 'From',
          align: 'center',
          value: 'fields.from_iata',
          class: ['ma-1', 'pa-1'],
          tip: 'Origin',
        },
        {
          text: 'To',
          align: 'center',
          value: 'fields.to_iata',
          class: ['ma-1', 'pa-1'],
          tip: 'Destination',
        },
      ],
      itemsCancellation: [],
      headersAOG: [
        {
          text: 'Location',
          align: 'center',
          value: 'fields.airp_cod',
          class: ['ma-1', 'pa-1'],
          tip: 'Airport Code',
        },
        {
          text: 'Aircraft',
          align: 'left',
          value: 'fields.acregistration',
          class: ['ma-1', 'pa-1'],
          tip: 'Aircraft Registration',
        },
        {
          text: 'Start',
          align: 'center',
          value: 'fields.start',
          class: ['ma-1', 'pa-1'],
          tip: 'Start Date',
        },
        {
          text: 'End',
          align: 'center',
          value: 'fields.end',
          class: ['ma-1', 'pa-1'],
          tip: 'End Date',
        },
        {
          text: 'Reasons',
          align: 'center',
          value: 'fields.reason',
          class: ['ma-1', 'pa-1'],
          tip: 'Reasons',
        },
      ],
      itemsAOG: [],
      itemsGFSLA: [],
      chartOptionsOTP: {
        chart: {
          type: 'radialBar',
        },
        noData: {
          text: 'Loading...',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 360,
            hollow: {
              margin: 0,
              size: '80%',
              background: 'transparent',
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: 'front',
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 3,
                opacity: 0.24,
              },
            },
            track: {
              background:
                this.$store.getters.darkMode == true ? '#000000' : '#FFFFFF',
              strokeWidth: '80%',
              margin: -4, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 0,
                left: -6,
                blur: 4,
                opacity: 0.55,
              },
            },
            dataLabels: {
              name: {
                show: false,
                fontSize: this.smalls == true ? '20px' : '20px',
                fontFamily: 'Roboto',
                fontWeight: 600,
                color: undefined,
                offsetY: -5,
              },
              value: {
                show: true,
                fontSize: '20px',
                fontFamily: undefined,
                fontWeight: 600,
                color:
                  this.$store.getters.darkMode == true ? '#FFFFFF' : '#424242',
                offsetY: 6,
                formatter: function (val) {
                  return val + '%'
                },
              },
            },
          },
        },
        colors: [],
        labels: [],
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false,
              },
            },
          },
        ],
      },
      chartOptionsHubArrival0: {},
      chartOptionsHubArrival15: {},
      chartOptionsHubDeparture0: {},
      chartOptionsHubDeparture15: {},
      seriesHubArrival0: [],
      seriesHubArrival15: [],
      seriesHubDeparture0: [],
      seriesHubDeparture15: [],
      chartOptionsBrg: {
        chart: {
          height: 70,
          type: 'bar',
          stacked: true,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            opacity: 0.3,
            blur: 5,
            left: -7,
            top: 6,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '20%',
            colors: {
              backgroundBarColors: ['#AEAEAE'],
            },
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          max: 100,
        },
        fill: {
          opacity: 1,
        },
        colors: ['#000000'],
        noData: {
          text: 'Loading...',
        },
        stroke: {
          width: 0,
        },
        series: [
          {
            name: '',
            data: [],
          },
        ],
        dataLabels: {
          enabled: true,
          enabledOnSeries: false,
          formatter: function (val) {
            return val + '%'
          },
          style: {
            fontSize: '14px',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            colors: ['#FFFFFF', '#000000'],
          },
        },
        tooltip: {
          enabled: true,
          custom: function (opts) {
            return `<span class="pa-1">${
              opts.w.config.series[opts.seriesIndex].extraData
            }</span>`
          },
          theme: 'dark',
        },
      },
      chartOptionsBrgArrival: {},
      chartOptionsBrgDeparture: {},
      seriesBrgArrival: [
        {
          name: 'Executed',
          data: [],
          extraData: '',
        },
        {
          name: 'Potential',
          data: [],
        },
      ],
      seriesBrgDeparture: [
        {
          name: 'Executed',
          data: [],
          extraData: '',
        },
        {
          name: 'Potential',
          data: [],
        },
      ],
      chartOptionsPax: {
        chart: {
          height: 70,
          type: 'bar',
          stacked: true,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            opacity: 0.3,
            blur: 5,
            left: -7,
            top: 6,
          },
        },
        colors: ['#000000', '#AEAEAE'],
        noData: {
          text: 'Loading...',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '20%',
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${(val / 1000).toFixed(1)}k`
          },
          style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: ['#FFFFFF', '#000000'],
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      chartOptionsPaxArrival: {},
      chartOptionsPaxDeparture: {},
      seriesPaxArrival: [
        {
          name: 'Boarded',
          data: [],
        },
        {
          name: 'Booked',
          data: [],
        },
      ],
      seriesPaxDeparture: [
        {
          name: 'Boarded',
          data: [],
        },
        {
          name: 'Booked',
          data: [],
        },
      ],
      chartOptionsDeparture15: {},
      chartOptionsDepartureLH15: {},
      chartOptionsDepartureMH15: {},
      chartOptionsDeparturePGA15: {},
      seriesDeparture15: [],
      seriesDepartureLH15: [],
      seriesDepartureMH15: [],
      seriesDeparturePGA15: [],
      chartOptionsNetHours: {
        chart: {
          height: 350,
          type: 'area',
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
          categories: [
            '2018-09-19T00:00:00.000Z',
            '2018-09-19T01:30:00.000Z',
            '2018-09-19T02:30:00.000Z',
            '2018-09-19T03:30:00.000Z',
            '2018-09-19T04:30:00.000Z',
            '2018-09-19T05:30:00.000Z',
            '2018-09-19T06:30:00.000Z',
          ],
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm',
          },
        },
      },
      seriesNetHours: [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: 'series2',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chartOptionsHours: {
        chart: {
          type: 'area',
          toolbar: {
            show: false,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: [],
            },
          },
        },
        colors:
          this.$store.getters.darkMode == true
            ? ['#FFFFFF', '#039BE5']
            : ['#424242', '#01579B'],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1],
          curve: 'smooth',
        },
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '75%',
          },
        },
        fill: {
          colors:
            this.$store.getters.darkMode == true
              ? ['#FFFFFF', '#039BE5']
              : ['#424242', '#01579B'],
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: true,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 10, 10],
          },
        },
        markers: {
          size: 1,
        },
        labels: [
          '00',
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
        ],
        xaxis: {
          labels: {
            rotate: -45,
          },
        },
        annotations: {
          yaxis: [
            {
              y: 0,
              yAxisIndex: 1,
              offsetY: -3,
              borderColor: '#607D8B',
              label: {
                show: true,
                text: 'Day OTP',
                textAnchor: 'end',
                position: 'left',
                style: {
                  fontSize: '10px',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  background: '#607D8B',
                  padding: {
                    left: 5,
                    right: 5,
                    top: 0,
                    bottom: 2,
                  },
                },
              },
            },
          ],
        },
        yaxis: [
          {
            seriesName: 'Flight_Departed',
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
            },
            title: {
              text: '#Flights',
            },
            min: 0,
          },
          {
            seriesName: ['Hour_OTP'],
            opposite: true,
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: true,
            },
            title: {
              text: 'OTP',
            },
            min: 0,
            max: 100,
          },
        ],
        legend: {
          show: false,
          onItemHover: {
            highlightDataSeries: true,
          },
        },
        tooltip: {
          enabled: false,
        },
        responsive: [
          {
            breakpoint: 1904,
            options: {
              labels: [
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
              ],
            },
          },
        ],
      },
      seriesHours: [],
      delayHubLISKey: 0,
      chartOptionsDelays: {
        chart: {
          type: 'bar',
          height: 380,
          dropShadow: {
            enabled: true,
            opacity: 0.3,
            blur: 5,
            left: -7,
            top: 6,
          },
          toolbar: {
            show: false,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: [],
            },
          },
        },
        plotOptions: {
          bar: {
            barHeight: '80%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        fill: {
          opacity: 1,
        },
        noData: {
          text: 'Loading...',
        },
        colors:
          this.$store.getters.darkMode == true ? ['#78909C'] : ['#BBDEFB'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors:
              this.$store.getters.darkMode == true ? ['#FFFFFF'] : ['#000000'],
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: false,
          },
        },
        stroke: {
          width: 0,
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          categories: [],
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          show: false,
        },
      },
      chartOptionsDelaysNetwork: {},
      chartOptionsDelaysHub: {},
      chartOptionsDelaysGO: {},
      seriesDelaysNetwork: [
        {
          data: [],
        },
      ],
      seriesDelaysHub: [
        {
          data: [],
        },
      ],
      seriesDelaysGO: [
        {
          data: [],
        },
      ],
      status: {
        netarr0: 0,
        netarr15: 0,
        netarr: 0,
        netaall: 0,
        netarr0ratio: 0,
        netarr15ratio: 0,
        netarrratio: 0,
        brgarr: 0,
        brgarrtotal: 0,
        brgarrratio: 0,
        hubarr0: 0,
        hubarr15: 0,
        hubarr: 0,
        hubaall: 0,
        hubarr0ratio: 0,
        hubarr15ratio: 0,
        hubarrratio: 0,
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
        hubdep15: 0,
        hubdep: 0,
        hubdall: 0,
        hubdep3ratio: 0,
        hubdep15ratio: 0,
        hubdepratio: 0,
        brgdep: 0,
        brgdeptotal: 0,
        brgdepratio: 0,
        netdep3: 0,
        netdep15: 0,
        netdep: 0,
        netdeplh3: 0,
        netdeplh15: 0,
        netdeplh: 0,
        netdepmh3: 0,
        netdepmh15: 0,
        netdepmh: 0,
        netdeppga3: 0,
        netdeppga15: 0,
        netdeppga: 0,
        netdall: 0,
        netdep3ratio: 0,
        netdep15ratio: 0,
        netdeplh3ratio: 0,
        netdeplh15ratio: 0,
        netdepmh3ratio: 0,
        netdepmh15ratio: 0,
        netdeppga3ratio: 0,
        netdeppga15ratio: 0,
        netdepratio: 0,
        cc: 0,
        rr: 0,
        fr: 0,
        div: 0,
        drr: 0,
        drs: 0,
        hubcc: 0,
        hubrr: 0,
        hubfr: 0,
        hubdiv: 0,
        hubdrr: 0,
        hubdrs: 0,
        groundac: 0,
        inbooked: 0,
        outbooked: 0,
        inchecked: 0,
        outchecked: 0,
        delay_tsat: 0,
        info_update: '',
        totaltransf: 0,
        misstransf: 0,
        completionratio: 0,
        connectivity: 0,
        paxtransfers: 0,
        tobtflt: 0,
        withtobtflt: 0,
        ardtflt: 0,
        tsatflt: 0,
        withtobtfltratio: 0,
        ardtfltratio: 0,
        tsatfltratio: 0,
        cargoall: 0,
        cargodeparted: 0,
        cargocc: 0,
        acmiall: 0,
        acmideparted: 0,
        acmicc: null,
        chartersall: 0,
        chartersdeparted: 0,
        charterscc: 0,
        lastdaydep: '',
      },
      chartsValues: {
        chartHeightDepartureNet: 200,
        chartHeightDeparture: 120,
        chartWidthNetHours: 750,
        chartWidthHubHours: 550,
        chartHeightNetHours: 250,
        chartHeightHubHours: 250,
        chartHeightHub: 180,
        chartHeightBar: 80,
        chartWidthBar: 400,
        chartWidthDelay: 400,
      },
      xlSize: 1904,
      chartsXLValues: {
        chartHeightDepartureNet: 200,
        chartHeightDeparture: 120,
        chartWidthNetHours: 750,
        chartWidthHubHours: 550,
        chartHeightNetHours: 250,
        chartHeightHubHours: 250,
        chartHeightHub: 180,
        chartHeightBar: 80,
        chartWidthBar: 400,
        chartWidthDelay: 500,
      },
      chartsXLSmallValues: {
        chartWidthHubHours: 750,
        chartHeightHubHours: 180,
        chartHeightHub: 150,
      },
      lgSize: 1264,
      chartsLGValues: {
        chartHeightDepartureNet: 200,
        chartHeightDeparture: 120,
        chartWidthNetHours: 450,
        chartWidthHubHours: 420,
        chartHeightNetHours: 250,
        chartHeightHubHours: 250,
        chartHeightHub: 180,
        chartHeightBar: 80,
        chartWidthBar: 370,
        chartWidthDelay: 400,
      },
      chartsLGSmallValues: {
        chartWidthHubHours: 600,
        chartHeightHubHours: 180,
        chartHeightHub: 150,
      },
      mdSize: 960,
      chartsMDValues: {
        chartHeightDepartureNet: 200,
        chartHeightDeparture: 120,
        chartWidthNetHours: 450,
        chartWidthHubHours: 450,
        chartHeightNetHours: 180,
        chartHeightHubHours: 180,
        chartHeightHub: 180,
        chartHeightBar: 80,
        chartWidthBar: 400,
        chartWidthDelay: 450,
      },
      chartsMDSmallValues: {
        chartWidthHubHours: 400,
        chartHeightHubHours: 120,
        chartHeightHub: 140,
      },
      smSize: 600,
      chartsSMValues: {
        chartHeightDepartureNet: 200,
        chartHeightDeparture: 120,
        chartWidthNetHours: 500,
        chartWidthHubHours: 550,
        chartHeightNetHours: 180,
        chartHeightHubHours: 180,
        chartHeightHub: 180,
        chartHeightBar: 80,
        chartWidthBar: 500,
        chartWidthDelay: 500,
      },
      chartsSMSmallValues: {
        chartWidthHubHours: 400,
        chartHeightHubHours: 120,
        chartHeightHub: 120,
      },
      chartsXSValues: {
        chartHeightDepartureNet: 200,
        chartHeightDeparture: 120,
        chartWidthNetHours: 300,
        chartWidthHubHours: 300,
        chartHeightNetHours: 180,
        chartHeightHubHours: 180,
        chartHeightHub: 180,
        chartHeightBar: 80,
        chartWidthBar: 260,
        chartWidthDelay: 300,
      },
      otherFlights: true,
      aog: true,
      cancelation: true,
    }
  },
  methods: {
    onResize() {
      this.resetChartSize(window.innerWidth)
    },
    getWindowsWith() {
      return window.innerWidth
    },
    refreshData() {
      this.getOperationStatus('operationskpi', this.station)
      this.getOperationNetHoursStatus('operationskpi')
      this.getDelays('operationskpi', this.station)
      this.getFlightCancel('operationskpi')
      this.getAOG('operationskpi')
      this.getGFSLA('operationskpi')
      this.getDayPaxTransf('operationskpi')
      this.getOperationOthers('operationskpi')
      var utcNow = new Date(new Date().toUTCString())
      var oneHourAgoUTC = new Date(utcNow.getTime() - 60 * 60 * 1000)
      if (
        this.status.lastdaydep != '' &&
        oneHourAgoUTC < this.status.lastdaydep
      ) {
        this.canHistory = false
      }
    },
    getOperationStatus(id, stations) {
      this.dataAccess
        .getOperationStatus(id, stations , this.history)
        .then((response) => {
          var operationStatus = response.data

          this.chartOptionsHubArrival15.colors = []
          this.chartOptionsHubArrival15.labels = []
          this.chartOptionsHubArrival0.colors = []
          this.chartOptionsHubArrival0.labels = []
          this.seriesHubArrival15 = []
          this.seriesHubArrival0 = []
          this.seriesBrgArrival[0].data = []
          this.chartOptionsHubDeparture15.colors = []
          this.chartOptionsHubDeparture15.labels = []
          this.chartOptionsHubDeparture0.colors = []
          this.chartOptionsHubDeparture0.labels = []
          this.seriesHubDeparture15 = []
          this.seriesHubDeparture0 = []
          this.seriesBrgDeparture[0].data = []
          this.chartOptionsDeparture15.colors = []
          this.chartOptionsDeparture15.labels = []
          this.chartOptionsDepartureLH15.colors = []
          this.chartOptionsDepartureLH15.labels = []
          this.chartOptionsDepartureMH15.colors = []
          this.chartOptionsDepartureMH15.labels = []
          this.chartOptionsDeparturePGA15.colors = []
          this.chartOptionsDeparturePGA15.labels = []
          this.seriesDeparture15 = []
          this.seriesDepartureLH15 = []
          this.seriesDepartureMH15 = []
          this.seriesDeparturePGA15 = []
          this.seriesPaxArrival[0].data = []
          this.seriesPaxArrival[1].data = []
          this.seriesPaxDeparture[0].data = []
          this.seriesPaxDeparture[1].data = []

          // VIEW can reply empty when airline cleans BD
          if (operationStatus.sum_cap == 0) {
            for (let key in this.status) {
              this.status[key] = 0
            }
            return
          }
          for (let key in operationStatus) {
            if (Object.prototype.hasOwnProperty.call(this.status, key)) {
              if (key === 'info_update') {
                this.status[key] =
                  this.formatDate(operationStatus[key]) + ' UTC'
              } else if (key === 'lastdaydep') {
                this.status[key] = new Date(operationStatus[key])
              } else {
                this.status[key] = operationStatus[key]
              }
            }
          }

          this.status.netarr0ratio =
            this.status.netarr == 0
              ? 0
              : Math.round((this.status.netarr0 / this.status.netarr) * 100)
          this.status.netarr15ratio =
            this.status.netarr == 0
              ? 0
              : Math.round((this.status.netarr15 / this.status.netarr) * 100)
          this.status.brgarrratio =
            this.status.brgarrtotal == 0
              ? 0
              : Math.round((this.status.brgarr / this.status.brgarrtotal) * 100)
          this.status.netarrratio =
            this.status.netaall == 0
              ? 0
              : Math.round((this.status.netarr / this.status.netaall) * 100)
          this.status.hubarr0ratio =
            this.status.hubarr == 0
              ? 0
              : Math.round((this.status.hubarr0 / this.status.hubarr) * 100)
          this.status.hubarr15ratio =
            this.status.hubarr == 0
              ? 0
              : Math.round((this.status.hubarr15 / this.status.hubarr) * 100)
          this.status.hubarrratio =
            this.status.hubaall == 0
              ? 0
              : Math.round((this.status.hubarr / this.status.hubaall) * 100)
          this.status.lfarr =
            this.status.caparr == 0
              ? 0
              : Math.round((this.status.paxarr / this.status.caparr) * 100)
          this.status.lfnet =
            this.status.capnet == 0
              ? 0
              : Math.round((this.status.paxnet / this.status.capnet) * 100)
          this.status.lfdep =
            this.status.capdep == 0
              ? 0
              : Math.round((this.status.paxdep / this.status.capdep) * 100)
          this.status.hubdep3ratio =
            this.status.hubdep == 0
              ? 0
              : Math.round((this.status.hubdep3 / this.status.hubdep) * 100)
          this.status.hubdep15ratio =
            this.status.hubdep == 0
              ? 0
              : Math.round((this.status.hubdep15 / this.status.hubdep) * 100)
          this.status.hubdepratio =
            this.status.hubdall == 0
              ? 0
              : Math.round((this.status.hubdep / this.status.hubdall) * 100)
          this.status.brgdepratio =
            this.status.brgdeptotal == 0
              ? 0
              : Math.round((this.status.brgdep / this.status.brgdeptotal) * 100)
          this.status.netdep3ratio =
            this.status.netdep == 0
              ? 0
              : Math.round((this.status.netdep3 / this.status.netdep) * 100)
          this.status.netdep15ratio =
            this.status.netdep == 0
              ? 0
              : Math.round((this.status.netdep15 / this.status.netdep) * 100)
          this.status.netdepratio =
            this.status.netdall == 0
              ? 0
              : Math.round(
                  (this.status.netdep /
                    (this.status.netdall - this.status.cc)) *
                    100,
                )
          this.status.netdeplh3ratio =
            this.status.netdeplh == 0
              ? 0
              : Math.round((this.status.netdeplh3 / this.status.netdeplh) * 100)
          this.status.netdeplh15ratio =
            this.status.netdeplh == 0
              ? 0
              : Math.round(
                  (this.status.netdeplh15 / this.status.netdeplh) * 100,
                )
          this.status.netdepmh3ratio =
            this.status.netdepmh == 0
              ? 0
              : Math.round((this.status.netdepmh3 / this.status.netdepmh) * 100)
          this.status.netdepmh15ratio =
            this.status.netdepmh == 0
              ? 0
              : Math.round(
                  (this.status.netdepmh15 / this.status.netdepmh) * 100,
                )
          this.status.netdeppga3ratio =
            this.status.netdeppga == 0
              ? 0
              : Math.round(
                  (this.status.netdeppga3 / this.status.netdeppga) * 100,
                )
          this.status.netdeppga15ratio =
            this.status.netdeppga == 0
              ? 0
              : Math.round(
                  (this.status.netdeppga15 / this.status.netdeppga) * 100,
                )
          this.status.completionratio =
            this.status.netdall == 0
              ? 0
              : Math.round(
                  ((this.status.netdall - this.status.cc) /
                    this.status.netdall) *
                    1000,
                ) / 10
          this.status.withtobtfltratio =
            this.status.hubdall == 0
              ? 0
              : Math.round(
                  (this.status.withtobtflt / this.status.hubdall) * 100,
                )
          this.status.ardtfltratio =
            this.status.hubdall == 0
              ? 0
              : Math.round((this.status.ardtflt / this.status.hubdall) * 100)
          this.status.tsatfltratio =
            this.status.hubdall == 0
              ? 0
              : Math.round((this.status.tsatflt / this.status.hubdall) * 100)
          // Data for charts Arrival
          this.seriesHubArrival15.push(this.status.hubarr15ratio)
          this.chartOptionsHubArrival15.colors.push(
            this.getStatusColor(this.status.hubarr15ratio),
          )
          this.chartOptionsHubArrival15.labels.push('A15')
          this.chartOptionsHubArrival15.plotOptions.radialBar.dataLabels.name.show = true
          this.seriesHubArrival0.push(this.status.hubarr0ratio)
          this.chartOptionsHubArrival0.colors.push(
            this.getStatusColor(this.status.hubarr0ratio),
          )
          this.chartOptionsHubArrival0.labels.push('A0')
          this.chartOptionsHubArrival0.plotOptions.radialBar.dataLabels.name.show = true
          this.seriesBrgArrival[0].data.push(this.status.brgarrratio)
          this.seriesBrgArrival[0].extraData = `Bridge: ${this.status.brgarr}  / ${this.status.brgarrtotal}`
          this.seriesPaxArrival[0].data.push(this.status.inchecked)
          this.seriesPaxArrival[1].data.push(
            this.status.inbooked - this.status.inchecked,
          )
          this.chartOptionsPaxArrival.xaxis.max = this.status.inbooked

          // Data for charts Departures
          this.seriesDeparture15.push(this.status.netdep15ratio)
          this.chartOptionsDeparture15.colors.push(
            this.getStatusColor(this.status.netdep15ratio),
          )
          this.chartOptionsDeparture15.labels.push('Net D15')
          this.chartOptionsDeparture15.plotOptions.radialBar.dataLabels.name.show = true
          this.seriesDepartureLH15.push(this.status.netdeplh15ratio)
          this.chartOptionsDepartureLH15.colors.push(
            this.getStatusColor(this.status.netdeplh15ratio),
          )
          this.chartOptionsDepartureLH15.labels.push('D15')
          this.seriesDepartureMH15.push(this.status.netdepmh15ratio)
          this.chartOptionsDepartureMH15.colors.push(
            this.getStatusColor(this.status.netdepmh15ratio),
          )
          this.chartOptionsDepartureMH15.labels.push('D15')
          this.seriesDeparturePGA15.push(this.status.netdeppga15ratio)
          this.chartOptionsDeparturePGA15.colors.push(
            this.getStatusColor(this.status.netdeppga15ratio),
          )
          this.chartOptionsDeparturePGA15.labels.push('D15')
          this.seriesHubDeparture15.push(this.status.hubdep15ratio)
          this.chartOptionsHubDeparture15.colors.push(
            this.getStatusColor(this.status.hubdep15ratio),
          )
          this.chartOptionsHubDeparture15.labels.push('D15')
          this.chartOptionsHubDeparture15.plotOptions.radialBar.dataLabels.name.show = true
          this.seriesHubDeparture0.push(this.status.hubdep3ratio)
          this.chartOptionsHubDeparture0.colors.push(
            this.getStatusColor(this.status.hubdep3ratio),
          )
          this.chartOptionsHubDeparture0.labels.push('D0')
          this.chartOptionsHubDeparture0.plotOptions.radialBar.dataLabels.name.show = true
          this.seriesBrgDeparture[0].data.push(this.status.brgdepratio)
          this.seriesBrgDeparture[0].extraData = `Bridge: ${this.status.brgdep}  / ${this.status.brgdeptotal}`
          this.seriesPaxDeparture[0].data.push(this.status.outchecked)
          this.seriesPaxDeparture[1].data.push(
            this.status.outbooked - this.status.outchecked,
          )
          this.chartOptionsPaxDeparture.xaxis.max = this.status.outbooked

          this.key += 1
          this.getOperationHoursStatus('station', this.station)
        })
    },
    getOperationHoursStatus(id, station) {
      this.dataAccess
        .getOperationHoursStatus(id, station, this.history)
        .then((response) => {
          var operationHoursStatus = response.data
          var serieDeparted = []
          var serieOTPHour = []
          var serieNetOTPHour = []
          if (operationHoursStatus.length > 0) {
            var dataDeparted = 0
            var dataOTPHour = 0
            var dataNetOTPHour = 0
            for (let i = 0; i < 24; i++) {
              dataDeparted = 0
              dataOTPHour = 0
              for (let j = 0; j < operationHoursStatus.length; j++) {
                if (parseInt(operationHoursStatus[j]['hour']) == i) {
                  dataOTPHour =
                    operationHoursStatus[j]['huballdep'] == 0
                      ? 0
                      : Math.round(
                          (operationHoursStatus[j]['hubfltdep15'] /
                            operationHoursStatus[j]['huballdep']) *
                            100,
                        )
                  dataNetOTPHour =
                    operationHoursStatus[j]['accum_huballdep'] == 0
                      ? 0
                      : Math.round(
                          (operationHoursStatus[j]['accum_hubfltdep15'] /
                            operationHoursStatus[j]['accum_huballdep']) *
                            100,
                        )
                  dataDeparted = operationHoursStatus[j]['huballdep']
                  break
                }
              }
              serieDeparted.push(dataDeparted)
              serieOTPHour.push(dataOTPHour)
              serieNetOTPHour.push(dataNetOTPHour)
            }
          }
          //   this.seriesNetHours[1] = {
          //     name: this.station,
          //     type: 'area',
          //     data: serieNetOTPHour,
          //   }
          this.seriesHours = []
          this.seriesHours.push({
            name: 'Flight_Departed',
            type: 'column',
            data: serieDeparted,
          })
          this.seriesHours.push({
            name: 'Hour_OTP',
            type: 'area',
            data: serieOTPHour,
          })
          this.chartOptionsHours.annotations.yaxis[0].y = this.status.hubdep15ratio
          this.chartOptionsHours.annotations.yaxis[0].label.style.background = this.getStatusColor(
            this.status.hubdep15ratio,
          )
          this.keyNetHours += 1
          this.keyHours += 1
        })
    },
    getOperationNetHoursStatus(id) {
      this.dataAccess
        .getOperationHoursStatus(id, 'ALL', this.history)
        .then((response) => {
          var operationNetHoursStatus = response.data
          var totaldep15 = 0
          var totaldep = 0
          var serieOTPHour = []
          if (operationNetHoursStatus.length > 0) {
            var dataOTPHour = 0
            for (let i = 0; i < 24; i++) {
              dataOTPHour = 0
              for (let j = 0; j < operationNetHoursStatus.length; j++) {
                if (parseInt(operationNetHoursStatus[j]['hour']) == i) {
                  if (operationNetHoursStatus[j]['accum_huballdep'] > 0) {
                    totaldep15 +=
                      operationNetHoursStatus[j]['accum_hubfltdep15']
                    totaldep += operationNetHoursStatus[j]['accum_huballdep']
                    dataOTPHour =
                      totaldep == 0
                        ? 0
                        : Math.round((totaldep15 / totaldep) * 100)
                  }

                  break
                }
              }
              serieOTPHour.push(dataOTPHour)
            }
          }
          //   this.seriesNetHours[0] = {
          //     name: 'Network',
          //     type: 'area',
          //     data: serieOTPHour,
          //   }
          //   this.chartOptionsNetHours.annotations.yaxis[0].y = this.status.netdep15ratio
          //   this.chartOptionsNetHours.annotations.yaxis[0].label.style.background = this.getStatusColor(
          //     this.status.netdep15ratio,
          //   )
          this.keyNetHours += 1
        })
    },
    getOperationOthers(id) {
      this.dataAccess.getOperationOthers(id, this.history).then((response) => {
        if (response.data.length > 0) {
          var others = response.data[0]['fields']
          if (others['serv_type'] === 'CARGO') {
            this.status.cargoall = others['netdall']
            this.status.cargodeparted = others['netdep']
            this.status.cargocc = others['cc']
          } else if (others['serv_type'] === 'ACMI') {
            this.status.acmiall = others['netdall']
            this.status.acmideparted = others['netdep']
            this.status.acmicc = others['cc']
          } else if (others['serv_type'] === 'CHARTERS') {
            this.status.chartersall = others['netdall']
            this.status.chartersdeparted = others['netdep']
            this.status.charterscc = others['cc']
          }
        }
        if (
          this.status.cargoall + this.status.acmiall + this.status.chartersall >
          0
        ) {
          this.otherFlights = true
        } else {
          this.otherFlights = false
        }
      })
    },
    getFlightCancel(id) {
      this.dataAccess.getFlightCancel(id, this.history).then((response) => {
        this.itemsCancellation = response.data
        if (this.itemsCancellation.length > 0) {
          this.cancelation = true
        } else {
          this.cancelation = false
        }
      })
    },
    getAOG(id) {
      this.dataAccess.getAOG(id, this.history).then((response) => {
        this.itemsAOG = response.data
        if (this.itemsAOG.length > 0) {
          this.aog = true
        } else {
          this.aog = false
        }
      })
    },
    getGFSLA(id) {
      this.dataAccess.getGFSLA(id, this.history).then((response) => {
        this.itemsGFSLA = response.data
      })
    },
    getDayPaxTransf(id) {
      this.dataAccess.getDayPaxTransf(id, this.history).then((response) => {
        if (response.data.length > 0) {
          this.seriesHubConnectivity = []
          this.status.totaltransf =
            response.data[0].fields.total == null
              ? 0
              : response.data[0].fields.total
          this.status.misstransf =
            response.data[0].fields.miss == null
              ? 0
              : response.data[0].fields.miss
          this.status.connectivity =
            this.status.totaltransf == 0
              ? 0
              : Math.round(
                  1000 -
                    (this.status.misstransf / this.status.totaltransf) * 1000,
                ) / 10
          this.status.paxtransfers =
            this.status.outbooked == 0
              ? 0
              : Math.round(
                  (this.status.totaltransf / this.status.outbooked) * 100,
                )
        }
      })
    },
    getDelays(id, station) {
      this.dataAccess.getDelays(id, station, this.history).then((response) => {
        var delays = response.data

        if (delays.length > 0) {
          this.seriesDelaysNetwork[0].data = []
          this.chartOptionsDelaysNetwork.xaxis.categories = []
          this.seriesDelaysHub[0].data = []
          this.chartOptionsDelaysHub.xaxis.categories = []
          this.seriesDelaysGO[0].data = []
          this.chartOptionsDelaysGO.xaxis.categories = []

          for (let j = 0; j < delays.length; j++) {
            if (delays[j]['fields']['type'] === 'A') {
              this.seriesDelaysNetwork[0].data.push(
                delays[j]['fields']['count_flt'],
              )
              this.chartOptionsDelaysNetwork.xaxis.categories.push(
                delays[j]['fields']['resp_descr'] +
                  ' ' +
                  delays[j]['fields']['avg_min'] +
                  ' m',
              )
            } else if (delays[j]['fields']['type'] === 'D') {
              this.seriesDelaysHub[0].data.push(
                delays[j]['fields']['count_flt'],
              )
              this.chartOptionsDelaysHub.xaxis.categories.push(
                delays[j]['fields']['resp_descr'] +
                  ' ' +
                  delays[j]['fields']['avg_min'] +
                  ' m',
              )
            } else if (delays[j]['fields']['type'] === 'G') {
              this.seriesDelaysGO[0].data.push(delays[j]['fields']['count_flt'])
              this.chartOptionsDelaysGO.xaxis.categories.push(
                delays[j]['fields']['resp_descr'] +
                  ' ' +
                  delays[j]['fields']['avg_min'] +
                  ' m',
              )
            }
          }
        }
        this.keyDelay += 1
      })
    },
    getStatusColor(ratio) {
      return util.getStatusColor(ratio)
    },
    getStatusTarget() {
      return util.getStatusTarget()
    },
    getCompletionColor(ratio) {
      return util.getCompletionColor(ratio)
    },
    getCompletionTarget() {
      return util.getCompletionTarget()
    },
    getConnectivityColor(ratio) {
      return util.getConnectivityColor(ratio)
    },
    getConnectivityTarget() {
      return util.getConnectivityTarget()
    },
    formatThousands(value) {
      if (value > 1000) {
        return Math.round(value / 1000, 0) + 'k'
      } else {
        return value
      }
    },
    formatNumber(value) {
      return util.formatNumber(value)
    },
    formatDate(date) {
      return util.formatDayHours(date)
    },
    changeNetwork() {
      this.$store.commit('set_network_vCard', !this.showNetwork)
      if (!this.showNetwork) this.$store.commit('set_hub_vCard', true)
    },
    changeHub() {
      this.$store.commit('set_hub_vCard', !this.showHub)
      if (!this.showHub) this.$store.commit('set_network_vCard', true)
    },
    resetChartSize(windowSize) {
      if (windowSize > this.xlSize) {
        if (this.small) {
          this.chartsValues = JSON.parse(
            JSON.stringify(this.chartsXLSmallValues),
          )
        } else {
          this.chartsValues = JSON.parse(JSON.stringify(this.chartsXLValues))
        }
      } else if (windowSize > this.lgSize) {
        if (this.small) {
          this.chartsValues = JSON.parse(
            JSON.stringify(this.chartsLGSmallValues),
          )
        } else {
          this.chartsValues = JSON.parse(JSON.stringify(this.chartsLGValues))
        }
      } else if (windowSize > this.mdSize) {
        if (this.small) {
          this.chartsValues = JSON.parse(
            JSON.stringify(this.chartsMDSmallValues),
          )
        } else {
          this.chartsValues = JSON.parse(JSON.stringify(this.chartsMDValues))
        }
      } else if (windowSize > this.smSize) {
        if (this.small) {
          this.chartsValues = JSON.parse(JSON.stringify(this.chartsLGValues))
        } else {
          this.chartsValues = JSON.parse(JSON.stringify(this.chartsSMValues))
        }
      } else {
        if (this.small) {
          this.chartsValues = JSON.parse(JSON.stringify(this.chartsLGValues))
        } else {
          this.chartsValues = JSON.parse(JSON.stringify(this.chartsXSValues))
        }
      }
    },
    getGFKPICode(kpiname) {
      if (kpiname == undefined || kpiname == null) {
        return 'UNK'
      }
      if (kpiname.includes('Tempo de encosto de manga')) {
        return 'Arrival - TTB'
      }
      if (kpiname.includes('Tempo de encosto de escadas')) {
        return 'Arrival - TTS'
      }
      if (kpiname.includes('Início de desembarque')) {
        return 'Arrival - SDB'
      }
      if (kpiname.includes('Abertura de porões')) {
        return 'Arrival - HO'
      }
      if (kpiname.includes('Entrega bag. local Business')) {
        return 'Arrival - DBB'
      }
      if (kpiname.includes('Entrega bag. local Economy')) {
        return 'Departure - DBE'
      }
      if (kpiname.includes('Tempo de Espera em Bus')) {
        return 'Departure - TWB'
      }
      return 'UNK'
    },
    getGFKPIDescription(kpiname) {
      if (kpiname == undefined || kpiname == null) {
        return 'Unkown'
      }
      if (kpiname.includes('Tempo de encosto de manga')) {
        return 'Arrival - Time to Touch Bridge'
      }
      if (kpiname.includes('Tempo de encosto de escadas')) {
        return 'Arrival - Time to Touch Stairs'
      }
      if (kpiname.includes('Início de desembarque')) {
        return 'Arrival - Start Deboarding'
      }
      if (kpiname.includes('Abertura de porões')) {
        return 'Arrival - Time to Hull Open'
      }
      if (kpiname.includes('Entrega bag. local Business')) {
        return 'Arrival - Time to Deliver Bag Business'
      }
      if (kpiname.includes('Entrega bag. local Economy')) {
        return 'Departure - Time to Deliver Bag Economy'
      }
      if (kpiname.includes('Tempo de Espera em Bus')) {
        return 'Departure - Time to Wait for Bus'
      }
      return 'UNK'
    },
    showOtherFlights() {
      if (this.getWindowsWith() > this.smSize) {
        return true
      } else {
        return this.otherFlights
      }
    },
    openOtherFlights() {
      if (this.otherFlights == false) {
        this.otherFlights = true
      } else {
        this.otherFlights = false
      }
    },
    numberOfOtherFlights() {
      return (
        this.status.cargoall + this.status.acmiall + this.status.chartersall
      )
    },
    showAOG() {
      if (this.getWindowsWith() > this.smSize) {
        return true
      } else {
        return this.aog
      }
    },
    openAOG() {
      if (this.aog == false) {
        this.aog = true
      } else {
        this.aog = false
      }
    },
    numberOfAOG() {
      if (this.itemsAOG == undefined) {
        return 0
      }
      return this.itemsAOG.length
    },
    showCancellations() {
      if (this.getWindowsWith() > this.smSize) {
        return true
      } else {
        return this.cancelation
      }
    },
    openCancellations() {
      if (this.cancelation == false) {
        this.cancelation = true
      } else {
        this.cancelation = false
      }
    },
    numberOfCancellations() {
      if (this.itemsCancellation == undefined) {
        return 0
      }
      return this.itemsCancellation.length
    },
    formatTOBT(tobtflt) {
      return util.formatDecimal(tobtflt, 2)
    },
  },
  mounted() {
    this.chartOptionsHubArrival15 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsHubArrival0 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsBrgArrival = Object.assign({}, this.chartOptionsBrg)
    this.chartOptionsBrgDeparture = Object.assign({}, this.chartOptionsBrg)
    this.chartOptionsHubDeparture15 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsHubDeparture0 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsDeparture15 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsDepartureLH15 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsDepartureMH15 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsDeparturePGA15 = JSON.parse(
      JSON.stringify(this.chartOptionsOTP),
    )
    this.chartOptionsPaxArrival = Object.assign({}, this.chartOptionsPax)
    this.chartOptionsPaxDeparture = Object.assign({}, this.chartOptionsPax)
    this.chartOptionsDelaysNetwork = util.chartOptionsDelays(this.darkMode)
    this.chartOptionsDelaysHub = util.chartOptionsDelays(this.darkMode)
    this.chartOptionsDelaysGO = util.chartOptionsDelays(this.darkMode)
    this.dataAccess = new DataAccess(this.$msal)
    this.refreshData()
    this.timer = setInterval(
      function () {
        this.refreshData()
      }.bind(this),
      30000,
    )
    this.resetChartSize(window.innerWidth)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  created() {
    this.$emit('stations', this.station)
    this.$emit('smalls', this.small)
  },
  computed: {
    showNetwork() {
      return this.$store.state.home.showNetwork
    },
    showHub() {
      return this.$store.state.home.showHub
    },
  },
  watch: {
    history() {
      this.refreshData()
    },
  },
}           
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chart {
  max-width: 650px;
  margin: 35px auto;
}
.rounded-card {
  border-radius: 25px; /* Adjust the value as needed */
}
.v-data-table th,
.v-data-table td {
  font-size: 9px; /* Adjust the font size as needed */
}
/* Optionally, you can target the header specifically */
.v-data-table th {
  font-weight: bold;
  /* Additional styles for header if needed */
}
</style>
