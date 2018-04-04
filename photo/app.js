const express = require('express');
const router = require('./router/index')
const db = require('./model/db')

const app = express()

app.set('view engine','ejs')
app.use('/images',express.static("./uploaded"))
router.index(app)

app.listen(3000,function(){
    console.log('server is running');
});
