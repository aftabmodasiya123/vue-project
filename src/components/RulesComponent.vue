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
                                <v-toolbar-title>RULES</v-toolbar-title>
                                <v-divider class="mx-4"
                                           inset
                                           vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog"
                                          max-width="500px">
                                    <v-card>
                                        <v-card-title>
                                            <span class="text-h5">{{ formTitle }}</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.ltyellow"
                                                                      label="LT Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.ltred"
                                                                      label="LT Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.arrivbagmavg"
                                                                      label="Arrival BagM"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.otpyellow"
                                                                      label="OTP Yellow"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.mct"
                                                                      label="MCT"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.cfyellow"
                                                                      label="CF Yellow"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.cfred"
                                                                      label="CF Red"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.depbagmlimite"
                                                                      label="Dep BagM Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.depbagmred"
                                                                      label="Dep BagM Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.ptyellow"
                                                                      label="PT Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.ptred"
                                                                      label="PT Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.h2hyellow"
                                                                      label="H2H Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.h2hred"
                                                                      label="H2H Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.doorclosealert"
                                                                      label="Door Close Alert (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.turndyellow"
                                                                      label="Turnd Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.turndred"
                                                                      label="Turnd Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.arrbagmyellow"
                                                                      label="Arr BagM Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.arrbagmred"
                                                                      label="Arr BagM Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.tsatyellow"
                                                                        label="TSAT Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.tsatred"
                                                                        label="TSAT Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.ardtyellow"
                                                                        label="ARDT Yellow (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.ardtred"
                                                                        label="ARDT Red (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.mttt"
                                                                        label="MTTT Trigger (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.pcdo"
                                                                        label="Pax and Cargo Open Trigger (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.pcdc"
                                                                        label="Pax and Cargo Close Trigger (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.startbrdng"
                                                                        label="Start Boarding Trigger (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                            sm="6"
                                                            md="4">
                                                        <v-text-field v-model="editedItem.fields.endbrdng"
                                                                        label="End Boarding Trigger (min)"></v-text-field>
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
                        <template v-slot:item.fields.hubid="{ item }">
                            {{ formatHub(item.fields.hubid) }}
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
                        <template v-slot:no-data>
                            <v-btn color="primary"
                                   @click="getRules('rules')">
                                Reset
                            </v-btn>
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
                dow: util.getDoW(),
                hub: this.$store.getters.hub,
                dialog: false,
                dialogDelete: false,
                errorMessages: {},
                headers: [
                    {
                        text: 'Hub',
                        align: 'center',
                        sortable: true,
                        value: '',
                        tip: "Rule's Hub"
                    },
                    { text: 'Actions', value: 'actions', sortable: false },
                    {
                        text: 'LT Yellow',
                        align: 'center',
                        value: 'fields.ltyellow',
                        tip: "Late Transfer Yellow Minutes Trigger"
                    },
                    {
                        text: 'LT Red',
                        align: 'center',
                        value: 'fields.ltred',
                        tip: "Late Transfer Red Minutes Trigger"
                    },
                    {
                        text: 'Arr Bag M',
                        align: 'center',
                        value: 'fields.arrivbagmavg',
                        tip: "Arrival Bag M Baggage Trigger"
                    },
                    {
                        text: 'OTP Yellow',
                        align: 'center',
                        value: 'fields.otpyellow',
                        tip: "OTP Yellow Minutes Trigger"
                    },
                    {
                        text: 'MCT',
                        align: 'center',
                        value: 'fields.mct',
                        tip: "Minimum Connecting Time Minutes"
                    },
                    {
                        text: 'CF Yellow',
                        align: 'center',
                        value: 'fields.cfyellow',
                        tip: "Connecting Yellow Minutes Trigger"
                    },
                    {
                        text: 'CF Red',
                        align: 'center',
                        value: 'fields.cfred',
                        tip: "Connecting Red Minutes Trigger"
                    },
                    {
                        text: 'Dep Bag M Yellow',
                        align: 'center',
                        value: 'fields.depbagmlimite',
                        tip: "Departure Bag M Yellow Minutes Trigger"
                    },
                    {
                        text: 'Dep Bag M Red',
                        align: 'center',
                        value: 'fields.depbagmred',
                        tip: "Departure Bag M Red Minutes Trigger"
                    },
                    {
                        text: 'PT Yellow',
                        align: 'center',
                        value: 'fields.ptyellow',
                        tip: "Passenger Transfer Yellow Minutes Trigger"
                    },
                    {
                        text: 'PT Red',
                        align: 'center',
                        value: 'fields.ptred',
                        tip: "Passenger Transfer Red Minutes Trigger"
                    },
                    {
                        text: 'H2H Yellow',
                        align: 'center',
                        value: 'fields.h2hyellow',
                        tip: "Hull-to-Hull Yellow Minutes Trigger"
                    },
                    {
                        text: 'H2H Red',
                        align: 'center',
                        value: 'fields.h2hred',
                        tip: "Hull-to-Hull Red Minutes Trigger"
                    },
                    {
                        text: 'Door Close Alert',
                        align: 'center',
                        value: 'fields.doorclosealert',
                        tip: "Door Close Alert Minutes"
                    },
                    {
                        text: 'Turnd Yellow',
                        align: 'center',
                        value: 'fields.turndyellow',
                        tip: "Turnaround Yellow Minutes Trigger"
                    },
                    {
                        text: 'Turnd Red',
                        align: 'center',
                        value: 'fields.turndred',
                        tip: "Turnaround Red Minutes Trigger"
                    },
                    {
                        text: 'Arrival Bag M Yellow',
                        align: 'center',
                        value: 'fields.arrbagmyellow',
                        tip: "Arrival Bag M Yellow Minutes Trigger"
                    },
                    {
                        text: 'Arrival Bag M Red',
                        align: 'center',
                        value: 'fields.arrbagmred',
                        tip: "Arrival Bag M Red Minutes Trigger"
                    },
                    {
                        text: 'TSAT Yellow',
                        align: 'center',
                        value: 'fields.tsatyellow',
                        tip: "TSAT Yellow Minutes Trigger"
                    },
                    {
                        text: 'TSAT Red',
                        align: 'center',
                        value: 'fields.tsatred',
                        tip: "TSAT Red Minutes Trigger"
                    },
                    {
                        text: 'ARDT Yellow',
                        align: 'center',
                        value: 'fields.ardtyellow',
                        tip: "ARDT Yellow Minutes Trigger"
                    },
                    {
                        text: 'ARDT Red',
                        align: 'center',
                        value: 'fields.ardtred',
                        tip: "ARDT Red Minutes Trigger"
                    },
                    {
                        text: 'MTTT',
                        align: 'center',
                        value: 'fields.mttt',
                        tip: "MTTT Minutes Trigger"
                        },
                    {
                        text: 'PCDO',
                        align: 'center',
                        value: 'fields.pcdo',
                        tip: "Pax and Cargo Open Minutes Trigger"
                    },
                    {
                        text: 'PCDC',
                        align: 'center',
                        value: 'fields.pcdc',
                        tip: "Pax and Cargo Close Minutes Trigger"
                    },
                    {
                        text: 'Start Boarding',
                        align: 'center',
                        value: 'fields.startbrdng',
                        tip: "Start Boarding Minutes Trigger"
                    },
                    {
                        text: 'End Boarding',
                        align: 'center',
                        value: 'fields.endbrdng',
                        tip: "End Boarding Minutes Trigger"
                    }            
                ],
                editedIndex: -1,
                editedItem: {
                    'pk': -1,
                    'fields': {
                        'hub': '',
                        'ltyellow': 0,
                        'ltred': 0,
                        'arrivbagmavg': 0,
                        'otpyellow': 0,
                        'mct': 0,
                        'cfyellow': 0,
                        'cfred': 0,
                        'depbagmlimite': 0,
                        'depbagmred': 0,
                        'ptyellow': 0,
                        'ptred': 0,
                        'h2hyellow': 0,
                        'h2hred': 0,
                        'doorclosealert': 0,
                        'turndred': 0,
                        'turndyellow': 0,
                        'arrbagmred': 0,
                        'arrbagmyellow': 0,
                        'tsatred': 0,
                        'tsatyellow': 0,
                        'ardtred': 0,
                        'ardtyellow': 0,
                        'mttt': 0,
                        'pcdo': 0,
                        'pcdc': 0,
                        'startbrdng': 0,
                        'endbrdng': 0
                    }
                },
                defaultItem: {
                    'pk': -1,
                    'fields': {
                        'hub': '',
                        'ltyellow': 0,
                        'ltred': 0,
                        'arrivbagmavg': 0,
                        'otpyellow': 0,
                        'mct': 0,
                        'cfyellow': 0,
                        'cfred': 0,
                        'depbagmlimite': 0,
                        'depbagmred': 0,
                        'ptyellow': 0,
                        'ptred': 0,
                        'h2hyellow': 0,
                        'h2hred': 0,
                        'doorclosealert': 0,
                        'turndred': 0,
                        'turndyellow': 0,
                        'arrbagmred': 0,
                        'arrbagmyellow': 0,
                        'tsatred': 0,
                        'tsatyellow': 0,
                        'ardtred': 0,
                        'ardtyellow': 0,
                        'mttt': 0,
                        'pcdo': 0,
                        'pcdc': 0,
                        'startbrdng': 0,
                        'endbrdng': 0
                    }
                },
                items: [],
                itemsHubs: []
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
            getListHubs(id) {
                try {
                    this.dataAccess.getListHubs(id).then((response) => {
                        this.itemsHubs = [];
                        for (var i in response.data) {
                            this.itemsHubs.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.itemsHubs = [];
                }
            },
            getRules(id) {
                try {
                    this.dataAccess.getRules(id).then((response) => {
                        this.items = [];
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            setRule(id, rule) {
                try {
                    this.errorMessages = {};
                    this.dataAccess.setRule(id, rule).then(() => {
                        this.getRules(id);
                        this.errorMessages = { 'Success': ['Item saved'] };
                    }).catch((error) => {
                        if (error.message) {
                            this.errorMessages = error.response.data['rule']['fields'];
                        }
                    });
                } catch(error) {
                    this.items = [];
                }
            },
            deleteRule(id, pk) {
                try {
                    this.dataAccess.deleteRule(id, pk).then(() => {
                        this.getRules(id);
                    });
                } catch (error) {
                    this.items = [];
                }
            },
            editItem(item) {
                this.editedIndex = this.items.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                this.editedIndex = this.items.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm() {
                this.deleteRule('rules', this.items[this.editedIndex]['pk'])
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
                this.setRule('rules', this.editedItem);
            },
            formatHub(column) {
                for (let hub in this.itemsHubs) {
                    if (column == this.itemsHubs[hub]['pk']) return this.itemsHubs[hub]['fields']['hub']
                }
                return 'All';
            },
            isEmpty() {
                return Object.keys(this.errorMessages).length === 0;
            },
            isSucess() {
                return Object.keys(this.errorMessages).length === 1 && Object.keys(this.errorMessages)[0] === 'Success';
            },
            messageColor() {
                return (this.isSucess()) ? 'green lighten-3' : 'red lighten-2';
            }
            
        },
        mounted() {
            this.hub = this.$store.getters.hub;
            this.dataAccess = new DataAccess(this.$msal);
            this.getRules('rules');
            this.getListHubs('rules');
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

