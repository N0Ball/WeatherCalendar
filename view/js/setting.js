let SETTING_SELECT_AREAS = undefined;

class Setting{

    constructor(){
        this.CITY_DATA = undefined;
        this.SELECTED = undefined;

        this.SETTING_CITY_FIELD = undefined;
        this.SETTING_TOWN_FIELD = undefined;

        this.LOCATION = null;
        this.ROLE = null;
    }

    update(init=true){
        
        this.SETTING_CITY_FIELD.innerHTML = '<option>縣、市</option>';
        this.SETTING_TOWN_FIELD.innerHTML = '<option>鄉、鎮、市</option>';

        if (init == true){
            this.LOCATION = JSON.parse(getCookie('location'));
            this.ROLE = JSON.parse(getCookie('role'));
    
            SETTING_SELECT_AREAS = document.querySelectorAll('.setting-select-area');
            
            if (this.ROLE != null){
                SETTING_SELECT_AREAS.forEach( area => {
                    
                    if (area.getAttribute('role') == this.ROLE.role){
                        setRole(area);
                    }
        
                })
            }
    
            if (this.LOCATION != null){
                this.SELECTED = this.LOCATION.city;
            }
        }

        for (const [city, towns] of Object.entries(this.CITY_DATA)){
            
            if (this.SELECTED == city){

                this.SETTING_CITY_FIELD.innerHTML += `
                    <option value="${city}" selected>${city}</option>
                `;

                towns.forEach( town => {

                    if (this.LOCATION != null){
                        this.SETTING_TOWN_FIELD.innerHTML += `
                            <option value="${town}" selected>${town}</option>
                        `
                        return;
                    }

                    this.SETTING_TOWN_FIELD.innerHTML += `
                    <option value="${town}">${town}</option>
                    `
                })

                continue;
            }

            this.SETTING_CITY_FIELD.innerHTML += `
                <option value="${city}">${city}</option>
            `;
        }
    }

    init(){
        this.SETTING_CITY_FIELD = document.getElementById('setting-city');
        this.SETTING_TOWN_FIELD = document.getElementById('setting-town');

        this.SETTING_CITY_FIELD.onchange = () => {
            this.SELECTED = this.SETTING_CITY_FIELD.value;
            this.update(false);
        }

        this.SETTING_TOWN_FIELD.onchange = () => {

            setCookie('location', JSON.stringify({
                city: this.SELECTED,
                town: this.SETTING_TOWN_FIELD.value
            }));

        }
    }
}

let SETTING_MODAL = undefined;
let SETTING_MODAL_BUTTON = undefined;

class SettingLoaderManager extends LoaderManager{

    constructor(setting){
        super();
        this.SETTING = setting;
    }

    postLoad(){
        this.SETTING.CITY_DATA = this.getLoaderData('city').data;
        this.SETTING.init();
        this.SETTING.update();
    }
}

function loadSetting(){
    SETTING_MODAL_BUTTON = document.getElementById('setting-modal-button');
    SETTING_MODAL = document.getElementById('setting-modal');
    const settingLoaderManager = new SettingLoaderManager(new Setting());
    settingLoaderManager.addLoader(new Loader('city'));
}


function checkSetting(target){

    if (getCookie('location') != null && getCookie('role') != null){

        if (window.location.href.split('/').pop() == 'choose.html'){
            target.setAttribute('data-bs-toggle', "modal");
            target.setAttribute('data-bs-target', "#TempModal");
            document.getElementById('TempModal').classList.remove('d-none');
            // window.location.href = './';
            target.setAttribute('data-bs-dismiss', 'modal');
            target.click();
            SETTING_MODAL.style.display = "none";
            return;
        }

        target.setAttribute('data-bs-dismiss', 'modal');
        target.click();

        window.location.reload();

    }

    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl, delay="500");
    })

    toastList[0].show();

}

function setRole(target){
    clearSelect();
    setCookie('role', JSON.stringify({'role': target.getAttribute('role')}));
    target.classList.add('border');
    target.classList.add('border-3');
    target.classList.add('border-warning');
}

function clearSelect(){
    SETTING_SELECT_AREAS = document.querySelectorAll('.setting-select-area');
    SETTING_SELECT_AREAS.forEach( area => {
        area.classList.remove('border');
        area.classList.remove('border-3'); 
    })
}