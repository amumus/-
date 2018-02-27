var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

var responseData;

router.use(function (req,res,next) {
    responseData={
        code:0,
        message:'',
        userInfo:{
            _id:'',
            username:'',
            isAdmin:''
        }
    };
    next();
});
//注册
router.post('/user/register',function (req,res,next) {
    // console.log(req.body);
    var username= req.body.username;
    var password=req.body.password;
    var repassword = req.body.repassword;
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空！';
        res.json(responseData);
        return ;
    }
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空！';
        res.json(responseData);
        return;
    }
    if(password != repassword){
        responseData.code=3;
        responseData.message='两次输入的密码不一样！';
        res.json(responseData);
        return ;
    }

    // User.findOne({
    //     username:username,
    // }).then(function (userInfo) {
    //     console.log(userInfo);
    // });
    User.findOne({
        username:username,
    }).then(function (userInfo) {
        if(userInfo){
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //存到数据库中
        var user = new User({
            username:username,
            password:password,
        });
        return user.save();
    }).then(function (newUserInfo) {
        // console.log(newUserInfo);
        responseData.message='注册成功';
        res.json(responseData);
    });
});

router.post('/user/login',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;

    if(username == ''||password==''){
        responseData.code = 1;
        responseData.message='用户名或密码为空';
        res.json(responseData);
        return ;
    }
    //数据库查询
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名或密码错误';
            res.json(responseData);
            return ;
        }
        responseData.code=0;
        responseData.message='登录成功！'
        responseData.userInfo={
          _id:userInfo._id,
          username:userInfo.username,
          isAdmin:userInfo.isAdmin
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username,
            isAdmin:userInfo.isAdmin
        }));
        res.json(responseData);
        return ;
    }),function (err) {
        console.log(err)
    }
});
/*
退出
 */
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    res.json(responseData);
})

/*
评论提交
 */
router.post('/comment/post',function (req,res) {
    //内容的id
    var contentId=req.body.contentid ||'';
    var postData={
      username: req.userInfo.username,
      postTime:new Date(),
      content:req.body.content
    };
    Content.findOne({_id:contentId}).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;

        res.json(responseData);
    });

});


module.exports = router;