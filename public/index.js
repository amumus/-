$(document).ready(function(){
    //重置
    $(".bt_reset").click(function(){
        // $("#login_name").val("");
        // $("#login_password").val("");
        $('.rightBox').find('input').val('');
    });
    //登录页面点击注册
    $('#login').find('a').on('click',function () {
        $('#register').show();
        $('#login').hide();
    })
    //注册页面点击登录
    $('#register').find('a').on('click',function () {
        $('#register').hide();
        $('#login').show();
    })
    //注册时提交ajax请求
    $('#bt_register').on('click',function () {
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$('#register_name').val(),
                password:$('#register_password').val(),
                repassword:$('#register_repassword').val(),
            },
            dataType:'json',
            success:function (result) {
                $('#register').find('.colWarning').html(result.message);
                if(!result.code){
                    //注册成功
                    setTimeout(function () {
                        $('#register').hide();
                        $('#login').show();
                    },1000);
                }else{
                    //失败
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
                console.log(textStatus);
            }
        });
    });
    //登录
    $('#bt_login').on('click',function () {
        $.ajax({
           type:'post',
           url:'/api/user/login',
           data:{
                username:$('#login_name').val(),
                password:$('#login_password').val(),
           },
           dataType:'json',
           success:function (result) {
               $('#login').find('.colWarning').html(result.message);
               if(!result.code) {
                   // setTimeout(function () {
                   //     //登录成功后
                   //     $('#logout').show();
                   //     $('#register').hide();
                   //     $('#login').hide();
                   //     $('#username').html(result.userInfo.username);
                   // }, 1000);
                   window.location.reload();
               }

           },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
                console.log(textStatus);
            }
        });
    });
    //注销
    $('#bt_logout').on('click',function () {
       $.ajax({
           url:'/api/user/logout',
           success:function (result) {
                if(!result.code){
                    window.location.reload();

                }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               // 状态码
               console.log(XMLHttpRequest.status);
               // 状态
               console.log(XMLHttpRequest.readyState);
               // 错误信息
               console.log(textStatus);
           }
       }) ;
    });
});


