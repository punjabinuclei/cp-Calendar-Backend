import express from 'express';
import { createClient } from 'redis';
import axios from 'axios';
import cron from 'node-cron';

const app = express();
const port = 3000;

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

// Function to fetch fresh data from the API
const fetchDataFromApi = async () => {
    const apiURL = 'https://clist.by:443/api/v4/contest/?username=punjabinuclei&api_key=be65f278452f80cd9b221cdbb27831f66abad7b6&limit=10&total_count=true&with_problems=false&upcoming=true&format_time=true&start_time__during=2%20days&filtered=true&order_by=start';

    try {
        const apiResponse = await axios.get(apiURL);
        const freshData = apiResponse.data;

        // Update Redis cache with fresh data
        await client.set(apiURL, JSON.stringify(freshData));

        console.log('Data refreshed successfully.');
    } catch (error) {
        console.error('Error fetching data from URL:', error);
    }
};

// Schedule the data refresh every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    console.log('Refreshing data...');
    await fetchDataFromApi();
});

// Middleware to check cache before making API request
app.use(async (req, res, next) => {
    const cacheKey = 'https://clist.by:443/api/v4/contest/?username=punjabinuclei&api_key=be65f278452f80cd9b221cdbb27831f66abad7b6&limit=10&total_count=true&with_problems=false&upcoming=true&format_time=true&start_time__during=2%20days&filtered=true&order_by=start';

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
        // Serve data from cache
        res.send(JSON.parse(cachedData));
    } else {
        // Fetch fresh data from the URL
        try {
            const apiResponse = await axios.get(cacheKey);
            const freshData = apiResponse.data;

            // Update Redis cache with fresh data
            await client.set(cacheKey, JSON.stringify(freshData));

            // Serve fresh data
            res.send(freshData);
        } catch (error) {
            console.error('Error fetching data from URL:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
