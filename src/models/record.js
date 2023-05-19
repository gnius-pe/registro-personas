const mongoose = require("mongoose");

const recordSchema = mongoose.Schema({
    date_capture: {
        type: Date,
        default: Date.now ,
        require: true
    },
    photo: {
        type: String,
        require: false
    }
});

module.exports = mongoose.model('Record', recordSchema);