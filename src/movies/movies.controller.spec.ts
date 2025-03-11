import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './service/movies.service';
import { moviesMockData } from '../mockData/movieMockData';
import { MovieExternalService } from './service/movieExternal.service';
import { BadRequestException } from '@nestjs/common';

describe('FetchMoviesController', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });

  let movieController: MoviesController;
  let movieService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers : [MoviesService, {
        provide: MovieExternalService,
        useValue: {}
      }]
    }).compile();

    movieController = module.get<MoviesController>(MoviesController);
    movieService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  it('should return all movies data', async () => {
    jest.spyOn(movieService, 'getAndStoreAllMovies').mockResolvedValue(moviesMockData);
    await expect(movieController.storeMovies()).resolves.toEqual(moviesMockData);
  });

  it('should return all movies data as per search', async () => {
    jest.spyOn(movieService, 'searchMovie').mockResolvedValue(moviesMockData);    
    await expect(movieController.searchMovie('space')).resolves.toEqual(moviesMockData);
  });

  it('should throw BadRequestException when searchText is missing', async () => {
    await expect(movieController.searchMovie('')).rejects.toThrow(BadRequestException);  
    await expect(movieController.searchMovie('')).rejects.toThrow('Search query is required');
  });
});
