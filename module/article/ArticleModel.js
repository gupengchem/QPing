/**
 * Created by wangshuyi on 2017/4/20.
 */

'use strict';

const uuid = require('uuid');

const mongoose = require('../util/mongoDB'),
    Schema = mongoose.Schema;
const config = require('../../config/config');

const schema = new Schema({
    _id : {type : String, default: uuid.v4},
    name : { type: String },                        //标题
    code : { type: String, unique: true, default: uuid.v4 },          //编码
    language : { type: String },                    //语言
    sort : { type: Number },                        //优先级
    time : { type: Date, default: Date.now },       //时间
    author : { type: String },                      //作者
    effectiveTime : { type: Date, default: Date.now }, //生效时间
    disActiveTime : { type: Date, default: Date.now }, //失效时间
    summary : { type: String },                     //摘要
    img : { type: String, ref: 'U_File' },          //封面图片
    content : { type: String },                     //内容
    thirdUrl : { type: String },                     //新增链接

    bookcase : { type: String, ref : "T_Bookcase" },  //所属目录

    tenant : { type: String, ref : "M_Tenant", default: config.dbUser.admin.tenant },    //所属租户
    state : { type: Number, default : 1},           //状态
    createTime: {type: Date, default: Date.now},    //创建时间
    creater: {type: String, ref : "M_User", default: config.dbUser.robot._id},          //创建者
    updateTime : { type: Date, default: Date.now},  //最后更新时间
    updater : { type: String, ref : "M_User", default: config.dbUser.robot._id}         //最后更新者
});
schema.index({code: 1});

const Model = mongoose.model('T_Article',schema);

module.exports = Model;