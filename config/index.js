var mongoose = require('mongoose');
var mysql = require('mysql');

mongoose.connect('mongoMaster:27017/weatherdb')
                .then(() => {
                    console.log("Connected to mongoDB database!");
                })
                .catch(err => {
                    console.log("Database error connection (mongoDB).");
                });

var mysqlconnection = mysql.createConnection({
  host: "sqlMaster",
  port: 3306,
  database: 'weatherdbsql'
});

mysqlconnection.connect(function(err){
  if(err)
    console.log("Database error connection (mysql)." + err);
  console.log('Connected to mysql database')
})

module.exports = mysqlconnection;
