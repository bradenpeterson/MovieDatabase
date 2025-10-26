// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const personId = queryObj.id;

const idInput = document.getElementById("url-text");
const findButton = document.getElementById("image-button");
const personTitle = document.getElementById("persons-name");
const birthday = document.getElementById("birthday");
const deathdate = document.getElementById("deathdate");
const birthplace = document.getElementById("birthplace");
const biography = document.getElementById("biography");
const personImageContainer = document.getElementById("person-image-container");
const creditHistoryContainer = document.getElementById("credit-history-container");

// Create cards for the credits
function createCreditCard(credit) {
    const isMovie = credit.media_type === 'movie';
    const isTv = credit.media_type === 'tv';
    
    // Only show movie or tv credits
    if (!isMovie && !isTv) {
        return null;
    }

    // Assigns data
    const title = isMovie ? credit.title : credit.name;
    const releaseDate = isMovie ? credit.release_date : credit.first_air_date;
    const character = credit.character || 'N/A';
    const id = credit.id;

    // Gets image
    const posterPath = credit.poster_path;
    const posterImage = posterPath ? `${imgUrl}w500${posterPath}` : null;

    // Creates card
    const creditCard = document.createElement('div');
        creditCard.className = 'credit-card';

    // Add listener to navigate to movie or tv page
    creditCard.addEventListener('click', () => {
        if (isMovie) {
            window.location.href = `movie.html?id=${id}`;
        } else if (isTv) {
            window.location.href = `series.html?id=${id}`;
        }
    });

    creditCard.innerHTML = `
        <div class="credit-image">
            ${posterImage ? 
                `<img src="${posterImage}" alt="${title}">` : 
                `<span class="material-symbols-outlined no-image">${isMovie ? 'movie' : 'tv_gen'}</span>`
            }
        </div>
        <div class="credit-info">
            <div class="credit-name">${title}</div>
            <div class="credit-character">${character}</div>
            <div class="card-date">${formatDate(releaseDate)}</div>
        </div>
    `;
    
    return creditCard;
}

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

// Creates the page elements when loaded
document.addEventListener("DOMContentLoaded", async () => {
    const person = await personDetails(personId);

    // Sets up title
    personTitle.innerHTML = `${person.name}`;

    // Sets up birth, death, and biography
    birthday.innerHTML = `Born: ${formatDate(person.birthday)}`;
    deathdate.innerHTML = person.deathday ? `Died: ${formatDate(person.deathday)}` : '';
    birthplace.innerHTML = `${person.place_of_birth}`;
    biography.innerHTML = `${person.biography}`;

    // Sets up image
    const profilePath = person.profile_path ? `${imgUrl}w500${person.profile_path}` : null;
    personImageContainer.innerHTML = `
        ${profilePath ? 
            `<img src="${profilePath}" alt="${person.name}" id="person-image">` : 
            '<span class="material-symbols-outlined no-image" id="person-image">person</span>'
        }
    `;

    // Sets up credits section
    const combinedCredits = await personCombinedCredits(personId);
    const allCredits = [...(combinedCredits.cast || []), ...(combinedCredits.crew || [])];
    allCredits.forEach(credit => {
        const creditCard = createCreditCard(credit);
        creditHistoryContainer.appendChild(creditCard);
    });
});