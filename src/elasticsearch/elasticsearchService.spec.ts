import {storeDataInIndex, searchDataInIndex} from "./elasticsearchService";
import { movieData } from "../mockData/movieMockData";
import { esClient } from "./elasticsearch";

jest.mock('./elasticsearch', () => ({
    esClient: {
        index: jest.fn(),
        search: jest.fn(),
    },
}));

describe('ElaticSearch service', () => {
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
        (esClient.index as jest.Mock).mockResolvedValue({});
        (esClient.search as jest.Mock).mockResolvedValue({
            hits: {
                total: {
                    value: 1,
                    relation: "eq"
                },
                hits: [
                    {
                        _index: 'movies',
                        _id: 'tt11808138',
                        _source: movieData
                    }
                ]
            }
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should store data in ES index successfully', async () => {
        await expect(storeDataInIndex(movieData)).resolves.toBeUndefined();
        expect(esClient.index).toHaveBeenCalledWith({
            index: "movies",
            id: movieData.imdbID,
            document: movieData
        });
    });

    it('should handle error while storing data in ES index', async () => {
        (esClient.index as jest.Mock).mockRejectedValue(new Error('Elasticsearch error'));
        await expect(storeDataInIndex(movieData)).rejects.toThrow('Elasticsearch error');
        expect(esClient.index).toHaveBeenCalledWith({
            index: "movies",
            id: movieData.imdbID,
            document: movieData
        });
    });

    it('should search data in ES index successfully', async () => {
        await expect(searchDataInIndex('space', 1, 50)).resolves.toEqual({
                total: {
                    value: 1,
                    relation: "eq"
                },
                hits: [
                    {
                        _index: 'movies',
                        _id: 'tt11808138',
                        _source: movieData
                    }
                ]
            
        });
        expect(esClient.search).toHaveBeenCalledWith({
            index: "movies",
            query: {
                "query_string": {
                    "query": `*space*`,
                    "fields": [
                        "Title",
                        "Director",
                        "Plot"
                    ]
                }
            },
            from: 1,
            size: 50
        });
    });

    it('should handle error while searching data in ES index', async () => {
        (esClient.search as jest.Mock).mockRejectedValue(new Error('Elasticsearch error'));
        await expect(searchDataInIndex('space', 1, 50)).rejects.toThrow('Elasticsearch error');
        expect(esClient.search).toHaveBeenCalledWith({
            index: "movies",
            query: {
                "query_string": {
                    "query": `*space*`,
                    "fields": [
                        "Title",
                        "Director",
                        "Plot"
                    ]
                }
            },
            from: 1,
            size: 50
        });
    });
});