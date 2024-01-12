import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import cron from 'node-cron';
import { createClient } from 'redis';

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

const client = createClient();

client.on('error', err => {
    console.log('Redis Client Error', err);
    // Handle the error gracefully; you might choose to log it and continue execution
});

await client.connect().catch(err => {
    console.error('Error connecting to Redis:', err);
    // Handle the connection error here as well
});

// Function to fetch fresh data from the API
const fetchDataFromApi = async () => {
    const apiURL = `https://clist.by:443/api/v4/contest/?username=punjabinuclei&api_key=be65f278452f80cd9b221cdbb27831f66abad7b6&?limit=30&total_count=false&with_problems=false&upcoming=true&format_time=true&filtered=true&order_by=start`;

    try {
        const apiResponse = await axios.get(apiURL);
        const freshData = apiResponse.data;

        // Update Redis cache with fresh data
        await client.set(apiURL, JSON.stringify(freshData));

        console.log('Data refreshed successfully.');
        return freshData;
    } catch (error) {
        console.error('Error fetching data from URL:', error);
        return null;
    }
};

// Schedule the data refresh every 30 minutes
const cronJob = cron.schedule('*/30 * * * *', async () => {
    console.log('Data refresh started at:', new Date().toLocaleString());

    try {
        console.log('Refreshing data...');
        await fetchDataFromApi();
        console.log('Data refresh completed successfully at:', new Date().toLocaleString());
    } catch (error) {
        console.error('Error during data refresh:', error);
    }
});

// Middleware to check cache before making API request
app.use(async (req, res, next) => {
    // Construct the cache key based on request parameters
    // const username = req.query.username || 'default';
    // const apiKey = req.query.api_key || 'default';
    // const limit = req.query.limit || 10;

    const cacheKey = `https://clist.by:443/api/v4/contest/?username=punjabinuclei&api_key=be65f278452f80cd9b221cdbb27831f66abad7b6&?limit=30&total_count=false&with_problems=false&upcoming=true&format_time=true&filtered=true&order_by=start`;

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
        // Serve data from cache
        res.send(JSON.parse(cachedData));
    } else {
        // Fetch fresh data from the URL
        try {
            const freshData = await fetchDataFromApi();

            if (freshData) {
                // Update Redis cache with fresh data
                await client.set(cacheKey, JSON.stringify(freshData));

                // Serve fresh data
                res.send(freshData);
            } else {
                // Handle case where fetching data failed
                res.status(500).send('Internal Server Error');
            }
        } catch (error) {
            console.error('Error during middleware execution:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});

// Error handling middleware - placed at the end
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
