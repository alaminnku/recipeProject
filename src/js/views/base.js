// All DOM elements
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    recipeList: document.querySelector('.results__list'),
    searchReults: document.querySelector('.results'),
    resultsPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
};

// Render the loader on UI
export const renderLoader = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader)
};

// Clear the loader
export const clearLoader = () => {
    const loader = document.querySelector('.loader');
    if(loader) {
        // Go up to the parent element and then remove the loader
        loader.parentElement.removeChild(loader);
    }
};