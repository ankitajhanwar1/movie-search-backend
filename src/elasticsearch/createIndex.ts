import { esIndexName } from "./../../constants";
import { esClient } from "./elasticsearch";

export const createIndex = async () => {
    try {
        await new Promise((res) => setTimeout(res, 15000));
        
        await esClient.ping();

        const indexExists = await esClient.indices.exists({ index: esIndexName });
        if (!indexExists) {
            await esClient.indices.create({
                index: esIndexName,
                mappings: {
                    "properties": {
                        "title": {
                            "type": "text"
                        },
                        "year": {
                            "type": "text"
                        },
                        "imdbID": {
                            "type": "text"
                        },
                        "type": {
                            "type": "text"
                        },
                        "poster": {
                            "type": "text"
                        },
                        "director": {
                            "type": "text"
                        },
                        "plot": {
                            "type": "text"
                        },
                        "iMDbRating": {
                            "type": "text"
                        }
                    }
                }
            });
            console.log(`${esIndexName} created successfully`);
        }
        else {
            console.log(`${esIndexName} already exists`);
        }
    }
    catch (ex) {
        console.error(`Error creating index: ${ex}`);
        throw ex;
    }
}