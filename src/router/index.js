const Home = ()=> import('../components/HomeComponent.vue');
const ControlView = ()=> import('./../components/ControlView.vue');
const Departures = ()=> import('../components/DeparturesComponent.vue');
const Bags = ()=> import('./../components/BagsFlight.vue');
const BagInfo = ()=> import('./../components/BagInfo.vue');
const H2H = ()=> import('./../components/H2H.vue');
const D2D = ()=> import('./../components/D2D.vue');
const BagStatus = ()=> import('./../components/BagStatus.vue');
const StationView = ()=> import('./../components/StationView.vue');
const Rules = ()=> import('../components/RulesComponent.vue');
const Equipments = ()=> import('../components/EquipmentsComponent.vue');
const TaxiTimes = ()=> import('./../components/TaxiTimes.vue');
const Registrations = ()=> import('../components/RegistrationsComponent.vue');
const ULD = ()=> import('./../components/ULD.vue');
const BagTimes = ()=> import('./../components/BagTimes.vue');
const SecTimes = ()=> import('./../components/SecTimes.vue');
const Stand2Gate = ()=> import('../components/Stand2Gate.vue');
const FlightRefresh = ()=> import('../components/FlightRefresh.vue');
const StationList = ()=> import('../components/StationsComponent.vue');
const Hubs = ()=> import('../components/HubsComponent.vue');
const Login = ()=> import('../components/LoginComponent.vue');
const AlarmIstic = ()=> import('../components/AlarmIstic.vue');
const StandardMessages = ()=> import('../components/StandardMessages.vue');
const Messages = ()=> import('../components/MessagesComponent.vue');
const OuterStationView = ()=> import('../components/OuterStationView.vue');
const OperationsKPI = ()=> import('../components/OperationsKPI.vue');

import authGuard from "../services/authGuard";
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            name: 'home',
            path: '/',
            component: Home,
            beforeEnter: authGuard,
        },
        {
            name: 'login',
            path: '/login',
            component: Login,
        },
        {
            name: 'controlview',
            path: '/controlview',
            component: ControlView,
            beforeEnter: authGuard,
        },
        {
            name: 'departures',
            path: '/departures',
            component: Departures,
            beforeEnter: authGuard,
        },
        {
            name: 'bagsflight',
            path: '/bagsflight/:flightId',
            component: Bags,
            beforeEnter: authGuard,
        },
        {
            name: 'baginfo',
            path: '/baginfo/:bagnr',
            component: BagInfo,
            beforeEnter: authGuard,
        },
        {
            name: 'h2h_flight',
            path: '/h2h/:flightId',
            component: H2H,
            beforeEnter: authGuard,
        },
        {
            name: 'h2h',
            path: '/h2h/',
            component: H2H,
            beforeEnter: authGuard,
        },
        {
            name: 'd2d_flight',
            path: '/d2d/:flightId',
            component: D2D,
            beforeEnter: authGuard,
        },
        {
            name: 'd2d',
            path: '/d2d/',
            component: D2D,
            beforeEnter: authGuard,
        },
        {
            name: 'bagstatus',
            path: '/bagstatus/',
            component: BagStatus,
            beforeEnter: authGuard,
        },
        {
            name: 'stationview',
            path: '/stationview/',
            component: StationView,
            beforeEnter: authGuard,
        }, 
        {
            name: 'rules',
            path: '/rules/',
            component: Rules,
            beforeEnter: authGuard,
        },
        {
            name: 'equipments',
            path: '/equipmenttypes/',
            component: Equipments,
            beforeEnter: authGuard,
        },
        {
            name: 'taxitimes',
            path: '/taxitimes/',
            component: TaxiTimes,
            beforeEnter: authGuard,
        },
        {
            name: 'registrations',
            path: '/registrations/',
            component: Registrations,
            beforeEnter: authGuard,
        },
        {
            name: 'refuld',
            path: '/refuld/',
            component: ULD,
            beforeEnter: authGuard,
        },
        {
            name: 'bagtimereference',
            path: '/bagtimereference/',
            component: BagTimes,
            beforeEnter: authGuard,
        },
        {
            name: 'ptmrefsectimes',
            path: '/ptmrefsectimes/',
            component: SecTimes,
            beforeEnter: authGuard,
        },
        {
            name: 'bagrefsecgate',
            path: '/bagrefsecgate/',
            component: Stand2Gate,
            beforeEnter: authGuard,
        }, 
        {
            name: 'refreshflight',
            path: '/refreshflight/',
            component: FlightRefresh,
            beforeEnter: authGuard,
        },
        {
            name: 'stations',
            path: '/stations/',
            component: StationList,
            beforeEnter: authGuard,
        },
        {
            name: 'outerstations',
            path: '/outerstations/',
            component: OuterStationView,
            beforeEnter: authGuard,
        },
        {
            name: 'hubs',
            path: '/hubs/',
            component: Hubs,
            beforeEnter: authGuard,
        },
        {
            name: 'standard',
            path: '/standard/',
            component: StandardMessages,
            beforeEnter: authGuard,
        },
        {
            name: 'messages',
            path: '/messages/:flightId',
            component: Messages,
            beforeEnter: authGuard,
        },
        {
            name: 'alarmistic',
            path: '/alarmistic/',
            component: AlarmIstic,
            beforeEnter: authGuard,
        },
        {
            name: 'operationskpi',
            path: '/operationskpi/',
            component: OperationsKPI,
            beforeEnter: authGuard,
        },  
        {
            path: '/(.*)',
            page: '404.html',
        },
    ]
});

export default router