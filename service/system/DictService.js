'use strict';
const extend = require('extend');
const logger = require('log4js').getLogger("sys");

const CommonService = require("../../service/common/dbService");
const Model = require("../../module/system/DictModel");

const defaultParams = {
    model : Model,
    findCondition: (curUser, thisService) => {
        return { state: 1 }
    },
    saveExtend: (curUser, thisService) => {
        return {}
    }
};

class ModuleService extends CommonService{
    constructor(param){
        super(param);
        this.opts = extend(true, {}, this.opts, defaultParams, param);
        this._name = "DictService";
    }
}

module.exports = new ModuleService();


