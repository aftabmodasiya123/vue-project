import axios from 'axios';

export class APIService {
    API_URL = process.env.VUE_APP_HUB_API_URL + '/hubtm/api/';

    getAccessTokenRevalidated = async (msalInstance) => {
        if (msalInstance.getAllAccounts().length == 0 && msalInstance.getAllAccounts()[0] == undefined) {
            await msalInstance.getAllAccounts();
            return;
        }
        var silentRequest = {
            scopes: ['user.read', 'api://' + process.env.VUE_APP_HUB_CLIENT_ID + '/HubTMAPI'],
            account: msalInstance.getAllAccounts()[0],
            forceRefresh: true
        };
        var request = {
            scopes: ['user.read', 'api://' + process.env.VUE_APP_HUB_CLIENT_ID + '/HubTMAPI'],
            loginHint: msalInstance.getAllAccounts()[0].username // For v1 endpoints, use upn from idToken claims
        };
        let token = '';
        await msalInstance.acquireTokenSilent(silentRequest)
            .then(response => {
                token = response.idToken;
            })
            .catch(err => {
                if (err.name === "BrowserAuthError") {
                    window.location.href = "/login"   
                }
                // could also check if err instance of InteractionRequiredAuthError if you can import the class.
                if (err.name === "InteractionRequiredAuthError") {
                    msalInstance.acquireTokenRedirect(request)
                        .then(response => {
                            token = response.idToken;
                        })
                        .catch(() => {
                            return '***AUTHENTICATE***';
                        });
                }
            });
        return token;
    }

    getCurrentTime = async() => {
        try {
            let response = await axios.get('http://worldtimeapi.org/api/ip');
            return new Date(response.data.utc_datetime);
        } catch (error) {
            return new Date();
        }
    }

