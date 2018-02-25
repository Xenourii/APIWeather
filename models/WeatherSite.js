var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weatherSite = new Schema({
    site_id: { type: Number, required: true},
    openweathermap: { type: Object},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    isActivated: { type: Boolean, default: true }
});

module.exports = mongoose.model('WeatherSite', weatherSite);
