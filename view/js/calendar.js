let requestURL = 'https://api.dos.phy.ncu.edu.tw/cal';

const eventModal = document.getElementById('event-modal');
const eventModalCard = document.getElementById('event-modal-card');

const CalendarConfig = Object(
    {
        height: window.innerHeight*0.85,
        themeSystem: 'bootstrap5',
        displayEventTime: false,
        customButtons: {
            bell: {}
        },
        buttonIcons: {
            prev: 'chevron-left',
            next: 'chevron-right',
            bell: 'bell'
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'bell'
        }
    }
)

class CalendarManager extends(LoaderManager){

    constructor(calendar){
        super();
        this.CALENDAR = calendar;
        this.TYPE = undefined;
    }

    async postLoad(){

        if (this.TYPE == "CALENDAR"){
            this.CALENDAR.loadEvent();
            return;
        }

        if (this.TYPE == "STATUS"){
            this.CALENDAR.loadStatus();
            this.CALENDAR.LOADING.classList.add('d-none');
        }

    }
}

class MapParser{
    constructor(){
        this.PATTERN = /(?<zipcode>(^\d{5}|^\d{3})?)(?<city>\D+[縣市])(?<district>\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)/
    }

    parse(location){
        return location.match(this.PATTERN);
    }
}

class Calendar{

    constructor(){
        this.CONFIG = Object.assign({}, CalendarConfig);
        this.LOADER = new CalendarManager(this);
        this.CALENDAR_EL = document.getElementById('calendar');
        this.CALENDAR = undefined;
        this.LOADER.TYPE = "CALENDAR";
        this.MAP_PARSER = new MapParser();
        this.FIELD_LIST = ['Temperature'];
        this.STATUS_LIST = ['MoonriseMoonsetTime', 'SunriseSunsetTime', 'WeatherIconAll', 'UV', 'PrecipitationProbabilityAll']
        this.PARSER = undefined;
        this.addHandler();
    }

    addEvent(){
        this.LOADER.addLoader(new Loader('cal'));
    }

    addHandler(){

        this.CONFIG.eventClick = info => {
            this.INFO = info;
            this.LOADER.TYPE = "EVENT";
            this.updateEventModal();
        };
    }

    updateEventModal(){

        let iconsHTML = '';
        this.INFO.event.extendedProps.icons.forEach( icon => {
            let time = icon.datetime.split(' ');
            let date = time[0].slice(5).replace('-', '/');
            time = time[1].slice(0, 5);
            let url = icon.urls;
            
            iconsHTML += `
            <div class="mx-3 px-3 mt-2">
                <img src="${url}" width="25" height="25">
                <spam class="mx-1"> ${date} ${time} </spam>
            </div>
            `
        })

        eventModal.innerHTML = `
        <div id="event-modal-card" class="d-flex flex-wrap" tabindex="-1" aria-labelledby="event-modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title m-2">${this.INFO.event.title}</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="disableEventModal();"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modal-location">
                            <i class="bi bi-geo-alt"></i>
                            <span id="modal-location-text" class="ps-3 px-5">
                                ${this.INFO.event.extendedProps.location}
                            </span>
                            <span class="float-end">
                                ${this.INFO.event.extendedProps.maxTemperature}°C/${this.INFO.event.extendedProps.minTemperature}°C
                            </span>
                            ${iconsHTML}
                        </div>
                        <div id="modal-detail">
                            <i class="bi bi-list"></i>
                            <span id="modal-detail-text" class="ps-3 px-5">
                                ${this.INFO.event.extendedProps.description.join('<br>')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `

        eventModal.classList.remove('d-none');

        let eventModalCard = document.getElementById('event-modal-card');

        eventModalCard.style.left = this.INFO.el.getBoundingClientRect().x - eventModalCard.getBoundingClientRect().width - 5 + 'px';
        eventModalCard.style.top = this.INFO.el.getBoundingClientRect().y - eventModalCard.getBoundingClientRect().height - 5 + 'px';

        if ( eventModalCard.getBoundingClientRect().x < this.CALENDAR_EL.getBoundingClientRect().x){
            eventModalCard.style.left = this.INFO.el.getBoundingClientRect().x + this.INFO.el.getBoundingClientRect().width + 5 + 'px';
        }

        if ( eventModalCard.getBoundingClientRect().y < this.CALENDAR_EL.getBoundingClientRect().y ){
            eventModalCard.style.top = this.INFO.el.getBoundingClientRect().y + this.INFO.el.getBoundingClientRect().height + 5 + 'px';
        }

    }

