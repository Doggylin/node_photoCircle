const mongoose = require('mongoose')

var circleSchema = new mongoose.Schema({
    head_image_url : String,
    nick_name : String,
    isItFriend:Number,
    message : String,
    create_time : Number,
    photo_url:String,
    star_num : Number,
    star_ids:[String],
    isStared:Number,
    comment:[{
        user_id:String,
        msg:String
    }]
})

circleSchema.methods.dianzan = function(user_id,callback){
    this.star_ids.push(user_id)
    this.star_num = this.star_ids.length
    this.save(function(result){
        callback(result)
    })
}

var circle = mongoose.model('Circle',circleSchema);

module.exports = circle