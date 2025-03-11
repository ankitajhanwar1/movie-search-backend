import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MovieExternalService } from './movieExternal.service';
import { movieData, moviesInitialMockData, moviesMockData } from '../../mockData/movieMockData';
import * as elasticsearchService from '../../elasticsearch/elasticsearchService';

describe('MoviesService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  let service: MoviesService;
  let movieExternalService: MovieExternalService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService,
        {
          provide: MovieExternalService,
          useValue: {
            getMovies: jest.fn(),
            getAdditionalMovieDetails: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieExternalService = module.get<MovieExternalService>(MovieExternalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAndStoreAllMovies functionality', () => {
    it('should get movies from OMDb URL', async ()=> {
      jest.spyOn(movieExternalService,'getMovies').mockResolvedValue(moviesInitialMockData);
      jest.spyOn(movieExternalService,'getAdditionalMovieDetails').mockResolvedValue(movieData);
      jest.spyOn(elasticsearchService, 'storeDataInIndex').mockResolvedValue(undefined);
      await expect(service.getAndStoreAllMovies()).resolves.toEqual(moviesMockData);
    });

    it('should get no movies from OMDb URL', async ()=> {
      jest.spyOn(movieExternalService,'getMovies').mockResolvedValue([]);
      await expect(service.getAndStoreAllMovies()).resolves.toEqual([]);
    });

    it('error while get movies from OMDb URL', async ()=> {
      jest.spyOn(movieExternalService,'getMovies').mockRejectedValue('error');
      await expect(service.getAndStoreAllMovies()).resolves.toEqual([]);
    });
  });

  describe('searchMovie functionality', () => {
    it('should give movies as per the search text', async ()=> {
      jest.spyOn(elasticsearchService, 'searchDataInIndex').mockResolvedValue({
        total: 1,
        hits: [
          {
            "_index": "movies",
            "_id": "tt13581058",
            "_source": movieData
          }
        ]
      });
      await expect(service.searchMovie('space')).resolves.toEqual(moviesMockData);
    });

    it('No movies found as per the search text', async ()=> {
      jest.spyOn(elasticsearchService, 'searchDataInIndex').mockResolvedValue({
        total:{
          value:0,
          relation: "eq"
        },
        hits: []
      });
      await expect(service.searchMovie('space')).resolves.toEqual([]);
    });

    it('error while get movies from OMDb URL', async ()=> {
      jest.spyOn(elasticsearchService,'searchDataInIndex').mockRejectedValue(undefined);
      await expect(service.searchMovie('space')).resolves.toEqual([]);
    });
  });
});
