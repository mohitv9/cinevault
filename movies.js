// ============================================================
//  CineVault — Movie Database
//  Edit this file to add, remove, or update movies.
//  All pages (index, browse, movie, watch) read from here.
// ============================================================

const MOVIES = [

  // ============================================================
  //  YOUR FILM — Kahika 1
  // ============================================================
  {
    id: "kahika-1",
    title: "Kahika 1",
    year: 2024,
    runtime: 95,
    rating: 7.5,
    genres: ["Drama", "Documentary", "Travel"],
    director: "Xplorer Guru",
    cast: ["Xplorer Guru"],
    language: "English",
    country: "Australia",
    license: "All rights reserved",
    synopsis: "Join me as I travel from home to a rare local fair held only once every five years. Experience breathtaking mountain landscapes, meet incredible local people, and explore fascinating traditions, stories, and rituals that have been passed down through generations. This journey is all about discovering the culture, beauty, and spirit of the Himalayas.",
    poster: "images/kahika-1.jpg",
    videoType: "archive",
    videoId: "kahika-1",
    featured: true,    // shown in hero banner on home page
    trending: true,
  },

  // ============================================================
  //  PUBLIC DOMAIN FILMS
  // ============================================================
  {
    id: "the-general",
    title: "The General",
    year: 1926,
    runtime: 75,
    rating: 8.1,
    genres: ["Comedy", "Action"],
    director: "Buster Keaton & Clyde Bruckman",
    cast: ["Buster Keaton", "Marion Mack", "Glen Cavender"],
    language: "Silent (English intertitles)",
    country: "United States",
    license: "Public domain",
    synopsis: "During the Civil War, a Confederate train engineer chases Union spies who've stolen his beloved locomotive — and accidentally his girlfriend. Buster Keaton's masterpiece of physical comedy.",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/The_General_poster.jpg/400px-The_General_poster.jpg",
    videoType: "archive",
    videoId: "TheGeneral1926",
    featured: false,
    trending: true,
  },

  {
    id: "nosferatu",
    title: "Nosferatu",
    year: 1922,
    runtime: 94,
    rating: 7.9,
    genres: ["Horror"],
    director: "F.W. Murnau",
    cast: ["Max Schreck", "Gustav Botz", "Greta Schröder"],
    language: "Silent (German intertitles)",
    country: "Germany",
    license: "Public domain",
    synopsis: "The vampire Count Orlok travels from Transylvania to a German city, bringing plague and death in his wake. An expressionist masterpiece and the original vampire film.",
    poster: "",
    videoType: "archive",
    videoId: "Nosferatu_1922",
    featured: false,
    trending: true,
  },

  {
    id: "metropolis",
    title: "Metropolis",
    year: 1927,
    runtime: 153,
    rating: 8.3,
    genres: ["Sci-Fi", "Drama"],
    director: "Fritz Lang",
    cast: ["Brigitte Helm", "Alfred Abel", "Gustav Fröhlich"],
    language: "Silent (German intertitles)",
    country: "Germany",
    license: "Public domain",
    synopsis: "In a futuristic city sharply divided between the working class and the city planners, the son of the city's mastermind falls in love with a working class prophet who predicts the coming of a savior.",
    poster: "",
    videoType: "archive",
    videoId: "Metropolis_1927",
    featured: false,
    trending: true,
  },

  {
    id: "sherlock-jr",
    title: "Sherlock Jr.",
    year: 1924,
    runtime: 45,
    rating: 8.2,
    genres: ["Comedy"],
    director: "Buster Keaton",
    cast: ["Buster Keaton", "Kathryn McGuire", "Joe Keaton"],
    language: "Silent (English intertitles)",
    country: "United States",
    license: "Public domain",
    synopsis: "A film projectionist who longs to be a detective dreams himself into the movie he's showing, where he gets the chance to solve a robbery.",
    poster: "",
    videoType: "archive",
    videoId: "SherlockJr1924",
    featured: false,
    trending: true,
  },

  {
    id: "the-kid",
    title: "The Kid",
    year: 1921,
    runtime: 68,
    rating: 8.3,
    genres: ["Drama", "Comedy"],
    director: "Charlie Chaplin",
    cast: ["Charlie Chaplin", "Jackie Coogan", "Edna Purviance"],
    language: "Silent (English intertitles)",
    country: "United States",
    license: "Public domain",
    synopsis: "The Tramp cares for an abandoned child, but when the authorities finally discover the child, he risks losing the boy he has raised as his own.",
    poster: "",
    videoType: "archive",
    videoId: "TheKid1921Chaplin",
    featured: false,
    trending: true,
  },

  {
    id: "his-girl-friday",
    title: "His Girl Friday",
    year: 1940,
    runtime: 92,
    rating: 7.8,
    genres: ["Comedy", "Romance"],
    director: "Howard Hawks",
    cast: ["Cary Grant", "Rosalind Russell", "Ralph Bellamy"],
    language: "English",
    country: "United States",
    license: "Public domain",
    synopsis: "A newspaper editor uses every trick in the book to keep his ace reporter ex-wife from remarrying and leaving the business.",
    poster: "",
    videoType: "archive",
    videoId: "HisGirlFriday1940",
    featured: false,
    trending: false,
  },

  // ============================================================
  //  ADD MORE MOVIES HERE — copy this block:
  // ============================================================
  /*
  {
    id: "your-movie-id",
    title: "Your Movie Title",
    year: 2024,
    runtime: 90,
    rating: 7.5,
    genres: ["Drama"],
    director: "Director Name",
    cast: ["Actor 1", "Actor 2"],
    language: "English",
    country: "Australia",
    license: "All rights reserved",
    synopsis: "Your description here.",
    poster: "images/your-poster.jpg",   // local file in images/ folder
    videoType: "archive",
    videoId: "your-archive-identifier",
    featured: false,
    trending: true,
  },
  */
];

// ============================================================
//  Helper functions — do not edit below this line
// ============================================================

function getMovieById(id) {
  return MOVIES.find(m => m.id === id) || null;
}

function getFeaturedMovie() {
  return MOVIES.find(m => m.featured) || MOVIES[0];
}

function getTrendingMovies() {
  return MOVIES.filter(m => m.trending);
}

function getRelatedMovies(movie, count = 4) {
  return MOVIES
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, count);
}

function buildEmbedUrl(movie) {
  if (movie.videoType === "youtube") {
    return `https://www.youtube.com/embed/${movie.videoId}?rel=0&modestbranding=1`;
  }
  if (movie.videoType === "archive") {
    return `https://archive.org/embed/${movie.videoId}`;
  }
  return null;
}

function getMovieUrl(movie) {
  return `movie.html?id=${movie.id}`;
}

function getWatchUrl(movie) {
  return `watch.html?id=${movie.id}`;
}

function renderStars(rating) {
  return `★ ${rating.toFixed(1)}`;
}

function renderRuntime(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
