import { createClient } from 'redis';

const client = createClient();

client.on('error', err => {
    console.log('Redis Client Error', err);
    // Handle the error gracefully; you might choose to log it and continue execution
});

const connectToRedis = async () => {
    await client.connect().catch(err => {
        console.error('Error connecting to Redis:', err);
        // Handle the connection error here as well
    });
};

const setCache = async (key, data) => {
    await client.set(key, JSON.stringify(data));
};

const getCache = async (key) => {
    return await client.get(key);
};

export { client, connectToRedis, setCache, getCache };
