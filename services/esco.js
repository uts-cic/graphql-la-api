const { RESTDataSource } = require('apollo-datasource-rest');

class EscoAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://ec.europa.eu/';
    }

    async fetchOccupations(what) {
        let en= encodeURIComponent(what);
        return this.get(`esco/api/suggest?type=occupation&language=en&text=*${en}*`);
    }

    async skills (link)  {
        let path = new URL(link);
        return this.get(path.pathname+path.search);
    }
}

export { EscoAPI };