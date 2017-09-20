/**
* Created by wangshuyi on 4/20/2017, 3:45:24 PM.
*/

'use strict';
const page = {
    editForm : $('#edit-form'),
    detailForm : $('#detail-form'),
    queryConditionForm: $('#queryConditionForm'),

    addArticleButton: $('#addArticleButton'),
    updateArticleButton: $('#updateArticleButton'),
    removeArticleButton: $('#removeArticleButton'),
    copyUrlButton:$('[id^=copyUrlButton]'),
    copyButton:$('#copys'),

    url : {
        list : '/article/bookcase/find',
        tree : '/article/bookcase/tree',
        remove : '/article/bookcase/remove/{id}',
        save : '/article/bookcase/save/{id}',
        detail : '/article/bookcase/detail/{id}',

        articleList : '/article/article/list',
        articleRemove : '/article/article/remove/{id}',
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
    let clipboard = new Clipboard('.btn');
    thisPage.tree = new Dolphin.TREE({
        panel : "#dataTree",
        url : thisPage.url.tree,
        idField : '_id',
        title : '文章树',
        multiple: false,
        onChecked: function (node) {
            thisPage.addArticleButton.removeAttr('disabled');
            thisPage.addArticleButton.removeAttr('disabled');
            thisPage.copyButton.css("display","block");
            thisPage.showDetail(node);
        },
        onLoad: function () {
            thisPage.addArticleButton.attr('disabled','disabled');
            thisPage.updateArticleButton.attr('disabled','disabled');
            thisPage.removeArticleButton.attr('disabled','disabled');
            if(thisPage._id){
                this.check(this.findById(thisPage._id), true);
            }
        }
    });

    thisPage.list = new Dolphin.LIST({
        panel : "#dataList",
        url : thisPage.url.articleList,
        data : {rows:[]},
        pagination: false,
        multiple: false,
        // title : "文章列表",
        queryParams : Dolphin.form.getValue('queryConditionForm'),
        columns : [{
            code: "name",
            title : "标题",
        },{
            code: "bookcase.name",
            title : "所属目录",
            width: '80px',
        },{
            code: "author",
            title : "作者",
            width: '80px',
        },{
            code: "time",
            title : "时间",
            formatter: function (val) {
                return thisPage.formatterDate(val);
            }
        },{
            code: "code",
            title : "地址",
            width: '350px',
            formatter: function (val, row) {

                let div = $(`<div> `);
                if(row.thirdUrl){
                    $('<a id="a${row._id}" >').addClass('textNowrap')
                        .html(`${row.thirdUrl}`)
                        .attr('href',`${row.thirdUrl}`)
                        .attr('target', '_black')
                        .appendTo(div);
                }else{
                    $('<a id="a${row._id}" class="textNowrap">').addClass('textNowrap')
                        .html(`${Dolphin.path.domain}${Dolphin.path.contextPath}/fengqi/article/articleView/${row.code}`)
                        .attr('href',`${Dolphin.path.contextPath}/view/article/articleMobileView?code=${row.code}`)
                        .attr('target', '_black')
                        .appendTo(div);
                }
                return div;

            }
        },
            {
                code: "copy",
                title : "复制链接",
                formatter: function (val, row) {
                    let div = $('<div>');
                    let url;
                    if(row.thirdUrl){
                        url = row.thirdUrl
                    }else{
                        url = `${Dolphin.path.domain}${Dolphin.path.contextPath}/fengqi/article/articleView/${row.code}`
                    }
                    $('<a>').addClass('')
                        .html(`<button  type="button" class="btn btn-primary"  data-clipboard-text=${url} ">复制链接</button>`)
                        .appendTo(div);
                    return div;
                }
            }],
        onClick: function (data) {
            thisPage.updateArticleButton.removeAttr('disabled');
            thisPage.removeArticleButton.removeAttr('disabled');
        },
        onLoadSuccess: function (data) {
            thisPage.updateArticleButton.attr('disabled','disabled');
            thisPage.removeArticleButton.attr('disabled','disabled');
        }
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
    $('#editDate').click(function () {
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
    $('#removeDate').click(function () {
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

    //文章
    thisPage.addArticleButton.click(function () {
        let checkedData = thisPage.tree.getChecked();
        if(checkedData.length != 1){
            Dolphin.alert('请选择一个目录');
        }else{
            Dolphin.goUrl(`/article/articleEdit?bookcase=${checkedData[0]._id}`);
        }
    });
    thisPage.updateArticleButton.click(function () {
        let checkedData = thisPage.tree.getChecked();
        let checkedList = thisPage.list.getChecked();
        if(checkedData.length != 1){
            Dolphin.alert('请选择一个目录');
        }else if(checkedList.length != 1){
            Dolphin.alert('请选择一条新闻');
        }else{
            Dolphin.goUrl(`/article/articleEdit?bookcase=${checkedData[0]._id}&id=${checkedList[0]._id}`);
        }
    });
    thisPage.removeArticleButton.click(function () {
        let checkedData = thisPage.list.getChecked();
        if(checkedData.length != 1){
            Dolphin.alert("请选择一条数据");
        }else{
            Dolphin.confirm("确定要删除这条数据吗？", {
                callback : function (flag) {
                    if(flag){
                        Dolphin.ajax({
                            url : thisPage.url.articleRemove,
                            pathData : {id : checkedData[0]._id},
                            onSuccess : function (reData) {
                                Dolphin.alert(reData.message, {
                                    callback : function () {
                                        thisPage.list.reload();
                                    }
                                })
                            }
                        })
                    }
                }
            });
        }
    });
};

page.showDetail = function (node) {
    let thisPage = this;
    node.articalUrl =`${Dolphin.path.domain}/fengqi/article/articleList?bookcasesId=${node._id}`;
    thisPage.copyButton.attr("data-clipboard-text",`${ node.articalUrl}`);
    $('#articalUrl').html(`${node.articalUrl }`)
        .attr('href',`${node.articalUrl}`)
        .attr('target', '_black');
    Dolphin.form.empty(thisPage.detailForm);
    Dolphin.form.setValue(node, thisPage.detailForm);
    thisPage.tree.expandTo(node);

    let bookcase = [];

    function allBookcase(_node) {
        bookcase.push(_node._id);
        if(_node.children){
            _node.children.forEach(function (n) {
                allBookcase(n);
            })
        }
    }
    allBookcase(node);

    thisPage.list.query({bookcase:{'$in':bookcase}});
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
    Menu.select("Article");
    page.init();

});