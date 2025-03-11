import { movieData } from "../mockData/movieMockData";
import { MovieDetail } from "./movieDetail.entity";

describe('Movie detail Entity', () => {
  it('should create instance of MovieDetail successfully', () => {
    const movie = new MovieDetail(movieData);
    expect(movie).toEqual(movieData);
  });

  it('should create instance of MovieDetail successfully with partial data', () => {
    const partialMovieData = {};
    const movie = new MovieDetail(partialMovieData);
    expect(movie.Director).toEqual('');
    expect(movie.Plot).toEqual('');
    expect(movie.Poster).toEqual('');
    expect(movie.Title).toEqual('');
    expect(movie.Type).toEqual('');
    expect(movie.Year).toEqual('');
    expect(movie.imdbID).toEqual('');
    expect(movie.imdbRating).toEqual('');
  });
});