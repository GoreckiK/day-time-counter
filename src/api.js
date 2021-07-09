//@ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('./config')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const containerId = config.container.id
const partitionKey = { kind: 'Hash', paths: ["/counterName"] }

const options = {
      endpoint: endpoint,
      key: key,
      partitionKey: partitionKey
    };

const querySpec = {
    query: "SELECT * from c"
}

export const client = new CosmosClient(options)

export const container = client
    .database(databaseId)   
    .container(containerId)

export const getContainer = () => container

export const getCards = () => container.items
    .query(querySpec)
    .fetchAll();

// @ts-ignore
export const addItem = item => container.items
    .create(item)

// @ts-ignore
export const updateItem = ((itemId, data) => container
    .item(itemId)
    .replace(data));

// @ts-ignore
export const deleteItem = (id, counterName) => container
    .item(id, counterName)
    .delete();
