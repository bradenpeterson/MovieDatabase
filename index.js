const searchInput = document.getElementById("search-input");
const movieButton = document.getElementById("movie-button");
const tvButton = document.getElementById("tv-button");
const personButton = document.getElementById("person-button");

// Navigate with a query string
function searchEventListeners(element) {
    element.addEventListener("click", e => {
        console.log(searchInput.value);
        e.preventDefault();
        window.location.href = `${element.href}?query=${searchInput.value}`;
    })
}

// Add the listener to each anchor button
searchEventListeners(movieButton);
searchEventListeners(tvButton);
searchEventListeners(personButton);

// Allow Enter key to trigger search
searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        document.getElementById('search-button').click();
    }
});

// Function to create movie cards
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'content-card';
    
    const posterPath = `${imgUrl}w300${movie.poster_path}`;
    const releaseYear = new Date(movie.release_date).getFullYear();
    
    movieCard.innerHTML = `
        <div class="card-image">
            <img src="${posterPath}" alt="${movie.title}" loading="lazy">
        </div>
        <div class="card-content">
            <h3 class="card-title">${movie.title}</h3>
            <p class="card-year">${releaseYear}</p>
            <div class="card-rating">
                <span class="material-symbols-outlined">star</span>
                <span class="rating-value">${movie.vote_average.toFixed(1)}</span>
            </div>
        </div>
    `;

    movieCard.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.id}`;
    });
    
    return movieCard;
}

// Function to create TV show cards
function createTVCard(show) {
    const tvCard = document.createElement('div');
    tvCard.className = 'content-card';
    
    const posterPath = `${imgUrl}w300${show.poster_path}`;
    const firstAired = new Date(show.first_air_date).toLocaleDateString();
    
    tvCard.innerHTML = `
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

    tvCard.addEventListener('click', () => {
        window.location.href = `series.html?id=${show.id}`;
    });
    
    return tvCard;
}

// Function to create person cards
function createPersonCard(person) {
    const personCard = document.createElement('div');
    personCard.className = 'content-card';
    
    const profilePath = `${imgUrl}w300${person.profile_path}`;
    
    personCard.innerHTML = `
        <div class="card-image">
            <img src="${profilePath}" alt="${person.name}" loading="lazy">
        </div>
        <div class="card-content">
            <h3 class="card-title">${person.name}</h3>
            <p class="card-profession">${person.known_for_department || 'Actor/Actress'}</p>
        </div>
    `;

    personCard.addEventListener('click', () => {
        window.location.href = `person.html?id=${person.id}`;
    });
    
    return personCard;
}

// Function to display cards in a section
function displayCards(sectionId, cards) {
    const section = document.getElementById(sectionId);
    
    // Remove existing cards container if it exists
    const existingContainer = section.querySelector('.cards-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create new cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';
    
    // Add cards to container
    cards.forEach(card => {
        cardsContainer.appendChild(card);
    });
    
    // Append container to section
    section.appendChild(cardsContainer);
}

// Load and display popular movies
moviePopular()
    .then(result => {
        const movieCards = result.results.slice(0, 6).map(movie => createMovieCard(movie));
        displayCards('movie-section', movieCards);
    })
    .catch(error => console.log('Movie error:', error));

// Load and display popular TV shows
tvPopular()
    .then(result => {
        const tvCards = result.results.slice(0, 6).map(show => createTVCard(show));
        displayCards('tv-section', tvCards);
    })
    .catch(error => console.log('TV error:', error));

// Load and display popular people
peoplePopular()
    .then(result => {
        const personCards = result.results.slice(0, 6).map(person => createPersonCard(person));
        displayCards('people-section', personCards);
    })
    .catch(error => console.log('People error:', error));

// Search functionality
function searchMovies() {
    const query = document.getElementById('search-input').value;
    const mode = document.getElementById('search-mode').value;
    
    if (!query.trim()) {
        alert('Please enter a search term');
        return;
    }
    
    // Navigate to appropriate page with search query
    switch (mode) {
        case 'movie':
            window.location.href = `movies.html?query=${encodeURIComponent(query)}`;
            break;
        case 'tv':
            window.location.href = `tv.html?query=${encodeURIComponent(query)}`;
            break;
        case 'person':
            window.location.href = `people.html?query=${encodeURIComponent(query)}`;
            break;
        default:
            window.location.href = `movies.html?query=${encodeURIComponent(query)}`;
    }
}