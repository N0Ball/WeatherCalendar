
let requestURL = 'http://localhost:5000';

const eventModal = document.getElementById('event-modal');
const eventModalCard = document.getElementById('event-modal-card');

class CalendarManager extends(LoaderManager){
    postLoad(){}
}

async function getCalendar(url){
    try {
        let response = await fetch(url);
        let data = await response.json();

        data = data.data;

        const configs = {
            events: [],
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
            },
            eventMouseEnter: (info) => {

                eventModal.innerHTML = `
                <div id="event-modal-card" class="card">
                    <div class="card-header">
                        <h3 id="event-header-text">
                            ${info.event.title}
                        </h3>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title"></h5>
                        <p class="card-text">
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
                        </p>
                    </div>
                </div>
                `

                eventModal.classList.remove('d-none');
            },
            eventMouseLeave: (info) => {
                eventModal.classList.add('d-none');
            }
        };

        index = 0
        data.forEach(event => {
            element = {};

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

            configs['events'].push(element);

            index += 1;
        });

        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, configs);

        calendar.render();
        
        return data[data];
    } catch(error) {
        console.log(`Error: ${error}`);
    }
}

getCalendar(requestURL);

document.addEventListener('mousemove', function(e) {

    try{
        let eventModalCard = document.getElementById('event-modal-card');
        let left = e.clientX;
        let top = e.clientY;
        eventModalCard.style.left = left + 1 + 'px';
        eventModalCard.style.top = top + 1 + 'px';
        
        if (e.clientX + eventModal.offsetWidth + 10 >= window.innerWidth){
            eventModal.style.left -= `${eventModal.style.width}`;
        }
    
        if (e.clientY + eventModal.offsetHeight + 10 >= window.innerHeight){
            eventModal.style.left -= `${eventModal.style.height}`;
        }
    }catch(e){}

});
