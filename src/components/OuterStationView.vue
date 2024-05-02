<template>
    <v-app id="home">
        <v-container grid-list-md text-xs-center>
            <OuterStation :stations="stations" />
        </v-container>
    </v-app>
</template>

<script>
    import OuterStation from './OuterStationPart.vue';


    export default {
        components: {
            OuterStation,
        },
        data() {
            return {
                dataAccess: null,
                stations: this.$store.getters.outerstations,
            }
        },
        mounted() {
            this.stations = this.$store.getters.outerstations;
        }
    };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

