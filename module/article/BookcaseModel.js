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
    name : { type: String },                        //名称
    code : { type: String },                        //编码
    sort : { type: Number },                        //优先级
    remark : { type: String },                      //备注

    parent : { type: String, ref: 'Bookcase' },     //父级节点

    tenant : { type: String, ref : "M_Tenant" },    //所属租户
    state : { type: Number, default : 1},           //状态
    createTime: {type: Date, default: Date.now},    //创建时间
    creater: {type: String, ref : "User", default: config.dbUser.robot._id},          //创建者
    updateTime : { type: Date, default: Date.now},  //最后更新时间
    updater : { type: String, ref : "User", default: config.dbUser.robot._id}         //最后更新者
});

const Model = mongoose.model('Bookcase',schema);

module.exports = Model;