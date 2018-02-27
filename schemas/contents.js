var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //外键关联categories
    category:{
        //l类型
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },

    title:String,

    //关联用户id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //添加时间
    addTime:{
      type:Date,
      default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    },
    comments:{
        type:Array,
        default:[]
    }


});