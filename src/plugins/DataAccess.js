import { APIService } from '../plugins/HubTMAPI';

export class DataAccess {
    apiService = null;
    msalInstance = null;

    constructor(msalInstance) {
        this.msalInstance = msalInstance;
        this.apiService = new APIService();
    }

    
    getToken = async () => {
        return await this.apiService.getAccessTokenRevalidated(this.msalInstance);
    }

    getCurrentTime = async () => {
        return await this.apiService.getCurrentTime();
    }    

    getUserInfo = async () => {
        if (this.msalInstance.getAllAccounts() == 0) {
            await this.msalInstance.getAllAccounts();
        }
        let user = null;
        if (this.msalInstance.getAllAccounts().length > 0) {
            user = {
                ...this.msalInstance.getAllAccounts()[0],
                profile: {}
            }
        }
        return Promise.resolve(user);
    }

    getHubList = async (id) => {
        return this.apiService.getHubList(id, this.msalInstance);
    }

    getListHubs = async (id) => {
        return this.apiService.getListHubs(id, this.msalInstance);
    }

    getAccount = async (id) => {
        return this.apiService.getAccount(id, this.msalInstance);
    }

    getOperationStatus = async (id, hub, history) => {
        return this.apiService.getOperationStatus(id, hub, history, this.msalInstance);
    }

    getFlightStatus = async (id, hub) => {
        return this.apiService.getFlightStatus(id, hub, this.msalInstance);
    }

    getFlightStatusHist = async (id, flt_id) => {
        return this.apiService.getFlightStatusHist(id, flt_id, this.msalInstance);
    }

    getViewInOut = async (id, hub) => {
        return this.apiService.getViewInOut(id, hub, this.msalInstance);
    }

    getControlViewIn = async (id, hub) => {
        return this.apiService.getControlViewIn(id, hub, this.msalInstance);
    }

    getControlViewOut = async (id, hub) => {
        return this.apiService.getControlViewOut(id, hub, this.msalInstance);
    }

    getRules = async (id, hub) => {
        return this.apiService.getRules(id, hub, this.msalInstance);
    }

    getDepartures = async (id, hub) => {
        return this.apiService.getDepartures(id, hub, this.msalInstance);
    }

    getBags = async (id, flightid) => {
        return this.apiService.getBags(id, flightid, this.msalInstance);
    }

    getFlight = async (id, flightid) => {
        return this.apiService.getFlight(id, flightid, this.msalInstance);
    }

    getBagInfo = async (id, bagnr) => {
        return this.apiService.getBagInfo(id, bagnr, this.msalInstance);
    }

    getH2H = async (id, hub, flightid) => {
        return this.apiService.getH2H(id, hub, flightid, this.msalInstance);
    }

    getD2D = async (id, hub, flightid) => {
        return this.apiService.getD2D(id, hub, flightid, this.msalInstance);
    }

    getBagStatus = async (id, flightnbr, flightdate, seatnbr, hub) => {
        return this.apiService.getBagStatus(id, flightnbr, flightdate, seatnbr, hub, this.msalInstance);
    }

    getStations = async (id) => {
        return this.apiService.getStations(id, this.msalInstance);
    }

    getStandTypes = async (id) => {
        return this.apiService.getStandTypes(id, this.msalInstance);
    }

    getRules = async (id) => {
        return this.apiService.getRules(id, this.msalInstance);
    }

    setRule = async (id, rule) => {
        return this.apiService.setRule(id, rule, this.msalInstance);
    }

    deleteRule = async (id, pk) => {
        return this.apiService.deleteRule(id, pk, this.msalInstance);
    }

    getEquipments = async (id) => {
        return this.apiService.getEquipments(id, this.msalInstance);
    }

    setEquipment = async (id, equipment) => {
        return this.apiService.setEquipment(id, equipment, this.msalInstance);
    }

    deleteEquipment = async (id, pk) => {
        return this.apiService.deleteEquipment(id, pk, this.msalInstance);
    }

    getTaxiTimes = async (id) => {
        return this.apiService.getTaxiTimes(id, this.msalInstance);
    }

    setTaxiTime = async (id, times) => {
        return this.apiService.setTaxiTime(id, times, this.msalInstance);
    }

    deleteTaxiTime = async (id, pk) => {
        return this.apiService.deleteTaxiTime(id, pk, this.msalInstance);
    }

    getRegistrations = async (id) => {
        return this.apiService.getRegistrations(id, this.msalInstance);
    }

    setRegistration = async (id, times) => {
        return this.apiService.setRegistration(id, times, this.msalInstance);
    }

    deleteRegistration = async (id, pk) => {
        return this.apiService.deleteRegistration(id, pk, this.msalInstance);
    }

    getULD = async (id) => {
        return this.apiService.getULD(id, this.msalInstance);
    }

