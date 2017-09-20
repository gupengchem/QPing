/**
* Created by wangshuyi on 4/20/2017, 3:45:24 PM.
*/

'use strict';

const extend = require('extend');

const express = require('express');
const router = express.Router();

const logger = require('log4js').getLogger("sys");

const resUtil = require("../../module/util/resUtil");
const reqUtil = require("../../module/util/reqUtil");

const service = require("../../service/article/BookcaseService");

/* GET users listing. */
//列表
router.post('/list', function(req, res, next) {
    let condition = req.body, query = req.query,
    populate = '';
    condition = reqUtil.formatCondition(condition);

    service
        .findForPage(req.session.userData, query.pageSize, query.pageNumber, condition, populate)
        .then(function (data) {
            res.send(resUtil.success(data));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});
router.get('/tree', function(req, res, next) {
    let condition = req.query;
    condition = reqUtil.formatCondition(condition);

    service
        .tree(req.session.userData, '', condition)
        .then(function (data) {
            res.send(resUtil.success(data));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});

//所有
router.post('/find', function(req, res, next) {
    let condition = req.body, query = req.query,
    populate = '', sort = {'sort':1};
    condition = reqUtil.formatCondition(condition);

    service
        .find(req.session.userData, condition, populate, sort)
        .then(function (data) {
            res.send(resUtil.success({rows:data}));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});
//更新
router.post('/save/:id', function(req, res, next) {
    let data = req.body;
    let _id = req.params.id;

    data.updater = req.session.userData._id;

    service
        .updateById(req.session.userData, _id, data)
        .then(function (data) {
            res.send(resUtil.success({data:data}));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});
//新增
router.post('/save', function(req, res, next) {
    let data = req.body;
    data.creater = req.session.userData._id;
    data.updater = req.session.userData._id;

    service
        .save(req.session.userData, data)
        .then(function (data) {
            res.send(resUtil.success({data:data}));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});
//删除
router.get('/remove/:id', function(req, res, next) {
    let _id = req.params.id;

    service
        .removeById(req.session.userData, _id)
        .then(function (data) {
            res.send(resUtil.success({data:data}));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});
//批量删除
router.post('/remove', function(req, res, next) {
    let body = req.body;
    let condition = {
    _id : {"$in" : body.ids}
    };

    service
        .remove(req.session.userData, condition)
        .then(function (data) {
            res.send(resUtil.success({data:data}));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});
//详情
router.get('/detail/:id', function(req, res, next) {
    let _id = req.params.id;
    let populate = 'parent';

    service
        .findById(req.session.userData, _id, populate)
        .then(function (data) {
            res.send(resUtil.success({data:data}));
        }, function (err) {
            res.send(resUtil.error({}));
        });
});


module.exports = router;
