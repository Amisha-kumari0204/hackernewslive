const dbsetup=require('./db.js');
const mysql= require('mysql2/promise');
const connection=async()=>{
    try {
        const connects= await mysql.createConnection(dbsetup);
        await connects.execute(`
            CREATE TABLE IF NOT EXISTS stories (
                id INT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                url VARCHAR(255),
                time INT NOT NULL
            );
        `);
        console.log("Database connected");
        connects.end();
    } catch (error) {
        console.log(error);
    }
};

module.exports=connection;