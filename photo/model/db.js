const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/photoCircle');
const db = mongoose.connection;
db.once('open',function(cllback){
    console.log('连接成功')
})
db.on('error',function(error){
    console.log(error);
    mongoose.disconnect();
});
db.on('close',function(){
    console.log('关闭数据库')
})
module.exports = db