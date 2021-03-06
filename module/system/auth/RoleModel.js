/**
 * Created by wangshuyi on 2016/12/27.
 */

'use strict';

/**
 * 角色管理
 */

const uuid = require('uuid');

const mongoose = require('../../util/mongoDB'),
    Schema = mongoose.Schema;
const config = require('../../../config/config');

const schema = new Schema({
    _id : {type : String, default: uuid.v4},
    name : { type: String },                        //名称
    code: {type: String, unique: true},             //编码
    menus: [{ type: String, ref:'M_Menu' }],          //可见菜单

    state : { type: Number, default : 1},           //状态
    createTime: {type: Date, default: Date.now},    //创建时间
    creater: {type: String, ref : "M_User", default: config.dbUser.robot._id},          //创建者
    updateTime : { type: Date, default: Date.now},  //最后更新时间
    updater : { type: String, ref : "M_User", default: config.dbUser.robot._id}         //最后更新者
});

const Model = mongoose.model('M_Role',schema);

module.exports = Model;
