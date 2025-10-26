// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const peopleQuery = queryObj.query;

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
let currentSearchTerm = peopleQuery || "";
let isSearchMode = !!peopleQuery;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial search input value
    if (peopleQuery) {
        idInput.value = decodeURIComponent(peopleQuery);
    }
    
    // Load initial content
    loadPeople();
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
        loadPeople(1);
    } else {
        // Clear search - show popular people
        window.history.pushState({}, '', window.location.pathname);
        currentSearchTerm = "";
        isSearchMode = false;
        loadPeople(1);
    }
});

// Allow Enter key to trigger search
idInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        findButton.click();
    }
});

// Load people based on current state
async function loadPeople(page = 1) {    
    let result;
    if (isSearchMode && currentSearchTerm) {
        result = await peopleSearch(currentSearchTerm, page);
    } else {
        result = await peoplePopular(page);
    }
    currentPage = result.page;
    totalPages = result.total_pages;
    displayPeople(result.results);
    updatePage();
    updateResultsInfo(result);
}

// Display people in cards
function displayPeople(people) {
    cardsContainer.innerHTML = '';
    
    people.forEach(person => {
        const card = createPersonCard(person);
        cardsContainer.appendChild(card);
    });
}

// Create a person card element
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.addEventListener('click', () => {
        window.location.href = `person.html?id=${person.id}`;
    });
    
    const profilePath = `${imgUrl}w300${person.profile_path}`;
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${profilePath}" alt="${person.name}" loading="lazy">
        </div>
        <div class="card-content">
            <h3 class="card-title">${person.name}</h3>
            <p class="card-profession">${person.known_for_department || 'Actor/Actress'}</p>
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
        : 'popular people';

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
    loadPeople(currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

nextButton.addEventListener('click', () => {
    loadPeople(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});