    loadEvent(){

        this.CONFIG.events = [];

        let index = 0;
        
        let data = this.LOADER.getLoaderData('cal').data;
        let location = this.getLocatoin();
        this.LOAD_SIZE = data.length;
        
        data.forEach(async event => {
    
            let element = {};
            let city = location.city;
            let town = location.town;

            let TARGET_LIST = ['DTSTART', 'DTEND', 'LOCATION', 'DESCRIPTION'];

            TARGET_LIST.forEach(e => {
                if (event[e] == undefined){
                    event[e] = [null];
                }
            });

            TARGET_LIST = ['DTSTART;VALUE=DATE', 'DTEND;VALUE=DATE'];

            TARGET_LIST.forEach(e => {
                if (event[e] != undefined){
                    event[e.split(';')[0]] = event[e];
                }
            });

            try {
                var map = this.MAP_PARSER.parse(event.LOCATION);
                city = map[3];
                town = map[4];
                city = city.split('台灣')[1];
                
            } catch (error) {}
            
            const API_URL = 'https://api.dos.phy.ncu.edu.tw';
            let result = await fetch(`${API_URL}/Temperature/${city}/${town}/${event.DTSTART}/${event.DTEND}`);
            let temp = await result.json();
            temp = temp.data;


            result = await fetch(`${API_URL}/WeatherIcon/${city}/${town}/${event.DTSTART}/${event.DTEND}`);
            let icons = await result.json();
            icons = icons.data;

            if (event.LOCATION == ''){
                event.LOCATION = `${city}, ${town}`;
            }

            element['id'] = index;
            element['title'] = event.SUMMARY;
            element['start'] = event.DTSTART;
            element['end'] = event.DTEND;
            element['description'] = [event.DESCRIPTION];
            element['extendedProps'] = {
                "location": event.LOCATION,
                "setWeather": [],
                "maxTemperature": temp.max,
                "minTemperature": temp.min,
                "icons": icons
            };

            this.CONFIG.events.push(element);
            index += 1;

            this.update();
        });
    }

    update(){

        try {

            this.CALENDAR = new FullCalendar.Calendar(this.CALENDAR_EL, this.CONFIG);
            this.CALENDAR.render();

            if (this.CONFIG.events.length == this.LOAD_SIZE){
                this.initStatus();
            }

        } catch (error) {
            console.warn(error);
        }
    }

    initStatus(){

        this.LOADING = document.getElementById('loading');
        this.LOADING.classList.remove('d-none');

        this.LOADER.TYPE = "STATUS";
        this.DATE_CELLS = document.querySelectorAll(`[role="gridcell"]`);
        this.START_DATE = this.DATE_CELLS[0].getAttribute('data-date');
        this.END_DATE = this.DATE_CELLS[this.DATE_CELLS.length - 1].getAttribute('data-date');
        this.STATUS_RESULT = {};
        let location = this.getLocatoin();
        
        this.STATUS_LIST.forEach( target => {
            let url = `${target}/${location.city}/${location.town}/${this.START_DATE}/${this.END_DATE}`;
            this.LOADER.addLoader(new Loader(url));
        });

        this.DATE_CELLS.forEach( cell => {
            this.STATUS_RESULT[cell.getAttribute('data-date')] = [];
        });
    }

    loadStatus(){

        let location = this.getLocatoin();

        this.STATUS_LIST.forEach( target => {
            let url = `${target}/${location.city}/${location.town}/${this.START_DATE}/${this.END_DATE}`;
            this.LOADER.getLoaderData(url).data.forEach(data => {
                this.STATUS_RESULT[data.datetime.split(' ')[0]].push({
                    target: target,
                    data: data
                });
            });
        });

        this.DATE_CELLS.forEach( cell => {
            let date = cell.getAttribute('data-date');
            cell.classList.add('position-relative');

            let statusField = document.createElement('div');
            let storedDiv = document.createElement('div');
            statusField.classList.add('position-relative');
            storedDiv.classList.add('position-absolute');
            storedDiv.style.left = cell.getBoundingClientRect().width - 30 + 'px';
            storedDiv.style.top = '7px';
            
            this.STATUS_RESULT[date].forEach( status => {
                let statusDiv = document.createElement('div');
                statusDiv.classList.add('d-flex');

                statusDiv.innerHTML = this.createStatus(status);

                if (status.target == 'WeatherIconAll'){
                    storedDiv.innerHTML = statusDiv.innerHTML;
                }else{
                    statusField.appendChild(statusDiv);
                }

            });

            
            cell.appendChild(statusField);
            statusField.style.top = - statusField.getBoundingClientRect().height + 'px';
            
            if (storedDiv){
                cell.appendChild(storedDiv);
            }
        });

    }

    getLocatoin(){

        let location = getCookie('location') || {
            city: '臺北市',
            town: '中山區'
        };

        return JSON.parse(location);
    }

    createStatus(status){
        
        if (status.target == 'MoonriseMoonsetTime'){
            return `
                <img src="./img/status/moonrise.png" width="30" height="30">
                <div class="mx-2" style="font-size:10px">
                    <div>
                        ${status.data.rise_time}
                    </div>
                    <div>
                        ${status.data.set_time}
                    </div>
                </div>
            `;
        }

        if (status.target == 'SunriseSunsetTime'){
            return `
                <img src="./img/status/sunrise.png" width="30" height="30">
                <div class="mx-2" style="font-size:10px">
                    <div>
                        ${status.data.rise_time}
                    </div>
                    <div>
                        ${status.data.set_time}
                    </div>
                </div>
            `;
        }

        if (status.target == 'UV'){
            
            return `
            <img src="./img/status/uv-${status.data.UVindex}.svg" width="30" height="30">
            `;
        }

        if (status.target == 'WeatherIconAll'){

            return `
            <img src="${status.data.urls}" width="15" height="15">
            `;
        }

        if (status.target == 'PrecipitationProbabilityAll'){
            if (status.data.values == ' '){
                return '';
            }

            return `
            <img src="./img/status/water.png" width="30" height="30">
            <spam class="mx-2 mt-2" style="font-size: .75rem">
                ${status.data.values}%
            </spam>
            `;
        }

        return '';
    }

}

function disableEventModal() {
    eventModal.classList.add('d-none');
}