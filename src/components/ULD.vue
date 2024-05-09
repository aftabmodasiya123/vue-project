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
                                <v-toolbar-title>ULD</v-toolbar-title>
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
                                                        <v-text-field v-model="editedItem.fields.uld"
                                                                      label="ULD"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.unloadtime"
                                                                      label="Unload Time (min)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12"
                                                           sm="6"
                                                           md="4">
                                                        <v-text-field v-model="editedItem.fields.loadtime"
                                                                      label="Load Time (min)"></v-text-field>
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
                            <v-icon small
                                    class="mr-2"
                                    @click="editItem(item)">
                                mdi-airplane-edit
                            </v-icon>
                            <v-icon small
                                    @click="deleteItem(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary"
                                   @click="getULD('uld')">
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
                        text: 'ULD',
                        align: 'center',
                        sortable: true,
                        value: 'fields.uld',
                        tip: "ULD Reference"
                    },
                    {
                        text: 'Unload Time',
                        align: 'center',
                        sortable: true,
                        value: 'fields.unloadtime',
                        tip: "Unload Time (min)"
                    },
                    {
                        text: 'Load Time',
                        align: 'center',
                        sortable: true,
                        value: 'fields.loadtime',
                        tip: "Load Time (min)"
                    },
                    { text: 'Actions', value: 'actions', sortable: false }
                ],
                editedIndex: -1,
                editedItem: {
                    'pk': -1,
                    'fields': {
                        'uld': '',
                        'unloadtime': '',
                        'loadtime': '',
                    }
                },
                defaultItem: {
                    'pk': -1,
                    'fields': {
                        'uld': '',
                        'unloadtime': '',
                        'loadtime': '',
                    }
                },
                items: [],
                sortBy:['hub']
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
            getULD(id) {
                try {
                    this.dataAccess.getULD(id).then((response) => {
                        this.items = [];
                        
                        for (var i in response.data) {
                            this.items.push(response.data[i]);
                        }
                    })
                } catch (error) {
                    this.items = [];
                }
            },
            openDialog(){

                this.dialog=true
            },
            setULD(id, uld) {
                try {
                    this.errorMessages = {};
                    this.dataAccess.setULD(id, uld).then(() => {
                        this.getULD(id);
                        this.errorMessages = { 'Success': ['Item saved'] };
                    }).catch((error) => {
                        if (error.message) {
                            this.errorMessages = error.response.data['uld']['fields'];
                        }
                    });
                } catch(error) {
                    this.items = [];
                }
            },
            deleteULD(id, pk) {
                try {
                    this.dataAccess.deleteULD(id, pk).then(() => {
                        this.getULD(id);
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
                this.deleteULD('uld', this.items[this.editedIndex]['pk'])
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
                this.setULD('uld', this.editedItem);
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
            this.getULD('uld');
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

