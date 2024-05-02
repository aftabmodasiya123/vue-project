<template>
  <v-app id="home">
    <v-container grid-list-md text-xs-center>
      <PieChart
        :stations="station"
        :smalls="1"
        v-if="getWindowWidth() > 1200"
      />
      <FlightStatus :stations="station" />
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PieChart from './PieChartPart.vue'
import FlightStatus from './FlightStatusPart.vue'
import { useStore } from 'vuex'
const store = useStore()

const station = ref(null)

const getWindowWidth = () => {
  return window.innerWidth
}

onMounted(() => {
  station.value = store.getters.station
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
