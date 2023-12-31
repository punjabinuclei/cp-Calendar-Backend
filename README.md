# CPCalender API

Welcome to the CPCalender API, a service that fetches upcoming contests from [CList API](https://clist.by/).

## Table of Contents
- [Getting Started](#getting-started)
- [API Endpoint](#api-endpoint)
- [Example](#example)
- [Error Handling](#error-handling)

## Getting Started

### Installation
Ensure you have Node.js and npm installed. Then, install the project dependencies:

```bash
npm install
Run the Server
Start the server on the default port 3000:

bash
Copy code
npm start
API Endpoint
Fetch Upcoming Contests
Endpoint: /contests
Method: GET
Description: Retrieves a list of upcoming contests.
Example
Request
bash
Copy code
curl http://localhost:3000/contests
Response
json
Copy code
[
  {
    "id": 123,
    "name": "Contest 1",
    "startTime": "2023-12-01T10:00:00Z",
    "duration": "2 hours",
    // other contest details
  },
  // more contests
]
Error Handling
500 Internal Server Error: Something went wrong on the server.
For more details, refer to the CList API Documentation for information on contest details.