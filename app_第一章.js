/*
博客的入口
 */

var express = require('express');
var swig = require('swig');

var app = express();

//静态文件托管
//当url以/public开始，返回对应的__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));


/*
配置模板
定义当前应用的模板引擎
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

/*
req request
res response
next 下一步执行函数
 */
app.get('/',function (req,res,next) {
    /*
    读取views目录下的指定文件，解析并返回给客户端
    第一个参数表示模板文件，相对于views目录
    第二个参数，传递给模板使用的数据
     */
    res.render('index.html');
})


// app.get('/main.css',function (req,res) {
//     res.setHeader('content-type','text/css');
//    res.send("body{background:red;}")
// });

// 监听8081
app.listen(8081)