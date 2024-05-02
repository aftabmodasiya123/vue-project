<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <v-row no-gutters class="ma-0 pa-0">
                <v-col>
                    <v-card elevation="0"
                            shaped
                            tile>
                        <v-card-title class="text-subtitle-2 justify-center">
                            This application is log with TAP's Microsoft credentials and specific roles. Please contact Vitor Martins of IOC to gain access.
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    export default {
        data: function () {
            return {
                error: ''
            }
        },
        methods: {
            fullLogout() {
                this.$store.commit('clear_authenticate');
                this.$msal.logoutRedirect();
            },
            async doLogin() {
                try {
                    this.$msal.signin();
                } catch (err) {
                    this.error = err.toString()
                }
            }
        },
        created() {
            this.fullLogout();    
        },
        mounted() {
            this.fullLogout();    
        }
    }
</script>

<style scoped>
    .centered {
        text-align: center;
    }
</style>