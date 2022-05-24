
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
    }

    postLoad(){
        this.CALENDAR.loadEvent();
        this.CALENDAR.update();
    }
}

class Calendar{

    constructor(){
        this.CONFIG = CalendarConfig;
        this.LOADER = new CalendarManager(this);
        this.CALENDAR_EL = document.getElementById('calendar');
        this.CALENDAR = undefined;
        this.addHandler();
    }

    addEvent(){
        this.LOADER.addLoader(new Loader('cal'));
    }

    addHandler(){
        this.CONFIG.eventClick = info => {

            eventModal.innerHTML = `
            <div id="event-modal-card" class="d-flex flex-wrap" tabindex="-1" aria-labelledby="event-modal-label" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title m-2">${info.event.title}</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="disableEventModal();"></button>
                        </div>
                        <div class="modal-body">
                            <div id="modal-location">
                                <i class="bi bi-geo-alt"></i>
                                <span id="modal-location-text" class="ps-3 px-5">
                                    ${info.event.extendedProps[0].location}
                                </span>
                            </div>
                            <div id="modal-detail">
                                <i class="bi bi-list"></i>
                                <span id="modal-detail-text" class="ps-3 px-5">
                                    ${info.event.extendedProps.description}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `

            eventModal.classList.remove('d-none');

            let eventModalCard = document.getElementById('event-modal-card');

            eventModalCard.style.left = info.el.getBoundingClientRect().x + 'px';
            eventModalCard.style.top = info.el.getBoundingClientRect().y + 'px';

            console.log(eventModalCard.style.left);

        };
    }

    loadEvent(){

        this.CONFIG.events = [];

        let index = 0;
        let data = this.LOADER.getLoaderData('cal').data;

        data.forEach(event => {
            let element = {};

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

            element['id'] = index;
            element['title'] = event.SUMMARY;
            element['start'] = event.DTSTART;
            element['end'] = event.DTEND;
            element['description'] = event.DESCRIPTION;
            element['extendedProps'] = [
                {
                    "location": event.LOCATION
                }
            ];
            element['e']

            this.CONFIG.events.push(element);
            index += 1;
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
