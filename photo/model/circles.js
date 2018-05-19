const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    commnet_message:String,
    head_image_url:String,
    nick_name:String,
    user_id:String,
    time:Number
})


var circleSchema = new mongoose.Schema({
    head_image_url : String,
    nick_name : String,
    isItFriend:Number,
    message : String,
    create_time : Number,
    photo_url:String,
    star_num : Number,
    comment_num : Number,
    star_ids:[String],
    isStared:Number,
    comment:[commentSchema]
})

circleSchema.methods.dianzan = function(user_id,callback){
    this.star_ids.push(user_id)
    this.star_num = this.star_ids.length
    this.save(function(result){
        callback(result)
    })
}
circleSchema.methods.pinglun = function(newcomment,callback){
    this.comment.push(newcomment)
    this.comment_num = this.comment.length
    this.save(function(){
        callback()
    })
}

var circle = mongoose.model('Circle',circleSchema);

module.exports = circle