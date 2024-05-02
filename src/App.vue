<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-subheader>Functionalities</v-list-subheader>
        <v-divider></v-divider>
        <v-list-item v-for="item in itemsMenu" :key="item.title" :to="item.to">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title
            v-text="item.name"
            @click="isStationView = false"
          />
        </v-list-item>
        <v-list-item>
          <v-switch
            dense
            v-model="darkMode"
            class="text-caption"
            :label="darkMode == false ? 'White Mode' : 'Dark Mode'"
          ></v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense clipped-left>
      <v-col class="hubtm-title ma-0 pa-0" cols="5" lg="4">
        <v-icon large @click="home()" color="red darken-4" class="mr-3 pa-0">
          mdi-blur
        </v-icon>
        {{ getApplicationTitle() }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="hubtm-hour" cols="4" lg="2">
        <v-row>
          <v-col cols="4" class="ma-0 pa-0 text-center">Date</v-col>
          <v-col cols="4" class="ma-0 pa-0 text-center">Local</v-col>
          <v-col cols="4" class="ma-0 pa-0 text-center">UTC</v-col>
          <v-col cols="4" class="ma-0 pa-0 text-center">
            <strong>{{ currentDate }}</strong>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0 text-center">
            <strong>{{ currentTime }}</strong>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0 text-center">
            <strong>{{ utcCurrentTime }}</strong>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="2"
        lg="3"
        class="user-title ma-0 pa-0"
        v-if="isNowAuthenticated()"
      >
        {{ getName() }}
        <v-icon
          small
          class="ma-0 pa-0"
          color="red darken-4"
          @click="fullLogout"
        >
          mdi-logout
        </v-icon>
      </v-col>
      <v-col cols="2" lg="2" class="user-title ma-0 pa-0" v-else>
        <v-icon
          medium
          class="ma-0 pa-0"
          color="red darken-4"
          @click="fullLogout"
        >
          mdi-login
        </v-icon>
      </v-col>
      <v-app-bar-nav-icon
        color="red darken-4"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <template v-slot:extension v-if="isStationView">
        <v-col cols="10" sm="10">
          <v-tabs
            color="red darken-4"
            v-model="indexStation"
            bg-color="transparent"
          >
            <v-tab
              v-for="(stationName, index) in itemsStation"
              v-bind:key="index"
              @click="changeStation(index)"
            >
              {{ stationName }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col align="right" cols="1" sm="1">
          <v-text-field
            dense
            color="#B71C1C"
            v-model="search"
            append-icon="mdi-magnify"
            label="Station"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </template>
      <template v-slot:extension v-else>
        <v-col cols="9" sm="10" class="ma-0 pa-0">
          <v-tabs
            color="red darken-4"
            bg-color="transparent"
            center-active
            show-arrows
            v-model="indexTab"
          >
            <v-tab class="hubtm-menu" to="/">Home</v-tab>
            <v-tab
              class="hubtm-menu"
              to="/stationview/"
              @click="isStationView = true"
            >
              Station View
            </v-tab>
            <v-tab class="hubtm-menu" to="/controlview/">Control View</v-tab>
            <!--v-tab class="hubtm-menu" to="/outerstations/">Outer Station View</v-tab-->
            <v-tab class="hubtm-menu" to="/departures/">Departures</v-tab>
            <v-tab class="hubtm-menu" to="/h2h/">H2H</v-tab>
            <v-tab class="hubtm-menu" to="/d2d/">Pax Transfer D2D</v-tab>
            <v-tab class="hubtm-menu" to="/bagstatus/">Get Bag Status</v-tab>
          </v-tabs>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" lg="1" class="ma-0 pa-0">
          <v-tabs
            color="red darken-4"
            direction="vertical"
            v-model="indexHub"
            height="40px"
          >
            <v-tab
              v-for="(hubName, index) in itemsHub"
              v-bind:key="index"
              class="hub-menu"
              @click="changeHub(index)"
            >
              {{ hubName }}
            </v-tab>
          </v-tabs>
        </v-col>
      </template>
    </v-app-bar>
    <v-main :key="componentKey">
      <v-sheet>
        <router-view />
      </v-sheet>
    </v-main>
    <v-footer tile padless>
      <v-row dense>
        <v-col class="text-right footer-title" cols="6">
          ({{ this.getVersion() }}) 2023 - Built By ACCairlines to:
        </v-col>
        <v-col class="text-left footer-title" cols="4">
          <v-img
            :src="require('./assets/tap_logo_trs_Footer.png')"
            max-height="30"
            max-width="150"
          />
        </v-col>
        <v-col class="text-right footer-title" cols="2">
          <input type="hidden" id="token" />
          <v-icon @click="copyToken">mdi-content-copy</v-icon>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { useTheme } from 'vuetify'
import { DataAccess } from './plugins/DataAccess'
import { Utils } from './plugins/Utils'

const util = new Utils()

export default {
  data() {
    return {
      drawer: false,
      componentKey: 0,
      indexTab: 'Home',
      indexHub: 1,
      isStationView: false,
      indexStation: 4,
      itemsMenu: [],
      itemsMenuAdmin: [
        { icon: 'mdi-ruler-square-compass', name: 'Rules', to: '/rules/' },
        {
          icon: 'mdi-airplane',
          name: 'Equipment Types',
          to: '/equipmenttypes',
        },
        { icon: 'mdi-taxi', name: 'Taxi Time', to: '/taxitimes/' },
        { icon: 'mdi-airplane', name: 'Registrations', to: '/registrations/' },
        { icon: 'mdi-bag-checked', name: 'Ref. ULD', to: '/refuld/' },
        {
          icon: 'mdi-bag-suitcase',
          name: 'Bag Time Reference',
          to: '/bagtimereference/',
        },
        {
          icon: 'mdi-shield-home',
          name: 'PTM Ref Sec Times',
          to: '/ptmrefsectimes/',
        },
        {
          icon: 'mdi-boom-gate',
          name: 'PTM Ref Sec to Gate',
          to: '/bagrefsecgate/',
        },
        {
          icon: 'mdi-clock-time-three',
          name: 'UTC Convert Local Times',
          to: '/stations/',
        },
        { icon: 'mdi-hubspot', name: 'Hubs List', to: '/hubs/' },
        {
          icon: 'mdi-refresh-circle',
          name: 'Refresh Flight',
          to: '/refreshflight/',
        },
        {
          icon: 'mdi-message-settings',
          name: 'Standards Messages',
          to: '/standard/',
        },
      ],
      itemsHub: [],
      itemsStation: [],
      itemsStationTimezones: [],
      search: '',
      hub: this.$store.getters.hub,
      timezone: this.$store.getters.timezone,
      darkMode: this.$store.getters.darkMode,
      station: '',
      accessToken: '',
      userInfo: {},
      currentTime: null,
      currentDate: null,
      dataAccess: null,
      timerTime: null,
      utcCurrentTime: null,
      theme: useTheme(),
    }
  },
  created() {
    this.$store.commit('set_authenticate', false)
    this.$store.commit('setInitialState')
    this.$store.commit('clear_authenticate')
    this.$msal.authenticateRedirect()
    this.dataAccess = new DataAccess(this.$msal)
    this.dataAccess.getUserInfo().then((response) => {
      this.userInfo = response
    })
    if (this.isStationView == true) {
      this.$store.commit(
        'set_timezone',
        util.getTimezone(
          this.station,
          this.itemsStation,
          this.itemsStationTimezones,
        ),
      )
    } else {
      this.$store.commit(
        'set_timezone',
        util.getTimezone(
          this.hub,
          this.itemsStation,
          this.itemsStationTimezones,
        ),
      )
    }
    this.darkMode = this.$store.getters.darkMode
    this.getCurrentTime()
  },
  watch: {
    indexHub: {
      handler: function () {
        this.hub = this.itemsHub[this.indexHub]
        this.$store.commit('set_hub', this.hub)
        this.$store.commit(
          'set_timezone',
          util.getTimezone(
            this.hub,
            this.itemsStation,
            this.itemsStationTimezones,
          ),
        )
        this.getCurrentTime()
        this.componentKey += 1
      },
    },
    indexStation: {
      handler: function () {
        this.station = this.itemsStation[this.indexStation]
        this.$store.commit('set_station', this.station)
        this.$store.commit(
          'set_timezone',
          util.getTimezone(
            this.station,
            this.itemsStation,
            this.itemsStationTimezones,
          ),
        )
        this.getCurrentTime()
        this.componentKey += 1
      },
    },
    userInfo: {
      handler: function () {
        if (this.userInfo != null) {
          this.$store.commit('set_authenticate', true)
          this.getLogin()
          clearInterval(this.timer)
        }
      },
    },
    isStationView: {
      handler: function () {
        if (this.isStationView == true) {
          this.$store.commit(
            'set_timezone',
            util.getTimezone(
              this.station,
              this.itemsStation,
              this.itemsStationTimezones,
            ),
          )
        } else {
          this.$store.commit(
            'set_timezone',
            util.getTimezone(
              this.hub,
              this.itemsStation,
              this.itemsStationTimezones,
            ),
          )
        }
        this.getCurrentTime()
      },
    },
    search: {
      handler: function () {
        this.searchStation(this.search)
      },
    },
    darkMode: {
      handler: function (newVal) {
        this.darkMode = newVal
        this.$store.commit('set_mode', this.darkMode)
        this.theme.global.name = this.darkMode ? 'dark' : 'light'
        this.componentKey += 1
      },
    },
  },
  methods: {
    fullLogout() {
      this.$store.commit('clear_authenticate')
      this.$msal.logoutRedirect()
      this.$router.push('/login')
    },
    home() {
      this.isStationView = false
      this.indexTab = 'Home'
      this.$router.push('/')
    },
    getVersion() {
      return require('../package.json').version
    },
    getCurrentTime() {
      this.dataAccess.getCurrentTime().then((response) => {
        let date = response
        this.timezone = this.$store.getters.timezone
        let formattedDate = date
          .toLocaleDateString('en-GB', {
            timeZone: this.timezone,
            day: '2-digit',
            month: 'short',
          })
          .toUpperCase()
        this.currentDate = formattedDate
        let formattedTime = date.toLocaleTimeString('en-GB', {
          timeZone: this.timezone,
          hour: '2-digit',
          minute: '2-digit',
        })
        this.currentTime = formattedTime
        let utcDate = new Date(
          date.getTime() + date.getTimezoneOffset() * 60000,
        )
        this.utcCurrentTime = util.formatHours(utcDate)
      })
    },
    getHubList(id) {
      this.dataAccess.getHubList(id).then((response) => {
        this.itemsHub = response.data
        for (let i = 0; i < this.itemsHub.length; i++) {
          if (this.hub == this.itemsHub[i]) {
            this.indexHub = i
          }
        }
        if (this.hub === undefined) {
          this.changeHub(0)
        }
        for (let i = 0; i < this.itemsHub.length; i++) {
          if (this.hub == this.itemsHub[i]) {
            this.changeHub(i)
          }
        }
        this.$store.commit('set_hub', this.hub)
      })
    },
    getStationList() {
      this.dataAccess.getStations('station').then((response) => {
        for (var i in response.data) {
          this.itemsStation.push(response.data[i]['fields']['station'])
          this.itemsStationTimezones.push(
            response.data[i]['fields']['timezone'],
          )
        }
        this.station = this.itemsStation[this.indexStation]
        this.$store.commit('set_station', this.station)
        this.getCurrentTime()
      })
    },
    changeHub(index) {
      this.indexHub = index
    },
    changeStation(index) {
      this.indexStation = index
    },
    searchStation(station) {
      for (let i = 0; i < this.itemsStation.length; i++) {
        if (this.itemsStation[i] === station) {
          this.indexStation = i
          return
        }
      }
    },
    getLogin() {
      if (this.isNowAuthenticated()) {
        if (this.itemsHub.length == 0) {
          this.dataAccess = new DataAccess(this.$msal)
          this.getHubList('app')
          this.getStationList('app')
          this.componentKey += 1
        }
      }
      this.hasNoRole()
      this.isStationUser()
    },
    copyToken() {
      let token = document.querySelector('#token')
      this.dataAccess.getToken().then((response) => {
        token.setAttribute('type', 'text')
        token.value = response
        token.select()

        try {
          var successful = document.execCommand('copy')
          var msg = successful ? response : 'unsuccessful'
          alert('Token was copied ' + msg)
        } catch (err) {
          alert('Oops, unable to copy')
        }

        /* unselect the range */
        token.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      })
    },
    getUsername() {
      if (this.$store.getters.isAuthenticated == false) return ''
      else if (this.userInfo != null) {
        return this.userInfo.username
      } else return 'Loading user information...'
    },
    getName() {
      if (window.innerWidth < 600) {
        return ''
      }
      if (this.$store.getters.isAuthenticated == false) return ''
      else if (this.userInfo) return this.userInfo.name
      else return ''
    },
    isNowAuthenticated() {
      this.isAdmin()
      if (this.$store.getters.isAuthenticated == true) return true
      return false
    },
    isAdmin() {
      if (
        this.userInfo != null &&
        this.userInfo.idTokenClaims != undefined &&
        this.userInfo.idTokenClaims.roles != undefined
      ) {
        if (this.userInfo.idTokenClaims.roles.includes('HubTMAdmin')) {
          this.itemsMenu = this.itemsMenuAdmin
        }
      }
    },
    isStationUser() {
      if (this.$store.getters.isAuthenticated == false) return false
      if (
        this.userInfo != null &&
        this.userInfo.idTokenClaims.roles != null &&
        this.userInfo.idTokenClaims.roles.includes('HubTMStation')
      ) {
        this.isStationView = true
        this.$router.push({ name: 'stationview' })
      }
      return false
    },
    hasNoRole() {
      if (this.$store.getters.isAuthenticated == false)
        this.$router.push({ name: 'login' })
      if (!this.userInfo == null || !this.userInfo.idTokenClaims.roles)
        this.$router.push({ name: 'login' })
    },
    getApplicationTitle() {
      if (window.innerWidth < 769) {
        return 'TAP HubTM'
      } else {
        return 'TAP Hub Track and Management'
      }
    },
  },
  mounted() {
    this.timerTime = setInterval(
      function () {
        this.getCurrentTime()
      }.bind(this),
      10000,
    )
  },
  beforeUnmount() {
    clearInterval(this.timerTime)
  },
}
</script>

<style scoped>
.hubtm-title {
  font-size: 1.9rem;
  color: #b71c1c;
}
.hubtm-hour {
  text-align: center;
  font-size: 0.9rem;
}
.user-title {
  text-align: right;
  background-color: rgba(0, 0, 0, 0);
  font-size: 0.9rem;
  color: #b71c1c;
}
.footer-title {
  font-size: 0.8rem;
  vertical-align: middle;
}

@media (max-width: 1400px) {
  .hubtm-title {
    font-size: 1.2rem; /* Adjust size for smaller screens */
  }
  .hubtm-hour {
    text-align: center;
    font-size: 0.7rem;
  }
  .user-title {
    text-align: right;
    background-color: rgba(0, 0, 0, 0);
    font-size: 0.7rem;
    color: #b71c1c;
  }
  .footer-title {
    font-size: 0.4rem;
    vertical-align: middle;
  }
}

@media (max-width: 600px) {
  .hubtm-title {
    font-size: 1rem; /* Further adjust size for even smaller screens */
  }
  .hubtm-hour {
    text-align: center;
    font-size: 0.7rem;
  }
  .user-title {
    text-align: right;
    background-color: rgba(0, 0, 0, 0);
    font-size: 0.7rem;
    color: #b71c1c;
  }
  .footer-title {
    font-size: 0.7rem;
    vertical-align: middle;
  }
}
</style>
