import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";
import { dataFetchURL, OMDb_API_KEY, searchTitleWord, searchYear } from "./../../../constants";
import { MovieDetail } from "../../entity/movieDetail.entity";

@Injectable()
export class MovieExternalService {

  async getMovies(pageCount: number) {
    try {
      const searchMoviesURL = `${dataFetchURL}?apikey=${OMDb_API_KEY}&s=${searchTitleWord}&y=${searchYear}&page=${pageCount}`;
      const response = await axios.get(searchMoviesURL);
      return response.data;
    }
    catch (ex) {
      console.error(`Error fetching movies: ${ex.message}`);
      throw new BadRequestException(`Failed to fetch movies.`);
    }
  }

  async getAdditionalMovieDetails(movie: MovieDetail) {
    if (!movie?.imdbID) {
      throw new BadRequestException('Invalid movie data. IMDb ID is required.');
    }
    try {
      const MovieByIDURL = `${dataFetchURL}?apikey=${OMDb_API_KEY}&i=${movie.imdbID}`;
      const { data: movieData } = await axios.get(MovieByIDURL);

      const response = {
        ...movie,
        Director: movieData.Director,
        Plot: movieData.Plot,
        imdbRating: movieData.imdbRating
      } as MovieDetail;
      return response;
    }
    catch (ex) {
      console.error(`Error while getting movie data for movie : ${movie.Title} and IMDb Id : ${movie.imdbID}`, ex.message);
      throw new BadRequestException(`Failed to get the movie details: ${movie.imdbID} ${movie.Title}`);
    }
  }
}