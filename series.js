// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const seriesId = queryObj.id;

const idInput = document.getElementById("url-text");
const findButton = document.getElementById("image-button");
const seriesTitle = document.getElementById("series-title");
const seriesOverview = document.getElementById("overview");
const yearsRunning = document.getElementById("years-running");
const numberOfSeasons = document.getElementById("number-of-seasons");
const numberOfEpisodes = document.getElementById("number-of-episodes");
const voteAverage = document.getElementById("vote-average");
const imageScrollContainer = document.getElementById("image-scroll-container");
const pagesContainer = document.getElementById("pages-container");
const currentPageSpan = document.getElementById("current-page");
const totalPagesSpan = document.getElementById("total-pages");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

// State variables
let currentPage = 1;
let totalPages = 1;
let seriesImages = [];
let currentOffset = 0;

// Create image scroller
function createImageScroller(images) {
    if (!images || images.length === 0) {
        return '<div class="no-images">No images available</div>';
    } else {
        seriesImages = images;
        totalPages = images.length;
        currentPage = 1;
        updatePage();

        let displayImages = [...images];
        const imageElements = displayImages.map(image => `
            <div class="gallery-image">
                <img src="${imgUrl}w500${image.file_path}" alt="Series poster">
            </div>
        `).join('');

        return `
            <div id="image-scroll-track">
                ${imageElements}
            </div>
        `;
    }
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

// Pages event listeners
prevButton.addEventListener('click', () => {
    currentPage -= 1;
    currentOffset += 500;
    document.getElementById('image-scroll-track').style.transform = `translateX(${currentOffset}px)`;
    updatePage();
});

nextButton.addEventListener('click', () => {
    currentPage += 1;
    currentOffset -= 500;
    document.getElementById('image-scroll-track').style.transform = `translateX(${currentOffset}px)`;
    updatePage();
});

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
    const series = await tvDetails(seriesId);

    // Set up title
    seriesTitle.innerHTML = `${series.name}`;

    // Set years running
    const startYear = new Date(series.first_air_date).getFullYear();
    const endYear = series.last_air_date ? 
        new Date(series.last_air_date).getFullYear() : 
        (series.in_production ? 'Present' : startYear);
    yearsRunning.innerHTML = `${startYear}${startYear !== endYear ? '-' + endYear : ''}`;
    
    // Set number of seasons and episodes
    numberOfSeasons.innerHTML = `${series.number_of_seasons} Season${series.number_of_seasons !== 1 ? 's' : ''}`;
    numberOfEpisodes.innerHTML = `${series.number_of_episodes} Episode${series.number_of_episodes !== 1 ? 's' : ''}`;
    
    // Set overview and vote
    seriesOverview.innerHTML = `${series.overview}`;
    voteAverage.innerHTML = `<span class="material-symbols-outlined">star</span><span id="rating">${series.vote_average.toFixed(1)}</span>`;

    // Set up images
    const imagesData = await tvImages(seriesId);
    const posterImages = imagesData.posters
    imageScrollContainer.innerHTML = createImageScroller(posterImages)

    // Set up credits
    const creditsData = await tvCredits(seriesId);
    const cast = creditsData.cast;
    document.getElementById('cast-container').innerHTML = createCreditsGrid(cast);
});