var mongoose = require('mongoose');

mongoose.connect('weatherRepl/mongoMaster:27017,mongoRep1:27017,mongoRep2:27017/weatherdb')
                .then(() => {
                    console.log("Connected to database!");
                })
                .catch(err => {
                    console.log("Database error connection.");
                });
