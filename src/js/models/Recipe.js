import axios from 'axios'

// Recipe data model
export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const response = await axios (`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = response.data.recipe.title;
            this.author = response.data.recipe.publisher;
            this.img = response.data.recipe.image_url;
            this.url = response.data.recipe.source_url;
            this.ingredients = response.data.recipe.ingredients;
        } catch (error) {
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        // Assuming each 3 ingredients takes 15 minutes to cook
        const numOfIng = this.ingredients.length;
        const period = numOfIng / 3;
        this.time = period * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const longUnits = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'pounds', 'cups'];
        const shortUnits = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'pound', 'cup'];

        // Destructuring the shotunits array and adding more units which we don't need to shorten
        const units = [...shortUnits, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();

            // Uniform ingredients
            longUnits.forEach((cur, i) => {
                // Replace longunits to shortunits in ingredient
                ingredient = ingredient.replace(cur, shortUnits[i]);
            });

            // Remove text inside parentheses after the unit
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients
            // Spliting the ingredient string by space
            const arrayOfIngredient = ingredient.split(' ');

            // Check if the current element is in shortUnits array. If yes, return the index of the unit
            const indexOfUnit = arrayOfIngredient.findIndex(cur => units.includes(cur));

            let objectOfIngredient;
            if(indexOfUnit > -1) {
                // There is a unit
                // Array of elements before unit
                const arrayOfNumbers = arrayOfIngredient.slice(0, indexOfUnit);
                
                let count;
                if(arrayOfNumbers.length === 1) {
                    // There is one element before the unit --> 4 tbsp 
                    count = eval(arrayOfNumbers[0].replace('-', '+'));
                } else {
                    // There is multiple elements before the unit --> 4 1/2 cup
                    count = eval(arrayOfNumbers.join('+'));
                }

                objectOfIngredient = {
                    count,
                    unit: arrayOfIngredient[indexOfUnit],
                    ingredient: arrayOfIngredient.slice(indexOfUnit + 1).join(' ')
                }
            } else if(parseInt(arrayOfIngredient[0])) {
                // Tehre is no unit but first element is a number
                objectOfIngredient = {
                    count: parseInt(arrayOfIngredient[0]),
                    unit: '',
                    ingredient: arrayOfIngredient.slice(1).join(' ')
                }
            } else if(indexOfUnit === -1) {
                // There is no unit
                objectOfIngredient = {
                    count: '',
                    unit: '',
                    ingredient
                }
            };

            return objectOfIngredient;
        });
        // Assign newIngredients object as ingredients of the recipe 
        this.ingredients = newIngredients;
    }
};