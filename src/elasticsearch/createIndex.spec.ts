import { createIndex } from "./createIndex";
import { esClient } from "./elasticsearch";

jest.mock('./elasticsearch', () => ({
    esClient: {
        ping: jest.fn(),
        indices: {
            exists: jest.fn(),
            create: jest.fn(),
        }
    },
}));

jest.setTimeout(20000);

describe('ElasticSearch createIndex service', () => {
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        (esClient.ping as jest.Mock).mockResolvedValue(undefined);
        (esClient.indices.exists as jest.Mock).mockResolvedValue(false);
        (esClient.indices.create as jest.Mock).mockResolvedValue({});
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should create index in ES successfully', async () => {
        const indexCreationResult = await createIndex();
        expect(indexCreationResult).toBeUndefined();
        expect(esClient.ping).toHaveBeenCalled();
        expect(esClient.indices.exists).toHaveBeenCalledWith({ index: "movies" });
        expect(esClient.indices.create).toHaveBeenCalled();
    }, 20000);
});