// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const movieQuery = queryObj.query;

// DOM elements
const idInput = document.getElementById("search-input");
const findButton = document.getElementById("search-button");
const cardsContainer = document.getElementById("cards-container");
const resultsInfo = document.getElementById("results-info");


// State variables
let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = movieQuery || "";
let isSearchMode = !!movieQuery;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial search input value
    if (movieQuery) {
        idInput.value = decodeURIComponent(movieQuery);
    }
    
    // Load initial content
    loadMovies();
});

// Navigate with a query String
findButton.addEventListener("click", e => {
    e.preventDefault();
    const searchValue = idInput.value.trim();
    if (searchValue) {
        // Update URL and perform search on current page
        const newUrl = `${window.location.pathname}?query=${encodeURIComponent(searchValue)}`;
        window.history.pushState({}, '', newUrl);
        
        // Update the page state and load search results
        currentSearchTerm = searchValue;
        isSearchMode = true;
        loadMovies(1);
    } else {
        // Clear search - show popular movies
        window.history.pushState({}, '', window.location.pathname);
        currentSearchTerm = "";
        isSearchMode = false;
        loadMovies(1);
    }
});

// Allow Enter key to trigger search
idInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        findButton.click();
    }
});

// Load movies based on current state
async function loadMovies(page = 1) {    
    let result;
    if (isSearchMode && currentSearchTerm) {
        result = await movieSearch(currentSearchTerm, page);
    } else {
        result = await moviePopular(page);
    }
    currentPage = result.page;
    totalPages = result.total_pages;
    displayMovies(result.results);
    updatePage();
    updateResultsInfo(result);
}

// Display movies in cards
function displayMovies(movies) {
    cardsContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        cardsContainer.appendChild(card);
    });
}

// Create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.id}`;
    });
    
    const posterPath = `${imgUrl}w500${movie.poster_path}`;
    
    const releaseYear = movie.release_date 
        ? new Date(movie.release_date).getFullYear() 
        : 'Unknown';
    
    const rating = movie.vote_average 
        ? movie.vote_average.toFixed(1) 
        : 'N/A';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${posterPath}" alt="${movie.title}">
        </div>
        <div class="card-content">
            <div class="card-title">${movie.title}</div>
            <div class="card-year">${releaseYear}</div>
            <div class="card-rating">
                <span class="material-symbols-outlined">star</span>
                <span class="rating-value">${rating}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Update pagination controls
function updatePage() {
    if (totalPages > 1) {
        pagesContainer.classList.remove('hidden');
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        
        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= totalPages;
    } else {
        pagesContainer.classList.add('hidden');
    }
}

// Update results information
function updateResultsInfo(result) {
    const totalResults = result.total_results || 0;
    const searchText = isSearchMode && currentSearchTerm 
        ? `search results for "${currentSearchTerm}"` 
        : 'popular movies';

    if (totalResults === 0){
        nextButton.disabled = true;
        prevButton.disabled = true;
    }
    
    resultsInfo.innerHTML = `
        <p>Showing ${searchText} - ${totalResults.toLocaleString()} total results</p>
    `;
}

// Pages event listeners
prevButton.addEventListener('click', () => {
    loadMovies(currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

nextButton.addEventListener('click', () => {
    loadMovies(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});