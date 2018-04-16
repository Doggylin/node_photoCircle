const formidable = require('formidable');
const circleModel = require('../model/circles');
const jwt = require('jsonwebtoken')

const form = new formidable.IncomingForm()

exports.dianzan = function(req,res){
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

    form.parse(req,function(err,fields,files){
        const {user_id,circle_id} = fields
        try{
            if (!user_id){
                throw new Error('缺少user_id')
            }
            if(!circle_id){
                throw new Error('缺少circle_id')
            }
        }catch(err){
            res.end(JSON.stringify({
                code : -3,
                msg:err.message
            }))
        }

        async function doDianzan(){
            try {
                const circleObj = await circleModel.findById({_id:circle_id})
                if (circleObj){
                    circleObj.dianzan(user_id,function(){
                        const str = {
                            code : 200,
                            star_num:circleObj.star_ids.length,
                            msg : '点赞成功'
                        }
                        res.end(JSON.stringify(str))
                    })
                }
            } catch (err) {
                console.log(err)
                const str = {
                    code : -3,
                    msg : '点赞失败'
                }
                res.end(JSON.stringify(str))
            }
            
        }
        doDianzan()


    })

}