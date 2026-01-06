// API key is loaded from config.js - see config.template.js for setup
// const apiKey is defined in config.js

// Base URL
const api = "https://api.themoviedb.org/3/";

// Image URL
// Read docs here to get full info: https://developer.themoviedb.org/docs/image-basics
const imgUrl = "https://image.tmdb.org/t/p/";


// Don't need to touch this
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    }
};

// This is a generic API call that will customize based on the parameters
// The query needs to be a string that includes '&' to separate parameters
async function makeAPICall(urlExtension, query) {
    const newURL = `${api}${urlExtension}?api_key=${apiKey}&${query}`;
    const result = await fetch(newURL, options);
    return result.json();
}

// Function to get popular movies
async function moviePopular(page) {
    const pageNum = page || 1;
    const urlExtension = "movie/popular";
    const requiredQuery = `language=en-US&page=${pageNum}`;

    return await makeAPICall(urlExtension, `${requiredQuery}`);
}

// Function to get popular people
async function peoplePopular(page) {
    const pageNum = page || 1;
    const urlExtension = "person/popular";
    const requiredQuery = `language=en-US&page=${pageNum}`;

    return await makeAPICall(urlExtension, `${requiredQuery}`);
}

// Function to get trending tv shows
async function tvPopular(page) {
    const pageNum = page || 1;
    const urlExtension = "tv/popular";
    const requiredQuery = `language=en-US&page=${pageNum}`;

    const res1 = await makeAPICall(urlExtension, `${requiredQuery}`);
    return res1;
}

// Function to get details for the specific movie
async function movieDetails(movieId) {
    const urlExtension = `movie/${movieId}`;
    const requiredQuery = "language=en-US";

    const res1 = await makeAPICall(urlExtension, `${requiredQuery}`);
    return res1;
}

// Function to get list of images for the movie
async function movieImages(movieId) {
    const urlExtension = `movie/${movieId}/images`;

    return await makeAPICall(urlExtension, "");
}

// Function for searching for movies
async function movieSearch(searchTerm, page) {
    const pageNum = page || 1;
    const urlExtension = "search/movie";
    const requiredQuery = `include_adult=false&language=en-US&page=${pageNum}`;
    const query = `query=${searchTerm}`;

    return await makeAPICall(urlExtension, `${requiredQuery}&${query}`);
}

// Function for searching for people
async function peopleSearch(searchTerm, page) {
    const pageNum = page || 1;
    const urlExtension = "search/person";
    const requiredQuery = `include_adult=false&language=en-US&page=${pageNum}`;
    const query = `query=${searchTerm}`;

    return await makeAPICall(urlExtension, `${requiredQuery}&${query}`);
}

// Function for searching for tv show
async function tvSearch(searchTerm, page) {
    const pageNum = page || 1;
    const urlExtension = "search/tv";
    const requiredQuery = `include_adult=false&language=en-US&page=${pageNum}`;
    const query = `query=${searchTerm}`;

    return await makeAPICall(urlExtension, `${requiredQuery}&${query}`);
}

// Function to get details for the specific person
async function personDetails(personId) {
    const urlExtension = `person/${personId}`;
    const requiredQuery = "language=en-US";

    return await makeAPICall(urlExtension, `${requiredQuery}`);
}

// Function to get list of images for a person
async function personImages(personId) {
    const urlExtension = `person/${personId}/images`;

    return await makeAPICall(urlExtension, "");
}

// Function to get details for the specific tv show
async function tvDetails(tvId) {
    const urlExtension = `tv/${tvId}`;
    const requiredQuery = "language=en-US";

    return await makeAPICall(urlExtension, `${requiredQuery}`);
}

// Function to get list of images for the movie
async function tvImages(seriesId) {
    const urlExtension = `tv/${seriesId}/images`;

    const res1 = await makeAPICall(urlExtension, "");
    return res1;
}

// Function to get list of credits for the movie
async function movieCredits(movieId) {
    const urlExtension = `movie/${movieId}/credits`;
    const requiredQuery = "language=en-US";
    return await makeAPICall(urlExtension, requiredQuery);
}

// Function to get list of credits for the series
async function tvCredits(seriesId) {
    const urlExtension = `tv/${seriesId}/credits`;
    const requiredQuery = "language=en-US";
    return await makeAPICall(urlExtension, requiredQuery);
}

// Function to get combined credits for a person
async function personCombinedCredits(personId) {
    const urlExtension = `person/${personId}/combined_credits`;
    const requiredQuery = "language=en-US";
    return await makeAPICall(urlExtension, requiredQuery);
}

// Utility function to process a query string into a JSON object
function queryStringToJson(queryString) {
    // Remove the leading '?'
    if (queryString.startsWith("?")) {
        queryString = queryString.substring(1);
    }
    // Split the query string up into an array
    const pairs = queryString.split('&');

    // Reduce into an object of key value pairs
    const result = pairs.reduce((acc, pair) => {
        const queryPair = pair.split("=");
        acc[queryPair[0]] = queryPair[1];
        return acc;
    }, {});

    return result;
}

