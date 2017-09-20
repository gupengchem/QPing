
'use strict';
const express = require('express');
const router = express.Router();
const extend = require('extend');
const url = require('url');
const request = require('request');

const qr = require('node-qr-image');
const resUtil = require("../../module/util/resUtil");

const ArticleService = require("../../service/article/ArticleService");
const BookcaseService = require("../../service/article/BookcaseService");

router.get('*', function(req, res, next) {
    req.viewParam = {__curMenu:'Article'};

    next();
});

module.exports = router;
