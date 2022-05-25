class Setting{

    constructor(){
        this.CITY_DATA = undefined;
        this.SELECTED = undefined;

        this.SETTING_CITY_FIELD = undefined;
        this.SETTING_TOWN_FIELD = undefined;
    }

    update(){
        
        this.SETTING_CITY_FIELD.innerHTML = '<option>縣、市</option>';
        this.SETTING_TOWN_FIELD.innerHTML = '<option>鄉、鎮、市</option>';

        for (const [city, towns] of Object.entries(this.CITY_DATA)){
            
            if (this.SELECTED == city){

                this.SETTING_CITY_FIELD.innerHTML += `
                    <option value="${city}" selected>${city}</option>
                `;

                towns.forEach( town => {
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
            this.update();
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
    SETTING_MODAL = document.getElementById('setting-modal-button');
    const settingLoaderManager = new SettingLoaderManager(new Setting());
    settingLoaderManager.addLoader(new Loader('city'));
}

function updateTown(city){
    console.log(city.value);
}

function checkSetting(target){

    if (getCookie('location') != null){

        if (window.location.href.split('/').pop() == 'choose.html'){
            target.setAttribute('data-bs-toggle', "modal");
            target.setAttribute('data-bs-target', "#TempModal");
            document.getElementById('TempModal').classList.remove('d-none');
            // window.location.href = './';
            target.click();
            return;
        }

        target.setAttribute('data-bs-dismiss', 'modal');
        target.click();

        window.location.reload();

    }



}