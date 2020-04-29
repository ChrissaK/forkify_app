import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/** 
 * SEARCH Controller 
 */
const controlSearch = async () => {
    //1. Get query from view
    // const query = 'pizza'; //TODO
    const query = searchView.getInput(); 

    if (query) {
        //2. New search object and add to state object
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //4. Search for recipes
            await state.search.getResults();

            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            alert('Something went wrong with the search...');
            clearLoader();
        }

        
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//for TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); //closest method finds closest ancestor with the class
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); //get data-goto value
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);   
    }
});

/**
 * RECIPE Controller 
 */
const controlRecipe = async () => {
    // Get ID from the url
    const id = window.location.hash.replace('#','');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        // Create new recipe object
        state.recipe = new Recipe(id);

        // TESTING
        // window.r = state.recipe;

        try {
            // Get recipe data & parse ingredients (load recipe data in the background, getRecipe is async so will return a Promise)
            await state.recipe.getRecipe(); 
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            alert('Error processing recipe :(')
        }


        

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