    call = async (url, data, msalInstance) => {
        let token = await this.getAccessTokenRevalidated(msalInstance);

        data['email'] = msalInstance.getAllAccounts()[0].username;
        if (token != '') {
            let instance = axios.create({
                baseURL: this.API_URL,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            return instance.post(url, JSON.stringify(data));
        }
        else {
            return {'data': []}
        }
    }

    getHubList = async (id, msalInstance) => {
        const url = 'hub';
        let data = {
            'apiid': 1,
            'callId': id
        };
        return this.call(url, data, msalInstance);
    }


    getListHubs = async (id, msalInstance) => {
        const url = 'listhubs';
        let data = {
            'apiid': 1,
            'callId': id
        };
        return this.call(url, data, msalInstance);
    }

    getAccount = async (id, msalInstance) => {
        const url = 'accountview';
        let data = {
            'apiid': 2,
            'callId': id
        };
        return this.call(url, data, msalInstance);
    }

    getOperationStatus = async (id, hub, history, msalInstance) => {
        const url = 'operationstatus';
        let data = {
            'apiid': 3,
            'callId': id,
            'hub': hub,
            'history':history
        };
        return this.call(url, data, msalInstance);
    }

    getFlightStatus = async (id, hub, msalInstance) => {
        const url = 'flightstatus';
        let data = {
            'apiid': 4,
            'callId': id,
            'hub': hub
        };
        return this.call(url, data, msalInstance);
    }

    getFlightStatusHist = async (id, flt_id, msalInstance) => {
        const url = 'fltstatushist';
        let data = {
            'apiid': 5,
            'callId': id,
            'id': flt_id
        };
        return this.call(url, data, msalInstance);
    }

    getViewInOut = async (id, hub, msalInstance) => {
        const url = 'viewio';
        let data = {
            'apiid': 6,
            'callId': id,
            'hub': hub
        };
        return await this.call(url, data, msalInstance);
    }

    getControlViewIn = async (id, hub, msalInstance) => {
        const url = 'viewin';
        let data = {
            'apiid': 7,
            'callId': id,
            'hub': hub
        };
        return await this.call(url, data, msalInstance);
    }

    getControlViewOut = async (id, hub, msalInstance) => {
        const url = 'viewout';
        let data = {
            'apiid': 8,
            'callId': id,
            'hub': hub
        };
        return await this.call(url, data, msalInstance);
    }

    getRules = async (id, hub, msalInstance) => {
        const url = 'rulesview';
        let data = {
            'apiid': 9,
            'callId': id,
            'hub': hub
        };
        return await this.call(url, data, msalInstance);
    }

    getDepartures = async (id, hub, msalInstance) => {
        const url = 'departures';
        let data = {
            'apiid': 10,
            'callId': id,
            'hub': hub
        };
        return await this.call(url, data, msalInstance);
    }

    getBags = async (id, flightid, msalInstance) => {
        const url = 'bags';
        let data = {
            'apiid': 11,
            'callId': id,
            'flightid': flightid
        };
        return await this.call(url, data, msalInstance);
    }

    getFlight = async (id, flightid, msalInstance) => {
        const url = 'flt';
        let data = {
            'apiid': 12,
            'callId': id,
            'flightid': flightid
        };
        return await this.call(url, data, msalInstance);
    }

    getBagInfo = async (id, bagnr, msalInstance) => {
        const url = 'baginfo';
        let data = {
            'apiid': 13,
            'callId': id,
            'bagnr': bagnr
        };
        return await this.call(url, data, msalInstance);
    }

    getH2H = async (id, hub, flightid, msalInstance) => {
        const url = 'baghulltohull';
        let data = {
            'apiid': 14,
            'callId': id,
            'hub': hub,
            'flightid': flightid
        };
        return await this.call(url, data, msalInstance);
    }

    getD2D = async (id, hub, flightid, msalInstance) => {
        const url = 'paxtransfer';
        let data = {
            'apiid': 15,
            'callId': id,
            'hub': hub,
            'flightid': flightid
        };
        return await this.call(url, data, msalInstance);
    }

    getBagStatus = async (id, flightnbr, flightdate, seatnbr, hub, msalInstance) => {
        const url = 'bagstatus';
        let data = {
            'apiid': 16,
            'callId': id,
            'flightnbr': flightnbr,
            'flightdate': flightdate,
            'seatnbr': seatnbr,
            'hub': hub
        };
        return await this.call(url, data, msalInstance);
    }

    getStations = async (id, msalInstance) => {
        const url = 'stations';
        let data = {
            'apiid': 17,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    getStandTypes = async (id, msalInstance) => {
        const url = 'standtypesview';
        let data = {
            'apiid': 18,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    getRules = async (id, msalInstance) => {
        const url = 'rulesview';
        let data = {
            'apiid': 18,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    setRule = async (id, item, msalInstance) => {
        const url = 'rulesupdate';
        let data = {
            'apiid': 19,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }


    deleteRule = async (id, pk, msalInstance) => {
        const url = 'rulesdelete';
        let data = {
            'apiid': 20,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getEquipments = async (id, msalInstance) => {
        const url = 'equipmentsview';
        let data = {
            'apiid': 21,
            'callId': id,
        };
        return await this.call(url, data, msalInstance);
    }

    setEquipment = async (id, item, msalInstance) => {
        const url = 'equipmentsupdate';
        let data = {
            'apiid': 22,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteEquipment = async (id, pk, msalInstance) => {
        const url = 'equipmentsdelete';
        let data = {
            'apiid': 23,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getTaxiTimes = async (id, msalInstance) => {
        const url = 'taxitimesview';
        let data = {
            'apiid': 24,
            'callId': id,
        };
        return await this.call(url, data, msalInstance);
    }

    setTaxiTime = async (id, item, msalInstance) => {
        const url = 'taxitimesupdate';
        let data = {
            'apiid': 25,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteTaxiTime = async (id, pk, msalInstance) => {
        const url = 'taxitimesdelete';
        let data = {
            'apiid': 26,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getRegistrations = async (id, msalInstance) => {
        const url = 'registrationsview';
        let data = {
            'apiid': 27,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    setRegistration = async (id, item, msalInstance) => {
        const url = 'registrationupdate';
        let data = {
            'apiid': 28,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteRegistration = async (id, pk, msalInstance) => {
        const url = 'registrationdelete';
        let data = {
            'apiid': 29,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getULD = async (id, msalInstance) => {
        const url = 'uldsview';
        let data = {
            'apiid': 30,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    setULD = async (id, item, msalInstance) => {
        const url = 'uldupdate';
        let data = {
            'apiid': 31,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteULD = async (id, pk, msalInstance) => {
        const url = 'ulddelete';
        let data = {
            'apiid': 32,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getBagTimes = async (id, msalInstance) => {
        const url = 'refbagtimesview';
        let data = {
            'apiid': 33,
            'callId': id,
        };
        return await this.call(url, data, msalInstance);
    }

    setBagTimes = async (id, item, msalInstance) => {
        const url = 'refbagtimesupdate';
        let data = {
            'apiid': 34,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteBagTimes = async (id, pk, msalInstance) => {
        const url = 'refbagtimesdelete';
        let data = {
            'apiid': 35,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getSecTimes = async (id, msalInstance) => {
        const url = 'refsecuritytimesview';
        let data = {
            'apiid': 36,
            'callId': id,
        };
        return await this.call(url, data, msalInstance);
    }

    setSecTimes = async (id, item, msalInstance) => {
        const url = 'refsecuritytimesupdate';
        let data = {
            'apiid': 37,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteSecTimes = async (id, pk, msalInstance) => {
        const url = 'refsecuritytimesdelete';
        let data = {
            'apiid': 38,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getStand2Gates = async (id, msalInstance) => {
        const url = 'refstandtogateview';
        let data = {
            'apiid': 39,
            'callId': id,
        };
        return await this.call(url, data, msalInstance);
    }

    setStand2Gates = async (id, item, msalInstance) => {
        const url = 'refstandtogateupdate';
        let data = {
            'apiid': 40,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteStand2Gates = async (id, pk, msalInstance) => {
        const url = 'refstandtogatedelete';
        let data = {
            'apiid': 41,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getStations = async (id, msalInstance) => {
        const url = 'stationsview';
        let data = {
            'apiid': 42,
            'callId': id,
        };
        return await this.call(url, data, msalInstance);
    }

    setStation = async (id, item, msalInstance) => {
        const url = 'stationupdate';
        let data = {
            'apiid': 43,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteStation = async (id, pk, msalInstance) => {
        const url = 'stationdelete';
        let data = {
            'apiid': 44,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    refreshFlight = async (id, flightnbr, flightdate, msalInstance) => {
        const url = 'processflight';
        let data = {
            'apiid': 45,
            'callId': id,
            'flightnbr': flightnbr,
            'flightdate': flightdate
        };
        return await this.call(url, data, msalInstance);
    }

    getTimeZones = async (id, msalInstance) => {
        const url = 'timezones';
        let data = {
            'apiid': 46,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    getAlarmistic = async (id, msalInstance) => {
        const url = 'alarmistic';
        let data = {
            'apiid': 46,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    cleandb = async (id, msalInstance) => {
        const url = 'cleandb';
        let data = {
            'apiid': 47,
            'callId': id
        };
        return await this.call(url, data, msalInstance);
    }

    getStandardMessages = async (id, msalInstance) => {
        const url = 'standardmessagesview';
        let data = {
            'apiid': 48,
            'callId': id,
        };
        return await this.call(url, data, msalInstance);
    }

    setStandardMessage = async (id, item, msalInstance) => {
        const url = 'standardmessagesupdate';
        let data = {
            'apiid': 49,
            'callId': id,
            'pk': item.pk,
            'fields': item.fields
        };
        return await this.call(url, data, msalInstance);
    }

    deleteStandardMessage = async (id, pk, msalInstance) => {
        const url = 'standardmessagesdelete';
        let data = {
            'apiid': 50,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getMessages = async (id, flightid, msalInstance) => {
        const url = 'messagesview';
        let data = {
            'apiid': 51,
            'callId': id,
        };
        if (flightid != undefined && flightid != null) {
            data['id'] = flightid;
        }
        return await this.call(url, data, msalInstance);
    }

    setMessage = async (id, item, msalInstance) => {
        const url = 'messagesupdate';
        let data = {
            'apiid': 52,
            'callId': id,
            'pk': item.pk,
            'fields': {}
        };
        if (item.fields.fltinfoid != -1 ) {
            data['fields']['fltinfoid'] = item.fields.fltinfoid;
        }
        if (item.fields.text != '') {
            data['fields']['text'] = item.fields.text;
        }
        if (item.fields.from_iata != '') {
            data['fields']['from_iata'] = item.fields.from_iata;
        }
        if (item.fields.to_iata != '') {
            data['fields']['to_iata'] = item.fields.to_iata;
        }
        if (item.fields.ac_registration != '') {
            data['fields']['ac_registration'] = item.fields.ac_registration;
        }
        if (item.fields.start_date != '') {
            data['fields']['start_date'] = item.fields.start_date;
        }
        if (item.fields.end_date != '') {
            data['fields']['end_date'] = item.fields.end_date;
        }
        if (item.fields.is_active != '') {
            data['fields']['is_active'] = item.fields.is_active;
        }
        return await this.call(url, data, msalInstance);
    }

    deleteMessage = async (id, pk, msalInstance) => {
        const url = 'messagesdelete';
        let data = {
            'apiid': 53,
            'callId': id,
            'pk': pk
        };
        return await this.call(url, data, msalInstance);
    }

    getActiveMessages = async (id, flightidsList, registrationsList, station, msalInstance) => {
        const url = 'activemessagesview';
        let data = {
            'apiid': 51,
            'callId': id,
            'flightids': flightidsList,
            'registrations': registrationsList,
            'station': station
        };
        
        return await this.call(url, data, msalInstance);
    }

    getPriorityFlights = async (id, hub, msalInstance) => {
        const url = 'flightprio';
        let data = {
            'apiid': 52,
            'callId': id,
            'hub': hub
        };
        return this.call(url, data, msalInstance);
    }
    
    changePriority = async (id, flightid, msalInstance) => {
        const url = 'changeprio';
        let data = {
            'apiid': 53,
            'callId': id,
            'id': flightid
        };
        return this.call(url, data, msalInstance);
    }
    
    getOperationHoursStatus = async (id, hub, history, msalInstance) => {
        const url = 'operationhourstatus';
        let data = {
            'apiid': 54,
            'callId': id,
            'hub': hub,
            'history': history
        };
        return this.call(url, data, msalInstance);
    }
    
    getOuterStations = async (id, stations, msalInstance) => {
        const url = 'outerstations';
        let data = {
            'apiid': 55,
            'callId': id,
            'stations': stations
        };
        return this.call(url, data, msalInstance);
    }
    
    getDelays = async (id, hub, history, msalInstance) => {
        const url = 'delays';
        let data = {
            'apiid': 56,
            'callId': id,
            'hub': hub,
            'history': history
        };
        return this.call(url, data, msalInstance);
    }
    
    getFlightCancel = async (id, history, msalInstance) => {
        const url = 'flightcancel';
        let data = {
            'apiid': 57,
            'callId': id,
            'history': history
        };
        return this.call(url, data, msalInstance);
    }
    
    getAOG = async (id, history, msalInstance) => {
        const url = 'aog';
        let data = {
            'apiid': 58,
            'callId': id,
            'history':history
        };
        return this.call(url, data, msalInstance);
    }
    
    getGFSLA = async (id, history, msalInstance) => {
        const url = 'gfsla';
        let data = {
            'apiid': 59,
            'callId': id,
            'history': history
        };
        return this.call(url, data, msalInstance);
    }
    
    getDayPaxTransf = async (id, history, msalInstance) => {
        const url = 'daypaxtransf';
        let data = {
            'apiid': 60,
            'callId': id,
            'history': history
        };
        return this.call(url, data, msalInstance);
    }
 
    getDayDelays = async (id, msalInstance) => {
        const url = 'daydelays';
        let data = {
            'apiid': 61,
            'callId': id,
        };
        return this.call(url, data, msalInstance);
    }
 
    getTurnaroundRules = async (id, msalInstance) => {
        const url = 'turnaroundrulesview';
        let data = {
            'apiid': 62,
            'callId': id,
        };
        return this.call(url, data, msalInstance);
    }
 
    getStationManagerContacts = async (id, msalInstance, station) => {
        const url = 'stationmanager';
        let data = {
            'apiid': 63,
            'callId': id,
            'hub': station
        };
        return this.call(url, data, msalInstance);
    }
 
    getOperationOthers = async (id, history, msalInstance) => {
        const url = 'operationothers';
        let data = {
            'apiid': 64,
            'callId': id,
            'history': history
        };
        return this.call(url, data, msalInstance);
    }
}
