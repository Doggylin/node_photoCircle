const mongoose = require('mongoose')

var adminSchema = new mongoose.Schema({
    name:String,
    isItFriend:Number,
    headImg:String,
    phone:String,
    pwd:String,
    create_time:String

})
var admin = mongoose.model('Admin',adminSchema)
module.exports = admin