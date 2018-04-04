const formidable = require('formidable');
const fs = require('fs')
const path = require('path')
const circle = require('../model/circles')

exports.upload = function(req,res){
    const form = new formidable.IncomingForm()
    form.uploadDir = path.normalize(__dirname + '/../temp/');
    form.parse(req,function(err,fields,files){
        if (err){
            return;
        }
        // console.log(fields,files)
        var oldPath = files.tupian.path;
        var time = (new Date()).valueOf();
        var newPath = path.normalize(__dirname + '/../uploaded/' + time + '_' + files.tupian.name)
        fs.rename(oldPath,newPath,function(err){
            if (err){
                console.log(err);
                return;
            }
            const newCircle = {
                head_image_url : time + '_' + files.tupian.name,
                nick_name : 'Miss Wang',
                isItFriend:1,
                message : fields.message,
                create_time : time,
                photo_url:time + '_' + files.tupian.name,
                star_num : Math.ceil(Math.random()*100)
            };
            circle.create(newCircle);
            console.log('保存成功')
            const str = {
                'code':200,
                'msg':'success'
            }
            res.end(JSON.stringify(str))
        })

    })
}
exports.home_data = function(req,res){
    const form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        console.log(fields)
        let skip_num = Number(fields.page)
        if (fields.sort == 'latest'){//最新
             circle.find().sort({'_id':-1}).limit(10).skip(10*skip_num).exec(function(err,obj){
                
                res.end(JSON.stringify(obj))
            })
        }else if (fields.sort == 'hot'){//最热
            circle.find().sort({'star_num':-1}).limit(10).skip(10*skip_num).exec(function(err,obj){
                res.end(JSON.stringify(obj))
            })
        }else{
            res.end(JSON.stringify({
                code:403,
                msg:'没有此分类'
            }))
        }
    })
}
