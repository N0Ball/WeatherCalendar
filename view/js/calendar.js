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
            await this.CALENDAR.loadEvent();
            return;
        }

        // if (this.TYPE == "EVENT"){

        //     this.CALENDAR.FIELD_LIST.forEach( field => {
        //         let data = this.CALENDAR.LOADER.getLoaderData(`${field}/${this.CALENDAR.EVENT_TARGET}`).data;

        //         this.CALENDAR.INFO.event.extendedProps.description.push(`
        //             TEMPERATURE ${data.max}/${data.min}
        //         `);

        //     })

        //     this.CALENDAR.updateEventModal();
        //     return;
        // }

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

            // try {
            //     var map = this.MAP_PARSER.parse(this.INFO.event.extendedProps.location);
            //     var city = map[3];
            //     var town = map[4];
            //     city = city.split('台灣')[1];
            // } catch (error) {
            //     this.INFO.event.extendedProps.setWeather.push(true);
            // }
            
            // if (this.INFO.event.extendedProps.setWeather.length != 0){
            //     this.updateEventModal();
            //     return;
            // }

            // this.EVENT_TARGET = `${city}/${town}/${this.INFO.event.startStr}/${this.INFO.event.endStr}`;

            // this.FIELD_LIST.forEach(field => {
            //     this.LOADER.addLoader(new Loader(`${field}/${this.EVENT_TARGET}`));
            // });

            // this.INFO.event.extendedProps.setWeather.push(true);

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
        let location = getCookie('location') || {
            city: '臺北市',
            town: '中山區'
        };

        location = JSON.parse(location);

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
            })

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
        } catch (error) {
            console.warn(error);
        }
    }

}

function disableEventModal() {
    eventModal.classList.add('d-none');
}
