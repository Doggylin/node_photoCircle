
const formidable = require('formidable');
const fs = require('fs')
const path = require('path')
const circle = require('../model/circles')
const jwt = require('jsonwebtoken')

exports.upload = function(req,res){
    const form = new formidable.IncomingForm()
 
    var token = req.headers["authorization"]
    if (!token){
        res.end(JSON.stringify({
            code:403,
            msg:'没有提供token'
        }))
        return
    }
    try{
        var decoded = jwt.verify(token,'app.get(superSecret)')
    }catch(err){
        if (err['name'] == 'TokenExpiredError'){
            res.end(JSON.stringify({
                code:9999,
                msg:'登陆失效了'
            }))
            return
        } 
    }
    console.log(decoded)

    let user_str = decoded['data']
    let user_json = JSON.parse(user_str)
    let name = user_json['name'] 
    let is_it_friend = user_json['isItFriend']
    let head_url = user_json['headImg']

    form.uploadDir = path.normalize(__dirname + '/../temp/');
    form.parse(req,function(err,fields,files){
        if (err){
            return;
        }
        // console.log(fields,files)
        var oldPath = files.tupian.path;
        var time = (new Date()).valueOf();
        var newPath = path.normalize(__dirname + '/../uploaded/' + time + '_' + files.tupian.name)
        try {
            fs.rename(oldPath,newPath,function(err){
                if (err){
                    console.log(err);
                    return;
                }
                const newCircle = {
                    head_image_url : head_url,
                    nick_name : name,
                    isItFriend:is_it_friend,
                    message : fields.message,
                    create_time : time,
                    photo_url:time + '_' + files.tupian.name,
                    star_num : 0//Math.ceil(Math.random()*100)
                };
                circle.create(newCircle);
                console.log('保存成功')
                const str = {
                    'code':200,
                    'msg':'success'
                }
                res.end(JSON.stringify(str))
            })
        } catch (err) {
            console.log(err)
            const str = {
                'code':-3,
                'msg':'服务器异常了'
            }
            res.end(JSON.stringify(str))
        }
    })   
}
exports.home_data = function(req,res){
    const form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        console.log(fields)

        var token = req.headers['authorization']
        try {
            var decoded = jwt.verify(token,'app.get(superSecret)')
        } catch (err) {
            console.log(err)
        }
        let skip_num = Number(fields.page)
        var user_json;
        if (decoded){
            let user_str = decoded['data']
            user_json = JSON.parse(user_str)
        }
        if (fields.sort == 'latest'){//最新
            var arr = []
            circle.find().sort({'_id':-1}).limit(10).skip(10*skip_num).exec(function(err,obj){
                for (j = 0; j < obj.length;j++){
                    var m = obj[j]
                    if (user_json){         
                        for (i = 0 ; i < m.star_ids.length ; i++){
                            if (m.star_ids[i] == user_json['_id']){    
                                m.isStared = 1
                            }
                        }
                    }
                    m.star_ids = []
                    arr.push(m)
                }
                res.end(JSON.stringify(arr))
            })
        }else if (fields.sort == 'hot'){//最热
            var array = []
            circle.find().sort({'star_num':-1}).limit(10).skip(10*skip_num).exec(function(err,obj){
                for (j = 0; j < obj.length;j++){
                    let m = obj[j]
                    if (user_json){             
                        for (i = 0 ; i < m.star_ids.length ; i++){
                            if (m.star_ids[i] == user_json['_id']){    
                                m.isStared = 1
                            }
                        }
                    }
                    m.star_ids = []
                    array.push(m)
                }
                res.end(JSON.stringify(array))
            })
        }else{
            res.end(JSON.stringify({
                code:403,
                msg:'没有此分类'
            }))
        }
    })
}
