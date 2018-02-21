var dotenv = require('dotenv');
var mongoose = require('mongoose');

dotenv.config();

mongoose.connect('mongodb://' + process.env.DB_HOST+
                ':' + process.env.DB_PORT +
                '/' + process.env.DB_NAME)
                .then(() => {
                    console.log("Connected to database!");
                })
                .catch(err => {
                    console.log("Database error connection... Please verify your configuration in the .env file.");
                });
