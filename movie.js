// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const movieId = queryObj.id;

const idInput = document.getElementById("url-text");
const findButton = document.getElementById("image-button");
const movieTitle = document.getElementById("movie-title");
const releaseDate = document.getElementById("release-date");
const movieOverview = document.getElementById("overview");
const runtime = document.getElementById("runtime");
const voteAverage = document.getElementById("vote-average");
const imageCarouselContainer = document.getElementById("image-carousel-container");

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Format runtime
function formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Create image carousel
function createImageCarousel(images) {
    let displayImages = [...images];
    const minImages = 12; 
    while (displayImages.length < minImages) {
        displayImages = [...displayImages, ...images];
    }

    const imageElements = displayImages.map(image => `
        <div class="carousel-image">
            <img src="${imgUrl}w500${image.file_path}" alt="Movie poster">
        </div>
    `).join('');

    return `
        <div id="image-carousel-track">
            ${imageElements}
        </div>
    `;
}

// Create credits grid function
function createCreditsGrid(credits) {
    let creditElements = '';
    
    for (let i = 0; i < Math.min(credits.length, 20); i++) {
        const credit = credits[i];
        const profilePath = credit.profile_path ? `${imgUrl}w500${credit.profile_path}` : null;
        
        creditElements += `
            <div class="credit-card" onclick="goToPersonPage(${credit.id})">
                <div class="credit-image">
                    ${profilePath ? 
                        `<img src="${profilePath}" alt="${credit.name}">` : 
                        '<span class="material-symbols-outlined no-image">person</span>'
                    }
                </div>
                <div class="credit-info">
                    <div class="credit-name">${credit.name}</div>
                    <div class="credit-character">${credit.character}</div>
                </div>
            </div>
        `;
    }
    
    return `<div class="credits-grid">${creditElements}</div>`;
}

// Helper funtion to change to person page
function goToPersonPage(id) {
    window.location.href = `person.html?id=${id}`;
}

// Creates the page elements when loaded
document.addEventListener('DOMContentLoaded', async () => {
    const movie = await movieDetails(movieId);

    movieTitle.innerHTML = `${movie.title}`;
    releaseDate.innerText = `${formatDate(movie.release_date)}`;
    movieOverview.innerHTML = `${movie.overview}`;
    runtime.innerText = `${formatRuntime(movie.runtime)}`;
    voteAverage.innerHTML = `<span class="material-symbols-outlined">star</span><span id="rating">${movie.vote_average.toFixed(1)}</span>`;

    const imagesData = await movieImages(movieId);
    const posterImages = imagesData.posters
    imageCarouselContainer.innerHTML = createImageCarousel(posterImages)

    const creditsData = await movieCredits(movieId);
    const cast = creditsData.cast;
    document.getElementById('cast-container').innerHTML = createCreditsGrid(cast);
});

