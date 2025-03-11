import { MovieDetail } from "../entity/movieDetail.entity";
import { esIndexName } from "../../constants"
import { esClient } from "./elasticsearch"

export const storeDataInIndex = async (movieData: MovieDetail) => {
    try {
        await esClient.index({
            index: esIndexName,
            id: movieData.imdbID,
            document: movieData
        });
        console.log(`Doc added successfully ${movieData.imdbID}`);
    }
    catch (ex) {
        console.error(`Error while adding document to ElasticSearch ${movieData.imdbID}`);
        throw ex;
    }
}

export const searchDataInIndex = async (searchText: string, from: number, size: number) => {
    try {
        const searchResults = await esClient.search({
            index: esIndexName,
            query: {
                "query_string": {
                    "query": `*${searchText}*`,
                    "fields": [
                        "Title",
                        "Director",
                        "Plot"
                    ]
                }
            },
            from: from,
            size: size
        });
        console.log(`Search results from ElasticSearch : ${searchResults}`);
        return searchResults.hits;
    }
    catch (ex) {
        console.error(`Error while searching the documents in ElasticSearch ${searchText}`);
        throw ex;
    }
}
