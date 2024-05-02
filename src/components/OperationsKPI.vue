<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center fluid>
            <PieChart :stations="hub" :smalls="0" />
        </v-container>
    </v-app>
</template>

<script>
import PieChart from './PieChartPart.vue';

    export default {
        components: {
            PieChart,
        },
        data() {
            return {
                dataAccess: null,
                hub: this.$store.getters.hub,
                isMobile: false,
                allSwitch: false,
            }
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

./PieChartPart.vue