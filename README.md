# MovieDB

A web application for browsing and searching movies, TV shows, and actors using The Movie Database (TMDB) API. Built with JavaScript, HTML, and CSS.

## Features

- Search across movies, TV shows, and people
- Browse popular and trending content
- View detailed information pages with cast, ratings, and synopsis
- Responsive design with mobile-friendly navigation
- Paginated results for easy browsing

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **API**: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Fonts**: Bebas Neue, DM Sans, Space Grotesk
- **Icons**: Google Material Symbols

## Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/moviedb.git
cd moviedb
```

2. **Configure API Key**
   
   Get your free API key from [TMDB](https://www.themoviedb.org/settings/api), then:
   ```bash
   cp config.template.js config.js
   ```
   
   Open `config.js` and add your API key:
   ```javascript
   const apiKey = "your_actual_api_key_here";
   ```

3. **Run locally**
   
   Open `index.html` in your browser, or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```
   
   Navigate to `http://localhost:8000`

## API Configuration

This project uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api).

**⚠️ Important: The API key is NOT included in this repository for security reasons.**

### Setup Instructions:

1. Get your free API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Copy `config.template.js` to create `config.js`:
```bash
cp config.template.js config.js
```
3. Project Structure

```
moviedb/
├── *.html              # Page templates (index, movies, tv, people, etc.)
├── *.js                # Page-specific logic and API integration
├── api.js              # TMDB API wrapper functions
├── util.js             # Shared utilities (menu, query parsing)
├── styling.css         # Application styles
├── config.template.js  # API key template (safe to commit)
├── config.js           # Your API key (gitignored)
└── Bebas_Neue,DM_Sans,Space_Grotesk/  # Custom fonts
```

## Security Note

⚠️ **API keys are not committed to this repository.** The `config.js` file containing your API key is listed in `.gitignore` to prevent accidental exposure. Use `config.template.js` as a reference for setup.

## Acknowledgments

Built as a CS2410 Final Project. Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)