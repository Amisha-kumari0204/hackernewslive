const express = require('express');
require('dotenv').config();
const axios =require('axios');
const {Server} =require('ws');
const mysql= require('mysql2/promise');
const schedule=require('node-schedule');
const app=express();
app.set('view engine', 'ejs');
app.get('/',(req,res)=>{
    res.render('index');
})

const dbsetup =require('./services/db.js')
const connection =require('./services/connection.js');
const server=app.listen(process.env.PORT,async ()=>{

    await connection();
});
const wss=new Server({server});

const fetchAndStoreStories = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbsetup);

        const { data: storyIds } = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');

        const stories = await Promise.all(
            storyIds.slice(0, 10).map(async (id) => {
                const { data: story } = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                if (story) {
                    await connection.execute(
            `INSERT IGNORE INTO stories (id, title, url, time) VALUES (?, ?, ?, ?)`
                        , [story.id, story.title, story.url || '', story.time]
                    );
                }
                return story;
            })
        );
        return stories;
    } catch (error) {
        console.error('Error fetching stories:', error);
        return [];
    } finally {
        if (connection) await connection.end();
    }
};

const getRecentStories = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbsetup);
        const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
        const [rows] = await connection.execute(
            `SELECT * FROM stories WHERE time >= ? ORDER BY time DESC`,
            [fiveMinutesAgo]
        );
        await connection.execute(`DELETE FROM stories where time < ?`,[fiveMinutesAgo]);
        return rows;
    } catch (error) {
        console.error('Error retrieving recent stories:', error);
        return [];
    } finally {
        if (connection) await connection.end();
    }
};


const broadcastUpdates = (clients, stories) => {
    const message = JSON.stringify({ stories });
    clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
};


schedule.scheduleJob('*/5 * * * * *', async () => {
    const stories = await fetchAndStoreStories();
     broadcastUpdates(wss.clients, stories);
});

wss.on('connection',async (ws)=>{
    console.log('client connected');
    try {
        const recentstory=getRecentStories();
        ws.send(JSON.stringify({count:recentstory.length,stories:recentstory}))
    } catch (error) {
     console.log(error); 
    }
    ws.on('close',()=>{
        console.log('client disconnected');
    })
});