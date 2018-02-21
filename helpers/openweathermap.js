const dotenv = require('dotenv');
dotenv.config();
const OpenWeatherMap = require("openweathermap-node");

module.exports = function() {
  return new OpenWeatherMap (
      {
        APPID: process.env.APPID,
        units: "metric"
      }
    );
};
