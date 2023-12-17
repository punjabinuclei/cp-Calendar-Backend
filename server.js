// server.js
const express = require('express');
const app = express();
const port = 3000;
imporecho "# cp-Calendar-Backend" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/punjabinuclei/cp-Calendar-Backend.git
git push -u origin maint { createClient } from 'redis';


const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
