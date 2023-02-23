const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rate: {
        //between 1-5
        type: Number,
        required: true,

        min: 1,
        max: 5,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Review", schema);
