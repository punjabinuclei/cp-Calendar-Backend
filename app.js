
import express from 'express';
import cron from 'node-cron';
import axios from 'axios';
import { connectToRedis, setCache, getCache } from './redis.js';

const app = express();
const port = 3000;


const fetchDataFromApi = async () => {
    const apiURL = `https://clist.by:443/api/v4/contest/?username=${process.env.USERNAME}&api_key=${process.env.API_KEY}&?limit=30&total_count=false&with_problems=false&upcoming=true&format_time=true&filtered=true&order_by=start`;

    try {
        const apiResponse = await axios.get(apiURL);
        const freshData = apiResponse.data;

        await setCache(apiURL, freshData);

        console.log('Data refreshed successfully.');
        return freshData;
    } catch (error) {
        console.error('Error fetching data from URL:', error);
        return null;
    }
};

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

app.use(async (req, res, next) => {
    const cacheKey = `https://clist.by:443/api/v4/contest/?username=punjabinuclei&api_key=be65f278452f80cd9b221cdbb27831f66abad7b6&?limit=30&total_count=false&with_problems=false&upcoming=true&format_time=true&filtered=true&order_by=start`;

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
        res.send(JSON.parse(cachedData));
    } else {
        try {
            const freshData = await fetchDataFromApi();

            if (freshData) {
                await setCache(cacheKey, freshData);
                res.send(freshData);
            } else {
                res.status(500).send('Internal Server Error');
            }
        } catch (error) {
            console.error('Error during middleware execution:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, async () => {
    await connectToRedis();
    console.log(`Server is running on port ${port}`);
});
