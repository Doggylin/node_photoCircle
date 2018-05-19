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
        console.log(err)
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
exports.pinglun = function(req,res){
    var token = req.headers["authorization"]
    if (!token){
        res.end(JSON.stringify({
            code:403,
            msg:'没有提供token'
        }))
        return
    }
    try {
        var decoded = jwt.verify(token,'app.get(superSecret)')
    } catch (err) {
        console.log(err)
        if (err['name'] == 'TokenExpiredError'){
            res.end(JSON.stringify({
                code:9999,
                msg:'登陆失效了'
            }))
            return
        }
        return
    }
    console.log(decoded)
    const tokenStr = decoded['data']
    const tokenJson = JSON.parse(tokenStr)

    form.parse(req,function(err,fields,files){
        const {circle_id,comment} = fields
        try {
            if (!circle_id){
                throw new Error('缺少circle_id参数')
            }
            if (!comment){
                throw new Error('缺少comment参数')
            }
        } catch (err) {
            res.end(JSON.stringify({
                code:403,
                msg:err.message
            }))
        }
        async function dopinglun(){
            try {
                const time = (new Date()).valueOf();
                const obj = await circleModel.findById({_id:circle_id})
                if (obj){
                    const newCommentObj = {
                        commnet_message:comment,
                        head_image_url:tokenJson.headImg,
                        nick_name:tokenJson.name,
                        user_id:tokenJson._id,
                        time:time
                    }
                    obj.pinglun(newCommentObj,function(){
                        const str = {
                            code : 200,
                            comment_num:obj.comment_num,
                            msg : '评论成功'
                        }
                        res.end(JSON.stringify(str))
                    })
                    
                }

            } catch (err) {
                console.log(err)
                const str = {
                    code : -3,
                    msg : '评论失败'
                }
                res.end(JSON.stringify(str))
            }
        }
        dopinglun()
    })

}
exports.getPinglun = function(req,res){
    form.parse(req,function(err,fields,files){
        const {circle_id} = fields
        try {
            if (!circle_id){
                throw new Error('缺少circle_id参数')
            }
        } catch (err) {
            res.end(JSON.stringify({
                code:403,
                msg:err.message
            }))
        }
        async function dogetpinglun(){
            try {
                const obj = await circleModel.findById({_id:circle_id})
                if (obj){
                    const str = {
                        code : 200,
                        data : obj.comment,
                        msg : 'success'
                    }
                    res.end(JSON.stringify(str))
                    
                    
                }

            } catch (err) {
                console.log(err)
                const str = {
                    code : 403,
                    msg : '服务器异常'
                }
                res.end(JSON.stringify(str))
            }
        }
        dogetpinglun()
    })
}