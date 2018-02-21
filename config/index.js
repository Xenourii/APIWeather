var mongoose = require('mongoose');

mongoose.connect('mongoMaster:27017/weatherdb')
                .then(() => {
                    console.log("Connected to database!");
                })
                .catch(err => {
                    console.log("Database error connection.");
                });
