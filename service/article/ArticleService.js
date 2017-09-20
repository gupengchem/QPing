'use strict';
const extend = require('extend');
const logger = require('log4js').getLogger("sys");

const CommonService = require("../../service/common/dbService");
const Model = require("../../module/article/ArticleModel");

const defaultParams = {
    model : Model,
    basePath: '/article',
    findCondition: (curUser) => {
        let condition = { state: 1 };
        return condition;
    },
};

class ModuleService extends CommonService{
    constructor(param){
        super(param);
        this.opts = extend(true, {}, this.opts, defaultParams, param);
        this._name = "ArticleService";
    }
}

module.exports = new ModuleService();


