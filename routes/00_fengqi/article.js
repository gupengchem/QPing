/**
 * Created by wangshuyi on 1/20/2017, 9:18:54 AM.
 */

'use strict';

const extend = require('extend');

const express = require('express');
const router = express.Router();

const logger = require('log4js').getLogger("sys");

const resUtil = require("../../module/util/resUtil");
const reqUtil = require("../../module/util/reqUtil");

const BookcaseService = require('../../service/article/BookcaseService');
const ArticleService = require('../../service/article/ArticleService');

//导入
router.get('/articleList', function(req, res, next) {
    let bookcasesId = req.query.bookcasesId;
    console.log(bookcasesId);
    let list;
    BookcaseService.findById({}, bookcasesId).then(bookcase => {
        ArticleService.find({},{bookcase:bookcasesId}, 'img', {sort: 1})
            .then(function (data) {
                list = data;
                console.log(data);
                res.render('article/moblieArticalList',{articalList:list, bookcase: bookcase})
            },function (error) {
                console.log(error);
            })
    });

});

router.get('/articleView/:articleCode', function(req, res, next){
    let articleCode = req.params.articleCode;
    ArticleService.findOne({}, { code: articleCode }, 'bookcase').then(article => {
        res.render('article/articleView', extend({}, {body:article || {}}));
    });
});


module.exports = router;
