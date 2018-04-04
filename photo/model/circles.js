
const mongoose = require('mongoose')

var circleSchema = new mongoose.Schema({
    head_image_url : String,
    nick_name : String,
    isItFriend:Number,
    message : String,
    create_time : Number,
    photo_url:String,
    star_num : Number
})

var circle = mongoose.model('Circle',circleSchema);

module.exports = circle