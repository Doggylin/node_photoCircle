const handel_image = require('../controller/handel_image')
const show_index = require('../controller/index')
const handel_admin = require('../controller/handel_admin')
const handel_circle = require('../controller/handel_circle')
exports.index = function(app){
    app.get('/',show_index.showIndex)
    app.post('/home_data',handel_image.home_data)
    app.post('/upload',handel_image.upload)
    app.post('/register',handel_admin.register)
    app.post('/login',handel_admin.login)
    app.post('/dianzan',handel_circle.dianzan)
    app.post('/pinglun',handel_circle.pinglun)
    app.post('/getPinglun',handel_circle.getPinglun)
}
