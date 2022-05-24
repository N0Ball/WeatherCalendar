API_URI = 'https://api.dos.phy.ncu.edu.tw';

class LoaderManager{

    constructor(){
        this.loaders = Array();
        this.loaderData = {};
    };

    addLoader(loader){
        this.loaders.push(loader);
        this.loaderData[loader.NAME] = undefined;
    }

    async init(){

        this.loaders.forEach(loader => {
            loader.fetchUri()
            .then( res => {
                loader.status = true;
                this.loaderData[loader.NAME] = res;
                this.update();
            });
        });

    }

    update(){
        
        let finishLoad = true;

        this.loaders.forEach(loader => {

            if(!loader.status){
                finishLoad = false;
                return;
            }

        });

        if (finishLoad){
            this.loaders = Array();
            this.postLoad();
        }

    }

    postLoad(){
        console.log("All Requested url are loaded!");
    }

    getLoaderData(name){
        return this.loaderData[name];
    }
}

class Loader{
    
    constructor(name, requests, uri){
        this.NAME = name;
        this.REQ = requests;
        this.URI = `${uri}/${this.NAME}`;
        this.status = false;
        this.data = undefined;
    }

    async fetchUri(){

        this.data = await this.doFetch();

        try {
            this.data = await this.data.json();
        } catch (error) {
            this.data = await this.data.status;
        }

        return this.data;
    }

    async doFetch() {
        return await fetch(this.URI);
    }

}

class Includer extends Loader{

    constructor(name, requests){
        super(name, requests, '');
        this.URI = `./inc/${this.NAME}.html`;
        this.TARGET = document.getElementById(this.NAME);

        if (this.TARGET == undefined){
            console.warn(`you might need an dom named "${this.NAME}" to put the data in.`);
        }
    }

    async fetchUri(){
        this.data = await this.doFetch();

        try {
            this.data = await this.data.text();
        } catch (error) {
            this.data = await this.data.status;
        }

        this.TARGET.innerHTML = this.data;
    }
}