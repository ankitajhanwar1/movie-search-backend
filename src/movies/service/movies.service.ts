import { Injectable } from '@nestjs/common';
import { MovieDetail } from '../../entity/movieDetail.entity';
import { storeDataInIndex, searchDataInIndex } from '../../elasticsearch/elasticsearchService';
import { MovieExternalService } from './movieExternal.service';

const FIRST_PAGE = 1;
const SEARCH_SIZE = 50;

@Injectable()
export class MoviesService {
  constructor(private readonly movieExternalService: MovieExternalService) { }

  async getAndStoreAllMovies() {
    let allMovies: MovieDetail[] = [];
    let pageCount = FIRST_PAGE;
    let totalResults = 0;
    try {
      while (totalResults === 0 ||allMovies.length < totalResults) {
        const moviesResponse = await this.movieExternalService.getMovies(pageCount);
        if (!moviesResponse?.Search) break;

        if (pageCount === FIRST_PAGE) {
          totalResults = Number(moviesResponse.totalResults);
        }
        allMovies.push(...moviesResponse.Search);
        pageCount++;
      }
      if (!allMovies.length) return [];

      const updatedMoviesDetail = await Promise.all(
        allMovies.map(movie => this.movieExternalService.getAdditionalMovieDetails(movie))
      );
      await Promise.all(updatedMoviesDetail.map(movie => storeDataInIndex(movie)));

      return updatedMoviesDetail;
    }
    catch (ex) {
      console.error(`Error fetching movies on page ${pageCount}:`, ex.message);
      return [];
    }
  }

  async searchMovie(searchText: string) {
    try {
      let searchResults: MovieDetail[] = []
      let hasMoreResults = true;
      let from = 0;
      let totalResults = 0;

      while (hasMoreResults) {
        const searchResponse = await searchDataInIndex(searchText, from, SEARCH_SIZE);
        let hits = searchResponse.hits;

        totalResults = typeof searchResponse.total === 'number'
          ? searchResponse.total
          : searchResponse.total?.value;
          
        if (!hits || hits.length === 0) {
          break;
        }
        searchResults.push(...hits.map((record) => record._source as MovieDetail));

        from += SEARCH_SIZE;
        hasMoreResults = from < totalResults;
      }
      return searchResults;
    }
    catch (ex) {
      console.error(`Error while getting the search results for query: ${searchText} ${ex}`);
      return [];
    }
  }
}
