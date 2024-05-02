<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col>
                    <v-data-table :headers="headers"
                                  :items="items"
                                  sort-by="hub"
                                  class="elevation-1">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title><a @click="$router.go(-1)"><strong>BACK</strong></a>&nbsp;|&nbsp;Messages</v-toolbar-title>
                                <v-divider class="mx-4"
                                           inset
                                           vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog"
                                          max-width="500px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="primary"
                                               dark
                                               class="mb-2"
                                               v-bind="attrs"
                                               v-on="on">
                                            New Item
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="text-h5">Create Messages</span>
                                        </v-card-title>
                                        <v-card-subtitle>
                                            {{ flight }}
                                        </v-card-subtitle>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" lg="12">
                                                        <v-text-field v-model="editedItem.fields.text"
                                                                      label="Custom Message"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" lg="12">
                                                        <v-select v-model="editedItem.fields.text"
                                                                  :items="itemsStandardMessages"
                                                                  item-text="fields.text"
                                                                  item-value="fields.text"
                                                                  label="Standard Messages"
                                                                  single-line></v-select>
                                                    </v-col>
                                                    <v-col cols="12" lg="6">
                                                        <v-select v-model="editedItem.fields.from_iata"
                                                                  :items="itemsStations"
                                                                  item-text="fields.station"
                                                                  item-value="fields.station"
                                                                  hint="Origin Station"
                                                                  persistent-hint
                                                                  single-line></v-select>
                                                    </v-col>
                                                    <v-col cols="12" lg="6">
                                                        <v-select v-model="editedItem.fields.to_iata"
                                                                  :items="itemsStations"
                                                                  item-text="fields.station"
                                                                  item-value="fields.station"
                                                                  hint="Destination Station"
                                                                  persistent-hint
                                                                  single-line></v-select>
                                                    </v-col>
                                                    <v-col cols="12" lg="6">
                                                        <v-select v-model="editedItem.fields.ac_registration"
                                                                  :items="itemsRegistrations"
                                                                  item-text="pk"
                                                                  item-value="pk"
                                                                  hint="Aircraft Registration"
                                                                  persistent-hint
                                                                  single-line></v-select>
                                                    </v-col>
                                                    <v-col cols="12" lg="4">
                                                        <v-select v-model="editedItem.fields.is_active"
                                                                  :items="itemsIsActive"
                                                                  item-text="description"
                                                                  item-value="code"
                                                                  label="Is Active"
                                                                  single-line></v-select>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="editedItem.fields.start_date"
                                                                      type="datetime-local" label="Start Date"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-text-field v-model="editedItem.fields.end_date"
                                                                      type="datetime-local" label="End Date"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                            <v-alert border="top"
                                                     :color="messageColor()"
                                                     dark
                                                     v-if="isEmpty() == false">
                                                <div v-for="(value, name, index) in errorMessages" v-bind:key="index">
                                                    {{ name }} - {{ value[0] }}
                                                </div>
                                            </v-alert>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1"
                                                   text
                                                   @click="close">
                                                Close
                                            </v-btn>
                                            <v-btn color="blue darken-1"
                                                   text
                                                   @click="save"
                                                   v-if="isSucess() == false">
                                                Save
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" text @click="closeDelete">Cancel</v-btn>
                                            <v-btn color="primary" text @click="deleteItemConfirm">OK</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon small
                                    class="mr-2"
                                    @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small
                                    @click="deleteItem(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                        <template v-slot:item.fields.fltinfoid="{ item }">
                            {{ formatFlight(item.flight) }}
                        </template>
                        <template v-slot:item.fields.start_date="{ item }">
                            {{ formatDayHour(item.fields.start_date) }}
                        </template>
                        <template v-slot:item.fields.end_date="{ item }">
                            {{ formatDayHour(item.fields.end_date) }}
                        </template>
                        <template v-slot:item.fields.is_active="{ item }">
                            {{ formatIsActive(item.fields.is_active) }}
                        </template>
                        <template v-slot:item.fields.ts="{ item }">
                            {{ formatDayHour(item.fields.ts) }}
                        </template>
                    </v-data-table>
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
                hub: this.$store.getters.hub,
                flightid: this.$route.params.flightId,
                flight: 'Global Message',
                dialog: false,
                dialogDelete: false,
                errorMessages: {},
                headers: [
                    {
                        text: 'Flight',
                        align: 'center',
                        sortable: true,
                        value: 'fields.fltinfoid',
                        tip: "Flight"
                    },
                    {
                        text: 'Message Text',
                        align: 'center',
                        sortable: true,
                        value: 'fields.text',
                        tip: "Message Text"
                    },
                    {
                        text: 'Origin Station',
                        align: 'center',
                        sortable: true,
                        value: 'fields.from_iata',
                        tip: "Origin Station"
                    },
                    {
                        text: 'Destination Station',
                        align: 'center',
                        sortable: true,
                        value: 'fields.to_iata',
                        tip: "Destination Station"
                    },
                    {
                        text: 'Registration',
                        align: 'center',
                        sortable: true,
                        value: 'fields.ac_registration',
                        tip: "Aircraft Registration"
                    },
                    {
                        text: 'Start Date',
                        align: 'center',
                        sortable: true,
                        value: 'fields.start_date',
                        tip: "Start Date"
                    },
                    {
                        text: 'End Date',
                        align: 'center',
                        sortable: true,
                        value: 'fields.end_date',
                        tip: "End Date"
                    },
                    {
                        text: 'Active',
                        align: 'center',
                        sortable: true,
                        value: 'fields.is_active',
                        tip: "Is Active"
                    },
                    {
                        text: 'Timestamp',
                        align: 'center',
                        sortable: true,
                        value: 'fields.ts',
                        tip: "Message Creation Timestamp"
                    },
                    { text: 'Actions', value: 'actions', sortable: false }
                ],
                editedIndex: -1,
                editedItem: {
                    'pk': -1,
                    'fields': {
                        'text': '',
                        'from_iata': '',
                        'to_iata': '',
                        'ac_registration': '',
                        'start_date': '',
                        'end_date': '',
                        'is_active': ''
                    }
                },
                defaultItem: {
                    'pk': -1,
                    'fields': {
                        'text': '',
                        'from_iata': '',
                        'to_iata': '',
                        'ac_registration': '',
                        'start_date': '',
                        'end_date': '',
                        'is_active': ''
                    }
                },
                itemsIsActive: [{ 'code': 1, 'description': 'Yes' }, { 'code': 0, 'description': 'No' }],
                items: [],
                itemsStations: [],
                itemsRegistrations: [],
                itemsStandardMessages: []
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
            dialogDelete(val) {
                val || this.closeDelete()
            },
        },
        methods: {
            getStandardMessages(id) {
                try {
                    this.dataAccess.getStandardMessages(id).then((response) => {
                        this.itemsStandardMessages = [];
                        for (var i in response.data) {
                            this.itemsStandardMessages.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.itemsStandardMessages = [];
                }
            },
            getMessages(id) {
                try {
                    this.dataAccess.getMessages(id, this.flightid).then((response) => {
                        this.items = [];
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            getFlight(flightid) {
                try {
                    this.dataAccess.getFlight('messages', flightid).then((response) => {
                        let flight = response.data[0]['fields'];
                        if (flight.operator != null && flight.operator != '') {
                            this.flight = util.formatFlight(flight.operator, flight.flt_nr) + ' ' + flight.to_iata + ' ' + util.formatDate(flight.std) + ' ' + util.formatBTD(flight)
                        }
                    })
                } catch (error) {
                    return '';
                }
                return '';
            },
            getStations(id) {
                try {
                    this.dataAccess.getStations(id).then((response) => {
                        this.itemsStations = [{ 'fields': { 'station': '' } }];
                        for (var i in response.data) {
                            this.itemsStations.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.itemsStations = [];
                }
            },
            getRegistrations(id) {
                try {
                    this.dataAccess.getRegistrations(id).then((response) => {
                        this.itemsRegistrations = [{ 'pk': '' }];
                        for (var i in response.data) {
                            this.itemsRegistrations.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.itemsRegistrations = [];
                }
            },
            setMessage(id, message) {
                try {
                    this.errorMessages = {};
                    this.dataAccess.setMessage(id, message).then(() => {
                        this.getMessages(id);
                        this.errorMessages = { 'Success': ['Item saved'] };
                    }).catch((error) => {
                        if (error.message) {
                            this.errorMessages = error.response.data.message.fields;
                        }
                    });
                } catch(error) {
                    this.items = [];
                }
            },
            deleteMessage(id, pk) {
                try {
                    this.dataAccess.deleteMessage(id, pk).then(() => {
                        this.getMessages(id);
                    });
                } catch (error) {
                    this.items = [];
                }
            },
            editItem(item) {
                this.editedIndex = this.items.indexOf(item)
                this.editedItem = Object.assign({}, item)
                if (this.editedItem.flight != null) {
                    delete this.editedItem.flight;
                }
                if (this.editedItem.fields.from_iata == null) this.editedItem.fields.from_iata = '';
                if (this.editedItem.fields.to_iata == null) this.editedItem.fields.to_iata = '';
                if (this.editedItem.fields.start_date == null) this.editedItem.fields.start_date = '';
                if (this.editedItem.fields.end_date == null) this.editedItem.fields.end_date = '';
                if (this.editedItem.fields.ac_registration == null) this.editedItem.fields.ac_registration = '';

                this.dialog = true
            },
            deleteItem(item) {
                this.editedIndex = this.items.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm() {
                this.deleteMessage('messages', this.items[this.editedIndex]['pk'])
                this.items.splice(this.editedIndex, 1)
                this.closeDelete()
            },
            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                    this.errorMessages = {};
                })
            },
            closeDelete() {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },
            save() {
                if (this.editedIndex > -1) {
                    Object.assign(this.items[this.editedIndex], this.editedItem)
                } else {
                    this.items.push(this.editedItem)
                }
                if (this.flightid != undefined && this.flightid != null) this.editedItem['fields']['fltinfoid'] = this.flightid;
                else this.editedItem['fields']['fltinfoid'] = -1;
                this.setMessage('messages', this.editedItem);
            },
            isEmpty() {
                return Object.keys(this.errorMessages).length === 0;
            },
            isSucess() {
                return Object.keys(this.errorMessages).length === 1 && Object.keys(this.errorMessages)[0] === 'Success';
            },
            messageColor() {
                return (this.isSucess()) ? 'green lighten-3' : 'red lighten-2';
            },
            formatDayHour(date) {
                return util.formatDayHours(date);
            },
            formatFlight(item) {
                if (item != undefined && item != null) {
                    return util.formatFlight(item.operator, item.flt_nr) + ' ' + item.to_iata + ' ' + util.formatDate(item.std) + ' ' + util.formatBTD(item)
                }
                return '-';
            },
            formatIsActive(isactive) {
                for (let i in this.itemsIsActive) {
                    if (this.itemsIsActive[i]['code'] == isactive) return this.itemsIsActive[i]['description'];
                }
                return '';
            }
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.dataAccess = new DataAccess(this.$msal);
            this.getMessages('messages');
            this.getStations('messages');
            this.getRegistrations('messages');
            this.getStandardMessages('messages');
            this.getFlight(this.flightid);
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

