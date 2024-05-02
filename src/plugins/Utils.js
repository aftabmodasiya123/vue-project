export class Utils {
    // DateNull
    dateNull = null;

    tokenResponse = "";

    turnaroundLimits = {
        'PDL': [35, 40],
        'TER': [35, 40]
    }

    green = 'green darken-2';
    yellow = 'amber';
    red = 'deep-orange darken-4';
    purple = 'deep-purple darken-1';
    white = 'white';
    black = 'grey darken-4';
    grey = 'blue-grey lighten-4';
    grey2 = 'grey darken-2';
    priority = 'grey darken-3';
    no_priority = 'grey lighten-4';
    green_icon = 'mdi-panorama-fisheye';
    yellow_icon = 'mdi-circle';
    red_icon = 'mdi-circle';
    purple_icon = 'mdi-circle';
    black_icon = 'mdi-circle';
    grey_icon = 'mdi-panorama-fisheye';
    grey2_icon = 'mdi-circle';
    white_icon = '';
    priority_icon = 'mdi-pandora';

    dow = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
        'Sunday': 7,
    };

    listdow = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    formatDate(dt) {
        let date = new Date(dt);
        if (date.getFullYear() < 2000) return '';
        const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return ('0' + date.getDate()).slice(-2) + month[date.getMonth()];
    }

    formatHours(dt) {
        let date = new Date(dt);
        if (date.getFullYear() < 2000) return '';
        return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }

    formatDayHours(dt) {
        let date = new Date(dt);
        if (date.getFullYear() < 2000) return '';
        let currentdate = new Date();
        if (date.getDate() != currentdate.getDate()) return ('0' + date.getDate()).slice(-2) + '/' + this.formatHours(dt);
        return this.formatHours(dt);
    }

    formatYearMonthDay(dt) {
        let date = new Date(dt);
        if (date.getFullYear() < 2000) return '';
        return ('000' + date.getFullYear()).slice(-4) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
    }

    formatDoW(dow) {
        if (dow === undefined) return "";
        return dow.trim();
    }

    getDoWDescription(dow) {
        var list = [];
        for (var i in this.formatDoW(dow)) {
            list.push(this.listdow[dow[i] - 1]);
        }
        return list
    }

    formatTime(code, timelist) {
        for (var i in timelist) {
            if (timelist[i]['id'] === code) {
                return timelist[i]['fields']['timestart'].slice(0, -3) + '-' +
                    timelist[i]['fields']['timeend'].slice(0, -3);
            }
        }
        return '';
    }

    formatNumber(value) {
        return value.toLocaleString('pt-PT', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    }
    
    formatDecimal(value, maximumFractionDigits) {
        return value.toLocaleString('pt-PT', {
            minimumFractionDigits: 0,
            maximumFractionDigits: maximumFractionDigits,
        });
    }
    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') +
                i.substr(j).replace(/(\d{3})(?=\d)/g, "� 1" + thousands) +
                (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            return '';
        }
    }

    formatFlight(operator, fltnr) {
        return operator + ('0000' + fltnr).slice(-4);
    }

    formatCargo(carga) {
        return parseInt(carga);
    }

    formatBTD(item) {
        if (item.std == null) return '';
        if (item.atd != null) return this.formatDayHours(item.atd) + 'A';
        if (item.etd != null && item.etd != item.std) return this.formatDayHours(item.etd) + 'E';
        return this.formatDayHours(item.std);
    }

    getDoW() {
        return this.dow;
    }

    getAllDoWDescriptions() {
        return this.listdow;
    }

    getDoWCode(listdow) {
        var listcode = [];
        for (var i in listdow) {
            listcode.push(this.dow[listdow[i]]);
        }
        return listcode;
    }

    getStatusColor(ratio) {
        if (ratio >= this.getStatusTarget()) return "#4CAF50";
        if (ratio >= this.getStatusTarget()) return "#FFAB00";
        return "#BF360C";
    }

    getStatusTarget() {
        return 70;
    }
    
    getCompletionColor(ratio) {
        if (ratio > this.getCompletionTarget()) return "#4CAF50";
        if (ratio > this.getCompletionTarget()) return "#FFAB00";
        return "#BF360C";
    }

    getCompletionTarget() {
        return 99.5;
    }
    
    getConnectivityColor(ratio) {
        if (ratio > this.getConnectivityTarget()) return "#4CAF50";
        if (ratio > this.getConnectivityTarget()) return "#FFAB00";
        return "#BF360C";
    }

    getConnectivityTarget() {
        return 97.5;
    }

    diff_minutes(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

    bestDate(st, et, at) {
        let bt = st;
        if (et != null && et != '' && et != this.dateNull) bt = et;
        if (at != null && at != '' && at != this.dateNull) bt = at;
        return bt;
    }

    isInFlight(atd, ata) {
        if (atd != null && atd != '' && atd != this.dateNull && (ata == null || ata == '' || ata == this.dateNull)) return true;
        return false;
    }

    getTurnaroundLimits(hub) {
        let limit = this.turnaroundLimits[hub];
        if (limit === undefined) limit = this.turnaroundLimits['PDL'];
        return limit;
    }

    isBoarding(bagboardts, atd) {
        return ((typeof (bagboardts) != 'undefined' && bagboardts != null && bagboardts != this.dateNull) && (typeof (atd) == 'undefined' || atd == null || atd == this.dateNull));
    }

    isCanceled(status) {
        if (status === 'Canceled' ||
            status === 'Re-scheduled' ||
            status === 'Forced Return (air)' ||
            status === 'Forced Return (ramp)' ||
            status === 'Re-routed' ||
            status === 'Diverted' ||
            status === 'Unknown Status: C'
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    formatLT(sta, eta, ata, std, etd, atd, rules, timezone, tzdep) {
        var lt = this.getLT(sta, eta, ata, rules, timezone);
        if ((typeof (ata) != 'undefined' && ata != null && ata != this.dateNull) || lt != this.green) {
            return lt;
        } else {
            if ((typeof (atd) != 'undefined' && atd != null && atd != this.dateNull) || lt != this.green) {
                return this.green;
            }
            var otp = this.getOTP(std, etd, atd, rules, tzdep);  
            if (otp != this.green && otp != this.grey) {
                return this.grey2;
            }
        }
        return this.green;
    }

    getLT(sta, eta, ata, rules, timezone) {
        var diffMs = 0;
        var diffMins = 0;
        if (typeof (sta) == 'undefined' || sta == null || sta == this.dateNull) {
            return this.grey;
        }
        if (typeof (ata) != 'undefined' && ata != null && ata != this.dateNull) {
            diffMs = (this.convertTZ(ata, timezone) - this.convertTZ(sta, timezone));
            diffMins = Math.round(diffMs / 60000);
            if (diffMins > rules.ltred) return this.red;
            if (diffMins > rules.ltyellow) return this.yellow;
            return this.green;
        } else if (typeof (eta) != 'undefined' && eta != null && eta != this.dateNull) {
            var etaDate = this.convertTZ(eta, timezone);
            if (new Date() > this.convertTZ(eta, timezone)) {
                etaDate = new Date();
            }
            diffMs = (etaDate - this.convertTZ(sta, timezone));
            diffMins = Math.round(diffMs / 60000);
            if (diffMins > rules.ltred) return this.red;
            if (diffMins > rules.ltyellow) return this.yellow;
            return this.green;
        } else {
            diffMs = (new Date() - this.convertTZ(sta, timezone));
            diffMins = Math.round(diffMs / 60000);
            if (diffMins > rules.ltred) return this.red;
            if (diffMins > rules.ltyellow) return this.yellow;
            return this.green;
        }
    }

    formatLTMin(sta, eta, ata, rules, timezone) {
        var sArr;
        var eArr;
        var diffMs;
        var diffMins;
        if (typeof (ata) != 'undefined' && ata != null && ata != this.dateNull) eArr = this.convertTZ(ata, timezone);
        else eArr = new Date();
        if (typeof (sta) != 'undefined' && sta != null && sta != this.dateNull) sArr = this.convertTZ(sta, timezone);
        else return '';
        diffMs = (eArr - sArr);
        diffMins = Math.round(diffMs / 60000);
        if (diffMins > 0) return '' + diffMins;
        return '';
    }

    getLTText(sta, eta, ata, std, etd, atd, rules, timezone, tzdep) {
        var lt = this.getLT(sta, eta, ata, rules, timezone);
        if (lt != this.green) {
            return 'Arrived: ' + this.formatLTMin(sta, eta, ata, rules, timezone);
        } else {
            if (this.getOTP(std, etd, atd, rules, tzdep) != this.green) {
                return 'Departed: ' + this.formatOTPMin(std, etd, atd, rules, tzdep);
            }
            return '';
        }
    }

    formatBagMI(std, etd, atd, bagtotal, bagproc, paxtotal, bagboard, rules) {
        if (typeof (atd) != 'undefined' && atd != null && atd != this.dateNull) {
            return this.isMissingBagProcOrPaxBag(bagtotal, bagtotal, paxtotal, bagboard)
        }
        return this.formatBagM(std, etd, bagtotal, bagtotal, paxtotal, bagboard, rules);
    }

    getBagMIText(std, etd, atd, bagtotal, bagproc, paxtotal, bagboard, rules) {
        if (typeof (atd) != 'undefined' && atd != null && atd != this.dateNull) {
            return this.getMissingBagProcOrPaxBagText(bagtotal, bagtotal, paxtotal, bagboard)
        }
        return this.getBagMText(std, etd, bagtotal, bagtotal, paxtotal, bagboard, rules);
    }

    formatCF(cf, rules) {
        if (cf == null) return this.green;
        if (cf > rules.cfred) return this.red;
        if (cf > rules.cfyellow) return this.yellow;
        return this.green;
    }

    getCFText(cf, rules) {
        if (this.formatCF(cf, rules) == this.green) {
            return 'Ok';
        }
        return -1 * cf;
    }

    isMissingBagProcOrPaxBag(bagtotal, bagproc, paxtotal, bagboard) {
        if ((typeof (bagtotal) == 'undefined' || bagtotal == null)
            || (typeof (bagproc) == 'undefined' || bagproc == null)
            || (typeof (paxtotal) == 'undefined' || paxtotal == null)
            || (typeof (bagboard) == 'undefined' || bagboard == null)) {
            return this.green;
        }
        if (bagtotal - bagproc > 5) return this.red;
        if (bagtotal - bagproc > 0) return this.yellow;
        return this.green;
    }

    getMissingBagProcOrPaxBagText(bagtotal, bagproc, paxtotal, bagboard) {
        if ((typeof (bagtotal) == 'undefined' || bagtotal == null)
            || (typeof (bagproc) == 'undefined' || bagproc == null)
            || (typeof (paxtotal) == 'undefined' || paxtotal == null)
            || (typeof (bagboard) == 'undefined' || bagboard == null)) {
            return 'Ok';
        }
        if (bagtotal - bagproc > 5) return 'Bag Total: ' + bagtotal + ' / Bag Processed:' + bagproc;
        if (bagtotal - bagproc > 0) return 'Bag Total: ' + bagtotal + ' / Bag Processed:' + bagproc;
        return 'Ok';
    }

    formatBagM(std, etd, bagtotal, bagproc, paxtotal, bagboard, rules) {
        var eD;
        var now = Date.now();
        var diffMs;
        var diffMins;
        if (typeof (etd) == 'undefined' || etd == null || etd == this.dateNull) {
            eD = new Date(etd);
        } else if (typeof (std) == 'undefined' || std == null || std == this.dateNull) {
            eD = new Date(std);
        } else {
            return this.green;
        }

        if ((typeof (bagtotal) == 'undefined' || bagtotal == null)
            || (typeof (bagproc) == 'undefined' || bagproc == null)) {
            return this.green;
        }
        if (bagtotal > bagproc) {
            diffMs = (now - eD);
            diffMins = Math.round(diffMs / 60000);
            if (diffMins <= rules.depbagmred) return this.red;
            if (diffMins <= rules.depbagmlimite) return this.yellow;
            return this.green;
        }
        if (paxtotal > bagboard) {
            diffMs = (now - eD);
            diffMins = Math.round(diffMs / 60000);
            if (diffMins <= rules.depbagmred) return this.red;
            if (diffMins <= rules.depbagmlimite) return this.yellow;
            return this.green;
        }
        return this.green;
    }

    getBagMText(std, etd, bagtotal, bagproc, paxtotal, bagboard, rules) {
        var eD;
        var now = Date.now();
        var diffMs;
        var diffMins;
        if (typeof (etd) == 'undefined' || etd == null || etd == this.dateNull) {
            eD = new Date(etd);
        } else if (typeof (std) == 'undefined' || std == null || std == this.dateNull) {
            eD = new Date(std);
        } else {
            return 'Ok';
        }

        if ((typeof (bagtotal) == 'undefined' || bagtotal == null)
            || (typeof (bagproc) == 'undefined' || bagproc == null)) {
            return 'Ok';
        }
        if (bagtotal > bagproc) {
            diffMs = (now - eD);
            diffMins = Math.round(diffMs / 60000);
            if (diffMins <= rules.depbagmred) return 'Bag Total: ' + bagtotal + ' / Bag Processed: ' + bagproc;
            if (diffMins <= rules.depbagmlimite) return 'Bag Total: ' + bagtotal + ' / Bag Processed: ' + bagproc;
            return 'Ok';
        }
        return 'Ok';
    }

    formatBagMO(std, etd, atd, bagtotal, bagproc, paxtotal, bagboard, rules) {
        if (typeof (atd) != 'undefined' && atd != null && atd != this.dateNull) {
            return this.isMissingBagProcOrPaxBag(bagtotal, bagproc, paxtotal, bagboard)
        }
        return this.formatBagM(std, etd, bagtotal, bagproc, paxtotal, bagboard, rules);
    }

    getBagMOText(std, etd, atd, bagtotal, bagproc, paxtotal, bagboard, rules) {
        if (typeof (atd) != 'undefined' && atd != null && atd != this.dateNull) {
            return this.getMissingBagProcOrPaxBagText(bagtotal, bagproc, paxtotal, bagboard)
        }
        return this.getBagMText(std, etd, bagtotal, bagproc, paxtotal, bagboard, rules);
    }

    getPT(pt, rules) {
        if (typeof (pt) == 'undefined' || pt == null) {
            return 100;
        }
        var minutes = pt;
        if (minutes <= rules.ptred) return minutes;
        else if (minutes <= rules.ptyellow) return minutes;
        return 100;
    }

    formatPT(pt, rules) {
        if (typeof (pt) == 'undefined' || pt == null) {
            return this.green;
        }
        var minutes = this.getPT(pt, rules);
        if (minutes <= rules.ptred) return this.red;
        else if (minutes <= rules.ptyellow) return this.yellow;
        return this.green;
    }

    getPTText(pt, rules) {
        if (this.formatPT(pt, rules) == this.green) {
            return 'Ok';
        }
        else {
            return this.getPT(pt, rules) + ' Min';
        }
    }

    getH2H(h2h, rules) {
        var minutes = 0;
        if (typeof (h2h) == 'undefined' || h2h == null) {
            return 100;
        }
        minutes = h2h;
        if (minutes <= rules.h2hred) return minutes;
        if (minutes <= rules.h2hyellow) return minutes;
        return 100;
    }

    formatH2H(h2h, rules) {
        var minutes = 0;
        if (typeof (h2h) == 'undefined' || h2h == null) {
            return this.green;
        }
        minutes = this.getH2H(h2h, rules);
        if (minutes <= rules.h2hred) return this.red;
        if (minutes <= rules.h2hyellow) return this.yellow;
        return this.green;
    }

    getH2HText(h2h, rules) {
        if (this.formatH2H(h2h, rules) == this.green) {
            return 'Ok';
        }
        else {
            return this.getH2H(h2h, rules) + ' Min';
        }
    }

    getARDT(std, etd, ardt) {
        var ardtD;
        var eD;
        var diffMs;
        var diffMins;
        if (typeof (ardt) != 'undefined' && ardt != null && ardt != this.dateNull) {
            ardtD = new Date(ardt);
        } else {
            ardtD = Date.now();
        }
        if (typeof (etd) != 'undefined' && etd != null && etd != this.dateNull) {
            eD = new Date(etd);
        } else if (typeof (std) != 'undefined' && std != null && std != this.dateNull) {
            eD = new Date(std);
        } else {
            return 1000;
        }

        diffMs = (eD - ardtD);
        diffMins = Math.round(diffMs / 60000);
        return diffMins;
    }

    formatARDT(std, etd, atd, ardt, rules) {
        if (typeof (atd) != 'undefined' && atd != null) {
            return this.green;
        }
        var minutes = this.getARDT(std, etd, ardt);
        if (minutes <= rules.ardtred) return this.red;
        if (minutes <= rules.ardtyellow) return this.yellow;
        return this.green;
    }

    getARDTText(std, etd, atd, ardt, rules) {
        if (this.formatARDT(std, etd, atd, ardt, rules) == this.green) {
            return 'Ok';
        }
        else {
            return this.getARDT(std, etd, ardt) + ' Min';
        }
    }

    getTSAT(std, etd, tsat) {
        var tsatD;
        var eD;
        var diffMs;
        var diffMins;
        if (typeof (tsat) != 'undefined' && tsat != null && tsat != this.dateNull) {
            tsatD = new Date(tsat);
        } else {
            tsatD = Date.now();
        }
        if (typeof (etd) != 'undefined' && etd != null && etd != this.dateNull) {
            eD = new Date(etd);
        } else if (typeof (std) != 'undefined' && std != null && std != this.dateNull) {
            eD = new Date(std);
        } else {
            return 1000;
        }

        diffMs = (eD - tsatD);
        diffMins = Math.round(diffMs / 60000);
        return diffMins;
    }

    formatTSAT(std, etd, atd, tsat, rules) {
        if (typeof (atd) != 'undefined' && atd != null) {
            return this.green;
        }
        var minutes = this.getTSAT(std, etd, tsat);
        if (minutes <= rules.tsattred) return this.red;
        if (minutes <= rules.tsatyellow) return this.yellow;
        return this.green;
    }

    getTSATText(std, etd, atd, tsat, rules) {
        if (this.formatTSAT(std, etd, atd, tsat, rules) == this.green) {
            return 'Ok';
        }
        else {
            return this.getTSAT(std, etd) + ' Min';
        }
    }

    formatOTP(std, etd, atd, rules, timezone) {
        return this.getOTP(std, etd, atd, rules, timezone);
    }

    getOTP(std, etd, atd, rules, timezone) {
        var diffMs;
        var diffMins;
        if (typeof (std) == 'undefined' || std == null || std == this.dateNull) {
            return this.grey;
        }
        if (typeof (atd) != 'undefined' && atd != null && atd != this.dateNull) {
            diffMs = (this.convertTZ(atd, timezone) - this.convertTZ(std, timezone));
            diffMins = Math.round(diffMs / 60000);
            if (diffMins > 15) return this.black;
            return this.green;
        } else if (typeof (etd) != 'undefined' && etd != null && etd != this.dateNull) {
            var etdDate = this.convertTZ(etd, timezone);
            if (new Date() > this.convertTZ(etd, timezone)) {
                etdDate = new Date()
            }
            diffMs = (etdDate - this.convertTZ(std, timezone));
            diffMins = Math.round(diffMs / 60000);
            if (diffMins >= -1 * rules.otpyellow) return this.yellow;
            return this.green;
        } else {
            diffMs = (new Date() - this.convertTZ(std, timezone));
            diffMins = Math.round(diffMs / 60000);
            if (diffMins >= -1 * rules.otpyellow) return this.yellow;
            return this.green;
        }
    }

    formatPrio(pk, priorityFlights) {
        for (let i = 0; i < priorityFlights.length; i++) {
            if (priorityFlights[i].pk == pk) {
                return this.priority;
            }
        }
        return this.no_priority;
    }

    formatIcon(color) {
        if (color == this.green) return this.green_icon;
        if (color == this.yellow) return this.yellow_icon;
        if (color == this.red) return this.red_icon;
        if (color == this.purple) return this.purple_icon;
        if (color == this.black) return this.black_icon;
        if (color == this.grey) return this.grey_icon;
        if (color == this.grey2) return this.grey2_icon;
        if (color == this.priority) return this.priority_icon;
        if (color == this.no_priority) return this.priority_icon;
        else return this.white_icon;
    }

    formatBagPer(bagsm, bags) {
        if (typeof (bags) != 'undefined' && bags != null && Number(bags) > 0 &&
            typeof (bagsm) != 'undefined' && bagsm != null && Number(bagsm) > 0) {
            return Math.floor(Number(bagsm) / Number(bags) * 100, 0);
        }
        else return 0;
    }

    formatPTPer(board, bags) {
        if (typeof (bags) != 'undefined' && bags != null && Number(bags) > 0 &&
            typeof (board) != 'undefined' && board != null && Number(board) > 0) {
            return Math.floor(Number(board) / Number(bags) * 100, 0);
        }
        else return 0;
    }

    formatOTPMin(std, etd, atd, rules, timezone) {
        var sDep;
        var eDep;
        var diffMs;
        var diffMins;
        if (typeof (atd) != 'undefined' && atd != null && atd != this.dateNull) eDep = this.convertTZ(atd, timezone);
        else eDep = new Date();
        if (typeof (std) != 'undefined' && std != null && std != this.dateNull) sDep = this.convertTZ(std, timezone);
        else return '';
        diffMs = (eDep - sDep);
        diffMins = Math.round(diffMs / 60000);
        return '' + diffMins;
    }

    getTextBSM(column) {
        if (column === 'Y') return 'Autorized';
        else if (column === 'N') return 'Not Autorized';
        else return 'Waiting';
    }

    formatBSM(column) {
        if (column === 'Y') return this.green;
        else if (column === 'N') return this.red;
        else return this.grey;
    }

    getTextProcessed(column) {
        if (column === 'Y') return 'Processed';
        else if (column === 'N') return 'Not Processed';
        else return 'Waiting';
    }

    formatProcessed(column) {
        if (column === 'Y') return this.green;
        else if (column === 'N') return this.red;
        else return this.grey;
    }

    getTextBoarded(column) {
        if (column === 'B') return 'Boarded';
        else if (column === 'X') return 'Not Boarded';
        else return 'Waiting';
    }

    formatBoarded(column) {
        if (column === 'B') return this.green;
        else if (column === 'X') return this.red;
        else return this.grey;
    }

    reduceCapitalized(text) {
        let maxLength = 16;
        let final = "";
        if (text == null) return '';
        else if (text.length < maxLength) {
            return this.capitalized(text);
        }
        else {
            final += this.capitalized(text.slice(0, maxLength - 3))
            final += "..."
        }
        return final;
    }

    capitalized(text) {
        if (text == null) return '';
        let arrayText = text.trim().split(" ");
        for (let i in arrayText) {
            arrayText[i] = arrayText[i][0].toUpperCase() + arrayText[i].substr(1).toLowerCase();
        }
        return arrayText.join(" ");
    }

    formatStatus(status) {
        if (status === '') return 'On Time';
        return this.reduceCapitalized(status);
    }

    formatArrStatus(sta, eta, ata, status) {
        let ataAux = new Date(ata)
        let etaAux = new Date(eta)
        let staAux = new Date(sta)

        if (ata != this.dateNull) {
            if (ataAux > staAux) return this.reduceCapitalized('Arrived Delayed');
            else return this.reduceCapitalized('Arrived On Time');
        }
        else if (status === '' && eta != this.dateNull) {
            if (etaAux > staAux) return this.reduceCapitalized('Arrival Delayed');
            else return this.reduceCapitalized('Arrival On Time');
        }
        if (status == null || status == '') {
            return this.reduceCapitalized('Scheduled Arrival')
        } else {
            return this.formatStatus(status);
        }
    }

    formatDepStatus(std, etd, atd, status) {
        let atdAux = new Date(atd)
        let etdAux = new Date(etd)
        let stdAux = new Date(std)
        let now = new Date().getTime()
        if (atd != this.dateNull) {
            if (atdAux > stdAux) return this.reduceCapitalized('Departed Delayed');
            else return this.reduceCapitalized('Departed On Time');
        }
        else if (status === '' && etd != this.dateNull) {
            if (etdAux > stdAux) return this.reduceCapitalized('Departure Delayed');
            else return this.reduceCapitalized('Departure On Time');
        }
        if (stdAux > now) {
            if (etd == this.dateNull || etd == std) return this.reduceCapitalized('On Time');
        }
        return this.formatStatus(status);
    }

    convertTZ(date, tzString) {
        var moment = require('moment-timezone');
        var dateLocal = moment.tz(date, tzString);
        return dateLocal;
    }

    minToDate(date, tzString) {
        var dateBrowser = this.convertTZ(date, tzString);
        var currentDate = new Date();

        return Math.round((dateBrowser - currentDate) / 60000); // minutes;
    }

    getTimezone(station, stationList, timezoneList) {
        let index = stationList.indexOf(station);
        return timezoneList[index];
    }

    addMinutesToDate(date, minutes) {
        var moment = require('moment-timezone');
        return moment(date).add(minutes, 'm').toDate();
    }

    formatDO(door, ata, rules, timezone) {
        var diffMs;
        var diffMins;
        if (typeof (ata) == 'undefined' || ata == null || ata == this.dateNull) {
            return this.green;
        }
        if (typeof (door) != 'undefined' && door != null && door != this.dateNull) {
            return this.green;
        }
        let utcDate = new Date(new Date().toUTCString());
        diffMs = (utcDate - this.convertTZ(ata, timezone));
        diffMins = Math.round(diffMs / 60000);
        if (diffMins > rules.pcdo) return this.red;
        return this.green;
    }

    formatDC(door, std, etd, rules, timezone) {
        var diffMs;
        var diffMins;
        if (typeof (std) == 'undefined' || std == null || std == this.dateNull) {
            return this.green;
        }
        if (typeof (door) != 'undefined' && door != null && door != this.dateNull) {
            return this.green;
        }
        var tdDate = std;
        if (typeof (etd) != 'undefined' && etd != null && etd != this.dateNull) {
            tdDate = etd;
        }
        let utcDate = new Date(new Date().toUTCString());
        diffMs = (utcDate - this.convertTZ(tdDate, timezone));
        diffMins = Math.round(diffMs / 60000);
        if (diffMins > rules.pcdc) return this.red;
        return this.green;
    }

    getBoardingColor(boarding, std, etd, rule, timezone) {
        var diffMs;
        var diffMins;
        if (typeof (std) == 'undefined' || std == null || std == this.dateNull) {
            return '';
        }
        if (typeof (boarding) == 'undefined' || boarding == null || boarding != this.dateNull) {
            boarding = new Date()
        } else {
            boarding = this.convertTZ(boarding, timezone);
        }
        var tdDate = std;
        if (typeof (etd) != 'undefined' && etd != null && etd != this.dateNull) {
            tdDate = etd;
        }
        diffMs = (boarding - this.convertTZ(tdDate, timezone));
        diffMins = Math.round(diffMs / 60000);
        if (diffMins > rule) return this.red;
        return this.green;
    }

    getStartBoardingColor(start, std, etd, rules, timezone) {
        return this.getBoardingColor(start, std, etd, rules.startbrdng, timezone);
    }
    
    getEndBoardingColor(end, std, etd, rules, timezone) {
        return this.getBoardingColor(end, std, etd, rules.endbrdng, timezone);
    }
    
    formatBoardingMin(brdngDate, std, etd) {
        var dep;
        var brdng;
        var diffMs;
        var diffMins;
        if (typeof (etd) != 'undefined' && etd != null && etd != this.dateNull) {
            dep = new Date(etd);
        } else {
            if (typeof (std) != 'undefined' && std != null && std != this.dateNull) {
                dep = new Date(std);
            } else {
                return '';
            }
        }
        if (typeof (brdngDate) != 'undefined' && brdngDate != null && brdngDate != this.dateNull) {
            brdng = new Date(brdngDate);
        } else {
            return '';
        }
            
        diffMs = (brdng - dep);
        diffMins = Math.round(diffMs / 60000);
        if (diffMins > 0) return '' + diffMins;
        return '';
    }

    chartOptionsDelays(isDarkMod){
        return {
        chart: {
            type: 'bar',
            height: 380,
            dropShadow: {
                enabled: true,
                opacity: 0.3,
                blur: 5,
                left: -7,
                top: 6
            },
            toolbar: {
                show: false,
                offsetX: 0,
                offsetY: 0,
                tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                    customIcons: []
                },
            },
        },
        plotOptions: {
            bar: {
                barHeight: '80%',
                distributed: true,
                horizontal: true,
                dataLabels: {
                    position: 'bottom'
                },
            },
        },
        fill: {
            opacity: 1,
        },
        noData: {
            text: 'Loading...'
        },
        colors: (isDarkMod ? ['#78909C'] : ['#BBDEFB']),
        dataLabels: {
            name: {
                show: true,
                fontSize: ((this.smalls == true) ? '20px' : '20px'),
                fontFamily: 'Roboto',
                fontWeight: 600,
                offsetY: -5
            },
            value: {
                show: true,
                fontSize: '20px',
                fontFamily: undefined,
                fontWeight: 600,
                offsetY: 6
            },
            enabled: true,
            textAnchor: 'start',
            style: {
                colors: (isDarkMod ? ['#FFFFFF'] : ['#000000']),
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
                enabled: false
            }
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            labels: {
                show: false
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            categories: [],
        },
        yaxis: {
            labels: {
                show: false
            },
        },
        tooltip: {
            enabled: false,
        },
        legend: {
            show: false,
        },
    }}
}
