'use strict';

const extend = require('extend');
const express = require('express');
const router = express.Router();
const logger = require('log4js').getLogger("sys");
const qr = require('qr-image');

router.get('/qr/:code', function(req, res, next) {
    let content = req.params.code;
    var code = qr.image(content, { type: 'png' });
    res.setHeader('Content-type', 'image/png');  //sent qr image to client side
    code.pipe(res);
});

module.exports = router;
