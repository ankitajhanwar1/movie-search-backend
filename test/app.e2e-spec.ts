import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import nock from 'nock';
import superTest from 'supertest';
import { AppModule } from './../src/app.module';
import { of } from 'rxjs';
import { response } from 'express';
//import { esClient } from '../src/elasticsearch/elasticsearch';

jest.mock('../src/elasticsearch/elasticsearch', () => ({
  esClient: {
    ping: jest.fn().mockResolvedValue(true),
    indices: {
      exists: jest.fn().mockResolvedValue(false),
      create: jest.fn().mockResolvedValue({ acknowledged: true }),
    },
    index: jest.fn().mockResolvedValue({}),
    search: jest.fn().mockResolvedValue({
      hits: {
        hits: [
          {
            _source: {
              "Title": "New Space Adventures",
              "Year": "2020–",
              "imdbID": "tt13581058",
              "Type": "series",
              "Poster": "https://m.media-amazon.com/images/M/MV5BMDZkYzgxYjktNzdhMS00MjIzLTlhODgtNDY0YmM1NmIxM2FjXkEyXkFqcGdeQXVyMTgyODg2Mjg@._V1_SX300.jpg",
              "Director": "N/A",
              "Plot": "New Space Adventures will closely explore several of the greatest mysteries in space. From planets and moons, to deep space, New Space Adventures will bring viewers further than ever before into the great unknown. New information,...",
              "imdbRating": "N/A"
            },
          },
        ],
      },
    }),
  },
}));

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    nock('http://www.omdbapi.com/')
      .get('/?apikey=71ba312d&s=space&y=2020&page=1')
      .reply(200, {
  
          "Search": [
            {
              "Title": "New Space Adventures",
              "Year": "2020–",
              "imdbID": "tt13581058",
              "Type": "series",
              "Poster": "https://m.media-amazon.com/images/M/MV5BMDZkYzgxYjktNzdhMS00MjIzLTlhODgtNDY0YmM1NmIxM2FjXkEyXkFqcGdeQXVyMTgyODg2Mjg@._V1_SX300.jpg",

            }
          ],
          "totalResults": 1
        }
      );

    nock('http://www.omdbapi.com/')
      .get('/?apikey=71ba312d&i=tt13581058')
      .reply(200, {

          "Title": "New Space Adventures",
          "Year": "2020–",
          "imdbID": "tt13581058",
          "Type": "series",
          "Poster": "https://m.media-amazon.com/images/M/MV5BMDZkYzgxYjktNzdhMS00MjIzLTlhODgtNDY0YmM1NmIxM2FjXkEyXkFqcGdeQXVyMTgyODg2Mjg@._V1_SX300.jpg",
          "Director": "N/A",
          "Plot": "New Space Adventures will closely explore several of the greatest mysteries in space. From planets and moons, to deep space, New Space Adventures will bring viewers further than ever before into the great unknown. New information,...",
          "imdbRating": "N/A"
        }
      );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3002);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get /movies should return movies from Elasticsearch successfully', async () => {

    const response = await superTest(app.getHttpServer())
      .get('/movies')
      .expect(200);

      expect(response.body).toEqual([
        {
          "Title": "New Space Adventures",
          "Year": "2020–",
          "imdbID": "tt13581058",
          "Type": "series",
          "Poster": "https://m.media-amazon.com/images/M/MV5BMDZkYzgxYjktNzdhMS00MjIzLTlhODgtNDY0YmM1NmIxM2FjXkEyXkFqcGdeQXVyMTgyODg2Mjg@._V1_SX300.jpg",
          "Director": "N/A",
          "Plot": "New Space Adventures will closely explore several of the greatest mysteries in space. From planets and moons, to deep space, New Space Adventures will bring viewers further than ever before into the great unknown. New information,...",
          "imdbRating": "N/A"
        }
      ])

  });

  it('Search movies as per the search query from Elasticsearch', async () => {

    const response = await superTest(app.getHttpServer())
      .get('/movies/search')
      .query({ searchText: 'new' })
      .expect(200);

      expect(response.body).toEqual([
        {
          "Title": "New Space Adventures",
          "Year": "2020–",
          "imdbID": "tt13581058",
          "Type": "series",
          "Poster": "https://m.media-amazon.com/images/M/MV5BMDZkYzgxYjktNzdhMS00MjIzLTlhODgtNDY0YmM1NmIxM2FjXkEyXkFqcGdeQXVyMTgyODg2Mjg@._V1_SX300.jpg",
          "Director": "N/A",
          "Plot": "New Space Adventures will closely explore several of the greatest mysteries in space. From planets and moons, to deep space, New Space Adventures will bring viewers further than ever before into the great unknown. New information,...",
          "imdbRating": "N/A"
        }
      ])

  });
});
