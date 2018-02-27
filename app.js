/*
博客的入口
 */

var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
//express的中间件bodyparser
var bodyPaser = require('body-parser');
//cookie
var Cookies = require('cookies');

var app = express();

var User = require('./models/User')

//静态文件托管
//当url以/public开始，返回对应的__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));


/*
配置模板
定义当前应用的模板引擎，也就是html里面的{{}}、{%%}，此外还有EJS，Jade
第一个参数 模板引擎名称 同时也是模板文件的后缀
第二个参数 用于解析处理模板内容的方法
 */
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views,第二个是目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine，第二个必须是app.engine('html',swig.renderFile);中的第一个参数
app.set('view engine','html');

//开发时取消模板缓存
swig.setDefaults({cache:false});

//bodyparser设置
app.use(bodyPaser.urlencoded({extended:true}));

//设置cookie
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);

    //解析
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前登录用户的类型，是否为管理员
            User.findById(req.userInfo._id).then( function () {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                console.log(req.userInfo.isAdmin);
                next();
            });

        }catch (e){
            next();
        }
    }

    next();
})


app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if (err){
        console.log('错误');
    }else{
        console.log('success');
        // 监听8081
        app.listen(8081)
    }
});


