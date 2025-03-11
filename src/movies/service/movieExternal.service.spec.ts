import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { MovieExternalService } from './movieExternal.service';
import { movieData, moviesInitialMockData } from '../../mockData/movieMockData';

jest.mock('axios');

describe('MoviesService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  let movieExternalService: MovieExternalService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieExternalService],
    }).compile();

    movieExternalService = module.get<MovieExternalService>(MovieExternalService);
  });

  it('should be defined', () => {
    expect(movieExternalService).toBeDefined();
  });

  describe('getMovies functionality', () => {
    it('should get movies from OMDb URL', async ()=> {
      (axios.get as jest.Mock).mockResolvedValue({data: moviesInitialMockData});
      await expect(movieExternalService.getMovies(1)).resolves.toEqual(moviesInitialMockData);
    });

    it('error while get movies from OMDb URL', async ()=> {
      (axios.get as jest.Mock).mockRejectedValue('error');
      await expect(movieExternalService.getMovies(1)).rejects.toThrow(BadRequestException);
      await expect(movieExternalService.getMovies(1)).rejects.toThrow(`Failed to fetch movies.`);
    });
  });

  describe('getAdditionalMovieDetails functionality', () => {
    it('should get additional detail of the movie from OMDb URL', async ()=> {
      (axios.get as jest.Mock).mockResolvedValue({data: movieData});
      await expect(movieExternalService.getAdditionalMovieDetails(movieData)).resolves.toEqual(movieData);
    });

    it('error while getting additional detail of the movie from OMDb URL', async ()=> {
      (axios.get as jest.Mock).mockRejectedValue('error');
      await expect(movieExternalService.getAdditionalMovieDetails(movieData)).rejects.toThrow(BadRequestException);
      await expect(movieExternalService.getAdditionalMovieDetails(movieData)).rejects.toThrow(`Failed to get the movie details: ${movieData.imdbID} ${movieData.Title}`);
    });

    it('error while get additional movie details as no imdb ID present', async ()=> {
      const data = {
        Title: '',
        Year: '',
        imdbID: '',
        Type: '',
        Poster: '',
        Director: '',
        Plot: '',
        imdbRating: ''
      };
      (axios.get as jest.Mock).mockRejectedValue('error');
      await expect(movieExternalService.getAdditionalMovieDetails(data)).rejects.toThrow(BadRequestException);
      await expect(movieExternalService.getAdditionalMovieDetails(data)).rejects.toThrow(`Invalid movie data. IMDb ID is required.`);
    });
  });
});
