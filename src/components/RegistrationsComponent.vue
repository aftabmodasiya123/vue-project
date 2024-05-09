<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col>
                    <v-data-table :headers="headers"
                                  :items="items"
                                  :sort-by="sortBy"
                                  class="elevation-1">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>REGISTRATION</v-toolbar-title>
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
                                               v-on="on"
                                               @click="openDialog">
                                            New Item
                                        </v-btn>
                                    </template>
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
                                                        <v-text-field v-model="editedItem.pk"
                                                                      label="A/C Registration"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-select v-model="editedItem.fields.equiptypeid"
                                                                  :items="itemsEquipments"
                                                                  item-text="fields.equiptype"
                                                                  item-value="pk"
                                                                  label="Equipment Type"
                                                                  single-line></v-select>
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
                        <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)">
                            mdi-pencil
                         </v-icon>
                       <v-icon small @click="deleteItem(item)">
                           mdi-delete
                       </v-icon>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary"
                                   @click="getRegistration('registrations')">
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
                        text: 'A/C Registration',
                        align: 'center',
                        sortable: true,
                        value: 'pk',
                        tip: "Aircraft Tale Registration"
                    },
                    {
                        text: 'Equipment Type',
                        align: 'center',
                        sortable: true,
                        value: 'fields.equiptypeid',
                        tip: "Equipment Type"
                    },
                    { text: 'Actions', value: 'actions', sortable: false }
                ],
                editedIndex: -1,
                editedItem: {
                    'pk': -1,
                    'fields': {
                        'equiptypeid': '',
                    }
                },
                defaultItem: {
                    'pk': -1,
                    'fields': {
                        'equiptypeid': '',
                    }
                },
                items: [],
                sortBy:['hub'],
                itemsEquipments: []
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
            getEquipments(id) {
                try {
                    this.dataAccess.getEquipments(id).then((response) => {
                        this.itemsStands = [];
                        for (var i in response.data) {
                            this.itemsEquipments.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.itemsEquipments = [];
                }
            },
            openDialog(){

                this.dialog = true
            },
            getRegistrations(id) {
                try {
                    this.dataAccess.getRegistrations(id).then((response) => {
                        this.items = [];
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            setRegistration(id, registration) {
                try {
                    this.errorMessages = {};
                    this.dataAccess.setRegistration(id, registration).then(() => {
                        this.getRegistrations(id);
                        this.errorMessages = { 'Success': ['Item saved'] };
                    }).catch((error) => {
                        if (error.message) {
                            this.errorMessages = error.response.data['reg'];
                        }
                    });
                } catch(error) {
                    this.items = [];
                }
            },
            deleteRegistration(id, pk) {
                try {
                    this.dataAccess.deleteRegistration(id, pk).then(() => {
                        this.getRegistrations(id);
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
                this.deleteRegistration('registrations', this.items[this.editedIndex]['pk'])
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
                this.setRegistration('registration', this.editedItem);
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
            this.getRegistrations('registrations');
            this.getEquipments('registrations');
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

