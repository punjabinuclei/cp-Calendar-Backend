# Backend

# **Contest Data Backend**

This Node.js Express application serves as a backend for fetching and caching contest data from a third-party API. The fetched data is stored in a Redis cache, and the backend offers an efficient way to retrieve this data through API requests while minimizing the load on the external API.

## **Features**

- **Data Caching:** The application fetches fresh contest data from the [Clist API](https://clist.by/) and stores it in a Redis cache. This helps reduce the number of requests made to the external API and enhances response times.
- **Scheduled Data Refresh:** A cron job is set up to periodically refresh the contest data at fixed intervals (every 30 minutes by default). This ensures that the cached data remains up-to-date with the latest information from the external API.
- **Middleware for Cache Check:** A middleware is implemented to check the Redis cache before making a request to the external API. If the requested data is available in the cache, it is served directly, minimizing the need to make repeated calls to the external API.

## **Prerequisites**

Before running the application, make sure you have the following:

- Node.js installed
- Redis server running locally or on a remote server
- API key for the [Clist API](https://clist.by/)

## **Installation**

1. Clone the repository:
    
    ```bash
    git clone https://github.com/yourusername/contest-data-backend.git
    cd contest-data-backend
    
    ```
    
2. Install dependencies:
    
    ```bash
    npm install
    
    ```
    
3. Create a **`.env`** file in the project root and provide the necessary environment variables:
    
    ```
    CLIST_API_USERNAME=your_username
    CLIST_API_KEY=your_key
    PORT=3000
    
    ```
    

## **Usage**

1. Run the application:
    
    ```bash
    npm start
    
    ```
    
    The server will start on the specified port (default is 3000).
    
2. Access the API:
    
    The API endpoint is **`http://localhost:3000`**. You can make GET requests to this endpoint to retrieve contest data. The middleware will check the Redis cache before fetching fresh data from the Clist API.
    

## **Contributing**

Feel free to contribute to the development of this project by opening issues or submitting pull requests. Make sure to follow the [contributing guidelines](gurpreet.singh.735701@gmail.com).

## **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## **Acknowledgments**

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Redis](https://redis.io/)
- [axios](https://axios-http.com/)
- node-cron
- dotenv

Thank you for using and contributing to the Contest Data Backend!
