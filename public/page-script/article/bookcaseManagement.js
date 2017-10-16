/**
* Created by wangshuyi on 4/20/2017, 4:12:59 PM.
*/

'use strict';
const page = {
    editForm : $('#edit-form'),
    detailForm : $('#detail-form'),
    queryConditionForm: $('#queryConditionForm'),

    url : {
        list : '/article/bookcase/find',
        tree : '/article/bookcase/tree',
        remove : '/article/bookcase/remove/{id}',
        save : '/article/bookcase/save/{id}',
        detail : '/article/bookcase/detail/{id}',
    },

    _id : null,
    list : null,
    tree : null,
    editModal : null,

    init: null,
    initElement: null,
    initEvent: null,
    showDetail: null,
    formatterDate: null,
    toggleEditState: null,
};

page.init = function () {
    page.initElement();
    page.initEvent();
};

page.initElement = function () {
    const thisPage = this;
    Dolphin.form.parse();

    thisPage.tree = new Dolphin.TREE({
        panel : "#dataTree",
        url : thisPage.url.tree,
        idField : '_id',
        title : '文章树',
        multiple: false,
        onChecked: function (node) {
            thisPage.showDetail(node);
        },
        onLoad: function () {
            if(thisPage._id){
                this.check(this.findById(thisPage._id), true);
            }
        }
    });

    thisPage.list = new Dolphin.LIST({
        panel : "#dataList",
        url : thisPage.url.list,
        data : {rows:[]},
        pagination: false,
        checkbox: false,
        title : "子文章",
        queryParams : Dolphin.form.getValue('queryConditionForm'),
        columns : [{
            code: "name",
            title : "名称",
        },{
            code: "code",
            title : "编码",
        },{
            code: "sort",
            title : "排序",
        }]
    });

    thisPage.editModal = new Dolphin.modalWin({
        content : thisPage.editForm,
        title : "修改信息",
        defaultHidden : true,
        footer : $('#edit_form_footer'),
        hidden : function () {
            Dolphin.form.empty(thisPage.editForm);
        }
    });
};


page.initEvent = function () {
    const thisPage = this;

    //查询
    thisPage.queryConditionForm.submit(function () {
        thisPage.list.query(Dolphin.form.getValue('queryConditionForm'));
        return false;
    });

    //新增
    $('#addData').click(function () {
        thisPage._id = "";
        thisPage.editModal.modal('show');
    });

    //新增子节点
    $('#addChildrenData').click(function () {
        let checkedData = thisPage.tree.getChecked();
        if(checkedData.length != 1){
            Dolphin.alert("请选择一条数据");
        }else{
            let data = {
                parent: checkedData[0]._id,
                parentName: checkedData[0].name,
            };
            thisPage._id = "";
            Dolphin.form.setValue(data, thisPage.editForm);
            thisPage.editModal.modal('show');
        }
    });

    //修改
    $('#editData').click(function () {
        let checkedData = thisPage.tree.getChecked();
        if(checkedData.length != 1){
            Dolphin.alert("请选择一条数据");
        }else{
            thisPage._id = checkedData[0]._id;
            let data = $.extend({}, checkedData[0]);
            if(data._parent){
                data.parentName = data._parent.name;
                data.parent = data.parent._id;
            }
            Dolphin.form.setValue(data, thisPage.editForm);
            thisPage.editModal.modal('show');
        }
    });

    //删除
    $('#removeData').click(function () {
        let checkedData = thisPage.tree.getChecked();
        if(checkedData.length != 1){
            Dolphin.alert("请选择一条数据");
        }else{
            Dolphin.ajax({
                url : thisPage.url.remove,
                pathData : {id : checkedData[0]._id},
                onSuccess : function (reData) {
                    Dolphin.alert(reData.message, {
                        callback : function () {
                            thisPage._id = '';
                            thisPage.tree.reload();
                        }
                    })
                }
            })
        }
    });

    //保存
    $('#edit_form_save').click(function () {
        let data = Dolphin.form.getValue("edit-form");
        Dolphin.ajax({
            url : thisPage.url.save,
            type : Dolphin.requestMethod.POST,
            data : Dolphin.json2string(data),
            pathData : {id : thisPage._id},
            onSuccess : function (reData) {
                Dolphin.alert(reData.message, {
                    callback : function () {
                        thisPage._id = reData.data._id;
                        thisPage.tree.reload();
                        thisPage.showDetail(reData.data._id);
                        thisPage.editModal.modal('hide');
                    }
                });
            }
        });
    });
};

page.showDetail = function (node) {
    let thisPage = this;
    Dolphin.form.empty(thisPage.detailForm);
    Dolphin.form.setValue(node, thisPage.detailForm);
    thisPage.tree.expandTo(node);
    thisPage.list.query({parent:node._id});
};

page.formatterDate = function (val) {
    return Dolphin.date2string(new Date(Dolphin.string2date(val, "yyyy-MM-ddThh:mm:ss.").getTime() + 8 * 60 * 60 * 1000), "yyyy-MM-dd hh:mm:ss");
};
page.toggleEditState = function (state = 'detail', flag = false) {
    let thisPage = this;
    if(flag){
        Dolphin.form.empty(thisPage.detailForm);
        Dolphin.form.empty(thisPage.editForm);
    }
    switch(state){
        case 'edit':
            thisPage.detailForm.hide();
            thisPage.editForm.show();
            break;
        case 'detail':
            thisPage.detailForm.show();
            thisPage.editForm.hide();
            break;
    }
};


$(function () {
    Menu.select("Bookcase");
    page.init();
});