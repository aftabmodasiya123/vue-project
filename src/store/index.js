import Vuex from 'vuex'
import { msalInstance } from "vue-msal-browser"
import VuexPersistence from 'vuex-persist'

const hubtm = {
    state: {
        hub: 'LIS',
        timezone: 'Europe/Lisbon',
        station: 'LIS',
        outerstations: '',
        isAuthenticated: false,
        darkMode: true,
    },
    getters: {
        hub(state) {
            return state.hub;
        },
        timezone(state) {
            return state.timezone;
        },
        station(state) {
            return state.station;
        },
        outerstations(state) {
            return state.outerstations.split(',');
        },
        isAuthenticated(state) {
            return state.isAuthenticated;
        },
        darkMode(state) {
            return state.darkMode;
        }
    },
    mutations: {
        set_hub(state, hub) {
            localStorage.setItem("hub", hub);
            state.hub = hub;
        },
        set_timezone(state, timezone) {
            localStorage.setItem("timezone", timezone);
            state.timezone = timezone;
        },
        set_station(state, station) {
            localStorage.setItem("station", station);
            state.station = station;
        },
        set_authenticate(state) {
            state.isAuthenticated = true;
            localStorage.setItem("isAuthenticated", true);
        },
        set_outerstations(state, outerstations) {
            localStorage.setItem("outerstations", outerstations);
            state.outerstations = outerstations;
        },
        clear_authenticate(state) {
            state.isAuthenticated = false;
            localStorage.setItem("isAuthenticated", false);
        },
        set_mode(state, mode) {
            state.darkMode = mode;
            localStorage.setItem("darkMode", mode);
        },
        setInitialState(state) {
            state.hub = localStorage.getItem("hub") || 'LIS';
            state.timezone = localStorage.getItem("timezone") || 'Europe/Lisbon';
            state.station = localStorage.getItem("station") || 'LIS';
            state.outerstations = localStorage.getItem("outerstations") || '';
            state.isAuthenticated = (localStorage.getItem("isAuthenticated") === 'true') ? true : false;
            state.darkMode = (localStorage.getItem("darkMode") === 'true') ? true : false;
        },
    },
};

const azure = {
    // Authenticate the user with Active Directory
    async AzureAuthentication({ getters, dispatch }) {
        try {
            let existingTokenResponse = getters.mainTokenResponse;
            let newTokenResponse;

            // The user has already logged in. We try to get his token silently
            if (existingTokenResponse)
                newTokenResponse = await msalInstance.acquireTokenSilent({
                    account: existingTokenResponse.account,
                    scopes: msalInstance.extendedConfiguration.auth.scopes,
                });
            // The user has not logged in. We check if he comes back from a redirect with a token
            else newTokenResponse = await msalInstance.handleRedirectPromise();

            // No token found, we redirect the user
            if (!newTokenResponse) {
                await msalInstance.loginRedirect(msalInstance.loginRequest);
                return false;
            }
            // There is an existing token, we authentify the user
            else if (newTokenResponse) {
                // We add the access token as an authorization header for our Axios requests to our API
                this._vm.axios.defaults.headers.common["Authorization"] =
                    "Bearer " + newTokenResponse.accessToken;
                if (msalInstance.extendedConfiguration.graph) {
                    // The graph is set, we check if the user has already a picture in the local storage
                    // if he does not we grab a token silently for our graph scope and call Microsoft graph to get the picture
                    if (!localStorage.getItem("userPicture")) {
                        let graphTokenResponse = await msalInstance.getSilentToken(
                            newTokenResponse.account,
                            msalInstance.extendedConfiguration.graph.scopes
                        );
                        let graphResponse = await msalInstance.callMSGraph(
                            msalInstance.extendedConfiguration.graph.url,
                            graphTokenResponse.accessToken
                        );
                        dispatch("AzureSetPicture", graphResponse);
                    }
                }
                return true;
            }
        } catch (error) {
            console.error(error);
        }
    },
};

const home = {
    state: {
        showNetwork: true,
        showHub: true,
        showDelay: true,
    },
    mutations:{
        set_network_vCard(state, show) {
            state.showNetwork = show;
        },
        set_hub_vCard(state, show) {
            state.showHub = show;
        },
        set_delay_vCard(state, show) {
            state.showDelay = show;
        },
    }
}

const vuexLocal = new VuexPersistence({
    key: 'hubtm',
    storage: window.localStorage,
    reducer: state => ({home:state.home})
});

const store = new Vuex.Store({
    modules: {
        app: hubtm,
        azure: azure,
        home
    },
    plugins: [vuexLocal.plugin]
});

export default store;