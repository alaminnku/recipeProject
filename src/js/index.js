// Global Controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe'

/* Global State of the app
- Search object
- Current recipe object
- Shopping list object
- Liked object
*/
const state = {};

// Search Controller
const searchController = async () => {
    // Get the query from view
    const query = searchView.searchInput();
    if(query) {
        // Create new search object
        state.search = new Search(query);

        // Clear the search field and previous results
        searchView.clearInput();
        searchView.clearResults();

        // Render the loader
        renderLoader(elements.searchReults)
        
        try {
            // Get the search result
            await state.search.getResults();
    
            // Remove the loader 
            clearLoader()
            
            // Render the results on UI
            searchView.renderRecipes(state.search.recipes);
        } catch(error) {
            alert('Error processing the search :(');
            clearLoader();
        }
    }
};

// Activate the search form
elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchController();
});

//Activate pagination button
elements.resultsPages.addEventListener('click', e => {
    // Check if target's closest element has the class of .btn-inline
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        // Render next 10 recipes
        searchView.renderRecipes(state.search.recipes, goToPage);
    }
});

// Recipe controller
const recipeController = async () => {
    // Getting the id from URL
    const id = window.location.hash.replace('#', '');
    
    if(id) {
        // Prepare the UI
        renderLoader(elements.recipe);
        recipeView.clearRecipe();

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredient
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // Calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings()
    
            // Render recipe on UI
            clearLoader()
            recipeView.renderReicpe(state.recipe);

        } catch (error) {
            console.log(error)
            alert('Recipe processing failed :(')
        }
    }
}

// Functioning load and haschange event
['hashchange', 'load'].forEach(el => window.addEventListener(el, recipeController))
