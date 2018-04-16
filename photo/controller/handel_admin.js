const admin = require('../model/admin');
const formidable = require('formidable');
var jwt = require('jsonwebtoken')

var form = new formidable.IncomingForm();

exports.register = function(req,res){
    form.parse(req,function(err,fields,files){
        if (err){
            res.end(JSON.stringfy({
                code:0,
                msg:'提交信息有误'
            }))
            return
        }

        async function doRegister(){
            try{
                const obj = await admin.findOne({phone:fields.phone})
                if (obj){
                    console.log(obj)
                    const str = {
                        code:-1,
                        msg:'用户已存在'
                    }
                    res.end(JSON.stringify(str))
                }else{
                    const time = (new Date()).valueOf()
                    const user = {
                        name:'user'+time,
                        create_time:time,
                        isItFriend:0,  
                        headImg:'default.jpg',
                        phone:fields.phone,
                        pwd:fields.pwd
                    } 
                    admin.create(user)
                    console.log('注册成功')
                    const str = {
                        'code':200,
                        'msg':'注册成功'
                    }
                    res.end(JSON.stringify(str))
                }
            }catch(err){
                console.log(err)
                const str = {
                    'code':-2,
                    'msg':'注册失败'
                }
                res.end(JSON.stringify(str))
            }
            
        }
        doRegister()
        
    })
}
exports.login = function(req,res){

    form.parse(req,function(err,fields,files){ 
        
        async function doLogin(){
            const {phone,pwd} = fields
            try{
                if (!phone){
                    throw new Error('phone参数不对')
                }else if (!pwd){
                    throw new Error('pwd参数不对')
                }
            }catch(err){
                const str = {    
                    code:-3,
                    msg:err.message 
                }
                res.end(JSON.stringify(str))
            }
            try{
                const user = await admin.findOne({phone:fields.phone});
                if (user){
                    if (user.pwd == pwd){
                        let userStr = JSON.stringify(user)
                        const token = jwt.sign({data:userStr},'app.get(superSecret)',{expiresIn:60*60});
                        const str = {
                            code : 200,
                            msg:'登录成功',
                            user:user,
                            token:token
                        }
                        res.end(JSON.stringify(str))
                    }else{
                        const str = {
                            code : 201,
                            msg:'密码错误'
                        }
                        res.end(JSON.stringify(str))
                    }
                }else{
                    const str = {
                        code : 404,
                        msg : '用户不存在'
                    }
                    res.end(JSON.stringify(str))
                }
            }catch(err){
                console.log(err)
                const str = {
                    code : 405,
                    msg : '登录异常'
                }
                res.end(JSON.stringify(str))
            }
        }
        doLogin()
    })
    

}   