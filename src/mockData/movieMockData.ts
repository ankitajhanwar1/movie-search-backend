import { MovieDetail } from "../entity/movieDetail.entity";

export const movieData = {
    "Title": "Black Space",
    "Year": "2020–",
    "imdbID": "tt13660638",
    "Type": "series",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNzAxMzhkZTUtMzRmYS00YTkzLTg4ODctNjhmNGIzNTM4MmU3XkEyXkFqcGc@._V1_SX300.jpg",
    "Director": "N/A",
    "Plot": "An ordinary morning at a small-town High School turns into a nightmare when anonymous figures in masks have committed a massacre leaving four dead students.",
    "imdbRating": "6.7"
};

export const moviesMockData: MovieDetail[] = [movieData];

export const moviesInitialMockData = {
    "Search": [
        {
            "Title": "Black Space",
            "Year": "2020–",
            "imdbID": "tt13660638",
            "Type": "series",
            "Poster": "https://m.media-amazon.com/images/M/MV5BNzAxMzhkZTUtMzRmYS00YTkzLTg4ODctNjhmNGIzNTM4MmU3XkEyXkFqcGc@._V1_SX300.jpg"
        }
    ]
};