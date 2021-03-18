
class City{
    constructor(data){
        this.data = this.getDataByLanguage('RU');
    }
    init(){
        //получаем элементы
        this.listDefault = document.querySelector('.dropdown-lists__list--default');
        this.listSelect = document.querySelector('.dropdown-lists__list--select');
        this.autocomplete = document.querySelector('.dropdown-lists__list--autocomplete');
        this.autocompleteInsertBlock = this.autocomplete.querySelector('.dropdown-lists__countryBlock');
        this.inputCities = document.querySelector('.input-cities');
        this.label = this.inputCities.querySelector('.label');
        this.closeBtn =this.inputCities.querySelector('.close-button');
        this.selectCities = this.inputCities.querySelector('#select-cities');
        this.wikiBtn = this.inputCities.querySelector('.button');

        this.renderDefaultBlock(3);
        this.blockBtn();
        this.addListeners();
    }
    getData(data){
        return data;
    }
    getDataByLanguage(language){
        const dataByLanguage = data[language];
        dataByLanguage.forEach(item => {
            this.sortArrayByCount(item.cities);
        });
        return dataByLanguage;
    }
    getCountryByName(name){
        const data = this.getDataByLanguage('RU');
        for(let elem of data){
            if(elem.country.toLowerCase() === name.toLowerCase()){
                return elem
            }
        }
        return false;
    }
    getCityByStr(str = ''){
        const reg = new RegExp(`^${str}`, 'i');
        const cityArr = [];
        if(str.length > 0){
            let data = this.getDataByLanguage('RU');
            data.forEach(item => {
                item.cities.forEach(city => {
                    if(reg.test(city.name)){
                        cityArr.push(city);
                    }
                })
            })
        }
        return cityArr;
    }
    btnHandler(e){
        e.preventDefault();
    }
    blockBtn(){
        this.wikiBtn.addEventListener('click', this.btnHandler)
    }
    unblockBtn(){
        this.wikiBtn.removeEventListener('click', this.btnHandler)
    }
    addListeners(){
        document.addEventListener('click', (e) => {
            if(!e.target.closest('.input-cities')){
                this.hideAll();
            }
        })
        this.inputCities.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if(val){
                this.label.style.display = 'none';
                let cities = this.getCityByStr(val);
                this.closeBtn.style.display = 'block';
                this.showListAutocomplete();
                this.renderAutocompleteBlock(cities);
                this.unblockBtn();
            } else {
                this.showListDefault();
                this.closeBtn.style.display = 'none';
                this.blockBtn();
            }
        });

        this.inputCities.addEventListener('click', (e) => {
            let target = e.target;
            let totalLine = target.closest('.dropdown-lists__total-line');
            let cityLine = target.closest('.dropdown-lists__line');
            if(totalLine){
                if(target.closest('.dropdown-lists__list--default')){
                    let name = totalLine.dataset.name.trim();
                    let country = this.getCountryByName(name);
                    this.showListSelect();
                    this.renderSelectBlock(country);
                    this.unblockBtn();
                } else if(target.closest('.dropdown-lists__list--select')){
                    this.showListDefault();
                }
            } else if(cityLine){
                let city = cityLine.querySelector('.dropdown-lists__city').textContent.trim();
                let cityObj = this.getCityByStr(city)[0];
                console.log(cityObj);
                this.label.style.display = 'none';
                this.selectCities.value = cityObj.name;
                this.closeBtn.style.display = 'block';
                this.wikiBtn.setAttribute('href', cityObj.link);
                this.unblockBtn();
            } else if (target.matches('.close-button')) {
                this.hideAll();
                this.selectCities.value = '';
                this.closeBtn.style.display = 'none';
                this.blockBtn();
            }
        })
        const selectCities = document.querySelector('#select-cities');
        selectCities.addEventListener('focus', (e) => {
            const val = e.target.value.trim();
            if(val){
                this.label.style.display = 'none';
                let cities = this.getCityByStr(val);
                this.showListAutocomplete();
                this.renderAutocompleteBlock(cities);
            } else {
                this.showListDefault()
            }
        });
    }
    showListDefault(){
        this.listDefault.style.display = 'block';
        this.listSelect.style.display = 'none';
        this.autocomplete.style.display = 'none';
    }
    showListSelect(){
        this.listDefault.style.display = 'none';
        this.listSelect.style.display = 'block';
        this.autocomplete.style.display = 'none';
    }
    showListAutocomplete(){
        this.listDefault.style.display = 'none';
        this.listSelect.style.display = 'none';
        this.autocomplete.style.display = 'block';
    }
    hideAll(){
        this.listDefault.style.display = 'none';
        this.listSelect.style.display = 'none';
        this.autocomplete.style.display = 'none';
    }
    renderAutocompleteBlock(data = []){
        this.autocompleteInsertBlock.innerHTML = '';
        if(data.length === 0){
            this.autocompleteInsertBlock.innerHTML = `<p>Ничего не найдено!</p>`
        } else {
            data.forEach(item => {
                this.autocompleteInsertBlock.insertAdjacentHTML('beforeend', this.renderCityBlock(item));
            })
        }
    }
    renderCityBlock(city){
        return `<div class="dropdown-lists__line" data-link="${city.link}">
                   <div class="dropdown-lists__city">${city.name}</div>
                   <div class="dropdown-lists__count">${city.count}</div>
                </div>`;
    }
    renderCountryBlock(country){
        return `<div class="dropdown-lists__total-line" data-name="${country.country}">
                    <div class="dropdown-lists__country">${country.country}</div>
                    <div class="dropdown-lists__count">${country.count}</div>
                </div>`;
    }
    renderCountry(country, pasteSelector, cityCount = false){
        const pasteElement = document.createElement('div');
        pasteElement.classList.add('dropdown-lists__col');
        pasteSelector.append(pasteElement);
        let countryBlock = document.createElement('div');
        countryBlock.classList.add('.dropdown-lists__countryBlock');
        countryBlock.insertAdjacentHTML('beforeend', this.renderCountryBlock(country));
        const cityCnt = (cityCount) ? cityCount : country.cities.length;
        for(let i =  0; i < cityCnt; i++){
            countryBlock.insertAdjacentHTML('beforeend', this.renderCityBlock(country.cities[i]));
        }
        pasteElement.append(countryBlock);
    }
    renderDefaultBlock(cityCount){
        this.data.forEach((item, index) => this.renderCountry(item, this.listDefault, cityCount));
    }
    renderSelectBlock(country){
        this.listSelect.innerHTML = '';
        this.renderCountry(country, this.listSelect);
    }
    sortArrayByCount(arr = []){
        arr.sort((a,b) => b.count - a.count);
    }
}

const city = new City(data);
city.init();
console.log(city.data)