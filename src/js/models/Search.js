import axios from 'axios'

// Search data model
export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults(){
        try {
            const response = await axios (`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.recipes = response.data.recipes;
        } catch (error) {
            alert('Something went wrong :(')
        }
    }
}