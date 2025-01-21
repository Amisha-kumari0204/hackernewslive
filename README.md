# Hacker News Live Scraper  

This project is a **Node.js-based service** that scrapes real-time stories from **Hacker News**, broadcasts updates using **WebSocket**, and integrates with **MySQL** for data storage and management.  

### **Deployed Link**: [Hacker News Live Scrapper](https://hackernewslive.onrender.com/)
---

## Features  

- **Hacker News Scraping**  
  Periodically scrapes the latest stories from [Hacker News](https://news.ycombinator.com/).  
- **WebSocket Streaming**  
  - Broadcasts real-time updates of new stories to connected clients.  
  - Sends the number of stories published in the last 5 minutes when a client connects.  
- **MySQL Integration**  
  - Stores scraped stories in a MySQL database.  
  - Provides structured storage and retrieval capabilities.  

---

## Prerequisites  

Before running this project, ensure you have the following installed:  
- **Node.js** (v14 or higher)  
- **MySQL**  
- **npm** (Node Package Manager)  

---

## Setup Instructions  

### 1. Clone the Repository  
```bash  
git clone https://github.com/Amisha-kumari0204/hackernewslive.git  
cd hackernewslive  
```
### 2. Install Dependencies 
```bash  
npm install  
```
### 3. Configure Environment Variables
Create a .env file in the root directory with the following variables:
```bash
DB_HOST=<your_mysql_host>  
DB_USER=<your_mysql_username>  
DB_PASSWORD=<your_mysql_password>  
DB_NAME=<your_database_name>  
PORT=<server_port>  
```

### 4. Initialize MySQL Database
Run the provided SQL script (db/schema.sql) to set up the required database schema.
```bash
mysql -u <username> -p < db/schema.sql  
```

### 5. Start the Server
```bash
npm start
```
The server will start running on the port specified in the .env file.



## WebSocket Usage
### Connect to WebSocket
- WebSocket endpoint: ws://<your_server_url>/
- On connection:
   - The server sends the number of stories published in the last 5 minutes.
   - Real-time updates are broadcasted as new stories are scraped.



## Project Structure
```bash
hackernewslive/
├── node_modules/          # Contains project dependencies
├── services/              # Includes service modules
│   ├── connection.js      # Manages WebSocket connections and real-time updates
│   └── db.js              # Handles MySQL database connections and queries
├── views/                 # Contains view templates for the application
│   └── index.ejs          # Main HTML template for rendering the homepage
├── .env                   # Environment variables configuration file
├── README.md              # Project documentation and setup instructions
├── app.js                 # Main application entry point
├── package-lock.json      # Auto-generated file for locking dependencies versions
└── package.json           # Project metadata and dependencies configuration
```


## Future Improvements
- Add more robust error handling.
- Implement rate-limiting to prevent overloading Hacker News.
- Enable filtering and sorting of stories through REST APIs.

## Author
**Amisha Kumari**  
[GitHub Profile](https://github.com/Amisha-kumari0204/)