    setULD = async (id, uld) => {
        return this.apiService.setULD(id, uld, this.msalInstance);
    }

    deleteULD = async (id, pk) => {
        return this.apiService.deleteULD(id, pk, this.msalInstance);
    }

    getBagTimes = async (id) => {
        return this.apiService.getBagTimes(id, this.msalInstance);
    }

    setBagTimes = async (id, bag) => {
        return this.apiService.setBagTimes(id, bag, this.msalInstance);
    }

    deleteBagTimes = async (id, pk) => {
        return this.apiService.deleteBagTimes(id, pk, this.msalInstance);
    }

    getSecTimes = async (id) => {
        return this.apiService.getSecTimes(id, this.msalInstance);
    }

    setSecTimes = async (id, sec) => {
        return this.apiService.setSecTimes(id, sec, this.msalInstance);
    }

    deleteSecTimes = async (id, pk) => {
        return this.apiService.deleteSecTimes(id, pk, this.msalInstance);
    }

    getStand2Gates = async (id) => {
        return this.apiService.getStand2Gates(id, this.msalInstance);
    }

    setStand2Gates = async (id, s2g) => {
        return this.apiService.setStand2Gates(id, s2g, this.msalInstance);
    }

    deleteStand2Gates = async (id, pk) => {
        return this.apiService.deleteStand2Gates(id, pk, this.msalInstance);
    }

    getStations = async (id) => {
        return this.apiService.getStations(id, this.msalInstance);
    }

    setStation = async (id, s2g) => {
        return this.apiService.setStation(id, s2g, this.msalInstance);
    }

    deleteStation= async (id, pk) => {
        return this.apiService.deleteStation(id, pk, this.msalInstance);
    }

    refreshFlight = async (id, flightnbr, flightdate) => {
        return this.apiService.refreshFlight(id, flightnbr, flightdate, this.msalInstance);
    }

    getTimeZones = async (id) => {
        return this.apiService.getTimeZones(id, this.msalInstance);
    }

    getAlarmistic = async (id) => {
        return this.apiService.getAlarmistic(id, this.msalInstance);
    }

    cleandb = async (id) => {
        return this.apiService.cleandb(id, this.msalInstance);
    }

    getStandardMessages = async (id) => {
        return this.apiService.getStandardMessages(id, this.msalInstance);
    }

    setStandardMessage = async (id, message) => {
        return this.apiService.setStandardMessage(id, message, this.msalInstance);
    }

    deleteStandardMessage = async (id, pk) => {
        return this.apiService.deleteStandardMessage(id, pk, this.msalInstance);
    }

    getMessages = async (id, flightid) => {
        return this.apiService.getMessages(id, flightid, this.msalInstance);
    }

    setMessage = async (id, message) => {
        return this.apiService.setMessage(id, message, this.msalInstance);
    }

    deleteMessage = async (id, pk) => {
        return this.apiService.deleteMessage(id, pk, this.msalInstance);
    }

    getActiveMessages = async (id, flightidsList, registrationsList, station) => {
        return this.apiService.getActiveMessages(id, flightidsList, registrationsList, station, this.msalInstance);
    }

    getPriorityFlights = async (id, station) => {
        return this.apiService.getPriorityFlights(id, station, this.msalInstance);
    }
    
    changePriority = async (id, flightid) => {
        return this.apiService.changePriority(id, flightid, this.msalInstance);
    }
    
    getOperationHoursStatus = async (id, hub, history) => {
        return this.apiService.getOperationHoursStatus(id, hub, history, this.msalInstance);
    }
    
    getOuterStations = async (id, stations) => {
        return this.apiService.getOuterStations(id, stations, this.msalInstance);
    }
    
    getDelays = async (id, hub, history) => {
        return this.apiService.getDelays(id, hub, history, this.msalInstance);
    }
    
    getFlightCancel = async (id, history) => {
        return this.apiService.getFlightCancel(id, history, this.msalInstance);
    }
    
    getAOG = async (id, history) => {
        return this.apiService.getAOG(id, history, this.msalInstance);
    }
    
    getGFSLA = async (id, history) => {
        return this.apiService.getGFSLA(id, history, this.msalInstance);
    }
    
    getDayPaxTransf = async (id, history) => {
        return this.apiService.getDayPaxTransf(id, history, this.msalInstance);
    }
    
    getDayDelays = async (id) => {
        return this.apiService.getDayDelays(id, this.msalInstance);
    }
    
    getTurnaroundRules = async (id) => {
        return this.apiService.getTurnaroundRules(id, this.msalInstance);
    }
    
    getStationManagerContacts = async (id, station) => {
        return this.apiService.getStationManagerContacts(id, this.msalInstance, station);
    }
    
    getOperationOthers = async (id, history) => {
        return this.apiService.getOperationOthers(id, history, this.msalInstance);
    }
}
