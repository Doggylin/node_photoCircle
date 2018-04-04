const handel_image = require('../controller/handel_image')
const show_index = require('../controller/index')

exports.index = function(app){
    app.get('/',show_index.showIndex)
    app.post('/home_data',handel_image.home_data)
    app.post('/upload',handel_image.upload)
}
