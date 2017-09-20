'use strict';
const extend = require('extend');
const logger = require('log4js').getLogger("sys");

const CommonService = require("../../service/common/dbService");
const Model = require("../../module/article/BookcaseModel");

const defaultParams = {
    model : Model,
    basePath: '/bookcase',
};

class ModuleService extends CommonService{
    constructor(param){
        super(param);
        this.opts = extend(true, {}, this.opts, defaultParams, param);
        this._name = "BookcaseService";
    }
    tree(curUser = null, parentId = '', condition = {}){
        const thisService = this,
        superFind = super.find;
        let total = 1, count = 0, data = {_id: parentId}, _level = 0;

        return new Promise(function (resolve, reject) {
            function callback() {
                if(count == total){
                    resolve({level: _level, rows:data.children});
                }
            }

            function find(parent, level) {
                superFind.call(thisService, curUser, extend({parent: parent._id}, condition), 'parent', {'sort':1}).then(function (result) {
                    total += result.length;
                    if(result.length > 0){
                        _level = Math.max(level, _level);
                        parent.__type = 'folder';
                        parent.children = result;
                        result.forEach(function (subject) {
                            find(subject._doc || subject, level+1);
                        });
                    }else{
                        parent.__type = 'leaf';
                    }

                    count++;
                    callback();
                });
            }

            find(data, 1);
        });
    }
}

module.exports = new ModuleService();


