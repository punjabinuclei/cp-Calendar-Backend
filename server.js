// server.js
const express = require('express');
const app = express();
const port = 3000;

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
