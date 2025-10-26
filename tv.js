// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const tvQuery = queryObj.query;

// DOM elements
const idInput = document.getElementById("search-input");
const findButton = document.getElementById("search-button");
const cardsContainer = document.getElementById("cards-container");
const resultsInfo = document.getElementById("results-info");
const pagesContainer = document.getElementById("pages-container");
const currentPageSpan = document.getElementById("current-page");
const totalPagesSpan = document.getElementById("total-pages");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

// State variables
let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = tvQuery || "";
let isSearchMode = !!tvQuery;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial search input value
    if (tvQuery) {
        idInput.value = decodeURIComponent(tvQuery);
    }
    
    // Load initial content
    loadTv();
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
        loadTv(1);
    } else {
        // Clear search - show popular shows
        window.history.pushState({}, '', window.location.pathname);
        currentSearchTerm = "";
        isSearchMode = false;
        loadTv(1);
    }
});

// Allow Enter key to trigger search
idInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        findButton.click();
    }
});

// Load shows based on current state
async function loadTv(page = 1) {    
    let result;
    if (isSearchMode && currentSearchTerm) {
        result = await tvSearch(currentSearchTerm, page);
    } else {
        result = await tvPopular(page);
    }
    currentPage = result.page;
    totalPages = result.total_pages;
    displayShows(result.results);
    updatePage();
    updateResultsInfo(result);
}

// Display shows in cards
function displayShows(shows) {
    cardsContainer.innerHTML = '';
    
    shows.forEach(show => {
        const card = createTvCard(show);
        cardsContainer.appendChild(card);
    });
}

// Create a tv card element
function createTvCard(show) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.addEventListener('click', () => {
        window.location.href = `series.html?id=${show.id}`;
    });
    
    const posterPath = `${imgUrl}w300${show.poster_path}`;
    const firstAired = new Date(show.first_air_date).toLocaleDateString();
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${posterPath}" alt="${show.name}" loading="lazy">
        </div>
        <div class="card-content">
            <h3 class="card-title">${show.name}</h3>
            <p class="card-date">First Aired: ${firstAired}</p>
            <div class="card-rating">
                <span class="material-symbols-outlined">star</span>
                <span class="rating-value">${show.vote_average.toFixed(1)}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Update page controls
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
        : 'popular shows';

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
    loadTv(currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

nextButton.addEventListener('click', () => {
    loadTv(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});