var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('对不起，只有管理员才能进入后台！');
        return;
    }
    next();
});

router.get("/", function (req, res, next) {
    // res.send('后台管理首页');
    res.render('admin/index', {
        userInfo: req.userInfo,
    });
});
/*
用户首页
 */
router.get('/user', function (req, res) {
    /*
        limit(number)限制查询条数
        skip(number)跳过查询条数
    */
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    // User.count(function (err,count) {
    //     console.log(count);
    // })
    User.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skit = (page - 1) * limit;
        User.find().limit(limit).skip(skit).then(function (users) {

            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page,
            });
        });
    });
});
/*
分类的首页
 */
router.get('/category', function (req, res) {
    /*
       limit(number)限制查询条数
       skip(number)跳过查询条数
   */
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    // User.count(function (err,count) {
    //     console.log(count);
    // })
    Category.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skit = (page - 1) * limit;
        Category.find().sort({_id: -1}).limit(limit).skip(skit).then(function (categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                pages: pages,
                limit: limit,
                page: page,
            });
        });
    });
});
/*
分类添加的首页
 */
router.get('/category/add', function (req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo,
        message: '名称不能为空!'
    });
});
/*
分类添加
 */
router.post('/category/add', function (req, res) {
    var name = req.body.name || '';
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空!'
        });
    }
    //数据库判断
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在!'
            });
            return Promise.reject();
        } else {
            return new Category({name: name}).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        });
    });

});
/*
分类修改
 */
router.get('/category/edit', function (req, res) {
    var id = req.query.id || '';
    Category.findById(id).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在！'
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category,
            });
        }
    }, function (err) {
        console.log(err);
    });
});
/*
分类的修改保存
 */
router.post('/category/edit', function (req, res) {
    var id = req.query.id || '';
    var name = req.body.name || '';
    Category.findById(id).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在！'
            });
            return Promise.reject();
        } else {
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功！',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                /*
                查看下分类的信息是否已经存在了
               */
                Category.findOne({
                    _id: {$ne: id},
                    name: name
                }).then(function (sameCategory) {
                    if (sameCategory) {
                        res.render('admin/error', {
                            userInfo: req.userInfo,
                            message: '数据库已经存在同名分类！',
                        });
                        return Promise.reject();
                    } else {
                        return Category.update({
                            _id: id
                        }, {
                            name: name
                        });
                    }
                }).then(function (value) {
                    res.render('admin/success', {
                        userInfo: req.userInfo,
                        message: '修改成功！',
                        url: '/admin/category'
                    });
                });
            }


        }
    }, function (err) {
        console.log(err);
    });
});
/*
分类删除
 */
router.get('/category/delete', function (req, res) {
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功！',
            url: '/admin/category'
        });
    })
});
/*
内容首页
 */
router.get('/content', function (req, res) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    Content.count().then(function (count) {
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        //populate 关联读取
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            // console.log(contents);
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                limit: limit,
                page: page,
            });
        });
    });
});
/*
内容添加
 */
router.get('/content/add', function (req, res) {
    Category.find().sort({_id: -1}).then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories,
        });
    }, function (err) {
        console.log(err);
    });
});
router.post('/content/add', function (req, res) {
    // console.log(req.body);
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空！'
        })
        return;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空！'
        })
        return;
    }
    if (req.body.destination == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空！'
        })
        return;
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空！'
        })
        return;
    }
    new Content({
        category: req.body.category,
        title: req.body.title,
        user:req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '保存成功！',
            url: "/admin/content"
        })
    });
}, function (err) {
    console.log(err);
});
/*
内容修改
 */
router.get('/content/edit', function (req, res) {
    var id = req.query.id || '';

    var categories = [];
    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs;
        return Content.findById(id).populate('category');
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '指定内容不存在!'
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                categories:categories,
                content: content
            })
        }
    }, function (err) {
        console.log(err);
    });
});
/*
保存内容修改
 */
router.post('/content/edit', function (req, res){
    var id = req.query.id || '';
    if(req.body.content == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容不能为空！'
        });
        return ;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空！'
        })
        return;
    }
    if (req.body.destination == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空！'
        })
        return;
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空！'
        })
        return;
    }
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功.',
            url:'/admin/content/edit?id='+id
        });
    })
});
/*
内容删除
 */
router.get('/content/delete',function (req,res) {
    var id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功.',
        });
    });
});


module.exports = router;