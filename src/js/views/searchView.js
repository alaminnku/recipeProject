import { elements } from './base';

export const searchInput = () => elements.searchInput.value;

// Clear input field
export const clearInput = () => {
    elements.searchForm.reset();
};

// Clear previous results
export const clearResults = () => {
    elements.recipeList.innerHTML = '';
    elements.resultsPages.innerHTML = '';
};

// Add ... at the end if the title length is greater than 17
const limitTitle = (title, limit = 17) => {
    const newTitle = []
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

// Create the pagination button
const createButton = (curPage, type) => {
    if (type === 'prev') {
        return `
        <button class="btn-inline results__btn--${type}" data-goto="${curPage - 1}">
            <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${'left'}"></use>
            </svg>

            <span>Page ${curPage - 1}</span>
        </button>
    `
    } else if(type === 'next'){

        return `
        <button class="btn-inline results__btn--${type}" data-goto="${curPage + 1}">
        <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${'right'}"></use>
            </svg>
        </button>
    `
    }

};

// Render the buttons based on current page
const renderButtons = (curPage, totalRecipes, recipesPerPage) => {
    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    let button;
    if(curPage === 1 && totalPages > 1) {
        // Render next page button
        button = createButton(curPage, 'next');
    } else if(curPage < totalPages) {
        // Render both next and previous button
        button = `
        ${createButton(curPage, 'next')}
        ${createButton(curPage, 'prev')}
        ` 
    } else if (curPage === totalPages) {
        // Render previous page button
        button = createButton(curPage, 'prev');
    }
    // Insert the button to the page
    elements.resultsPages.insertAdjacentHTML("afterbegin", button);
}

// Render the recipes on UI
export const renderRecipes = (recipes, curPage = 1, recipesPerPage = 10) => {
    // Render only 10 results per page
    const start = (curPage - 1) * recipesPerPage;
    const end = curPage * recipesPerPage;

    // Slice the recipes and render 10 on UI
    recipes.slice(start, end).forEach(recipe => {
        const markup = 
        `
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
        </li>
        `
        elements.recipeList.insertAdjacentHTML("beforeend", markup)
    });
    // Render pagination button
    renderButtons(curPage, recipes.length, recipesPerPage);
};