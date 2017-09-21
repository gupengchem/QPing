/**
* Created by wangshuyi on 4/20/2017, 3:45:24 PM.
*/

'use strict';
var um;
const page = {
    editForm : $('#edit-form'),
    detailForm : $('#detail-form'),
    queryConditionForm: $('#queryConditionForm'),

    url : {
        list : '/article/article/find',
        tree : '/article/article/tree',
        remove : '/article/article/remove/{id}',
        save : '/article/article/save/{id}',
        detail : '/article/article/detail/{id}',

        file: {
            add : Dolphin.path.contextPath + '/system/tool/file/save',
        }
    },

    _id : '',
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
    let thisPage = this;
    um = UM.getEditor('myEditor', {
        imageUrl: thisPage.url.file.add + '?type=editor',
        imagePath: "",
        imageFieldName: "media"
    });

    if(contextData.data.bookcase){
        page.initElement();
        page.initEvent();
    }else{
        Dolphin.alert('未选择所属目录', {
            callback : function () {
                Dolphin.goUrl('/article/articleList');
            }
        })
    }
};

page.initElement = function () {
    const thisPage = this;
    Dolphin.form.parse();

    if(contextData.data.id){
        thisPage._id = contextData.data.id;
        Dolphin.ajax({
            url : thisPage.url.detail,
            pathData : {id : thisPage._id},
            loading : true,
            onSuccess : function (reData) {
                Dolphin.form.setValue(reData.data, thisPage.editForm, {
                    formatter: {
                        effectiveTime: function (val) {
                            return thisPage.formatterDate(val);
                        },
                        disActiveTime: function (val) {
                            return thisPage.formatterDate(val);
                        },
                    }
                });
                if(reData.data.img){
                    $("#imageBody").attr("src", Dolphin.path.uploadPath+reData.data.img.filePath).show();
                    thisPage.editForm.find('input[name="img"]').val(reData.data.img._id);
                }
                thisPage.editForm.find(`[name="tags"]`).val(reData.data.tags);
                if (reData.data.content)
                    um.setContent(reData.data.content);
            }
        })
    }
};


page.initEvent = function () {
    const thisPage = this;

    //保存
    $('#save').click(function () {
        let data = Dolphin.form.getValue("edit-form");
        console.log(data);
        data.content = um.getContent();
        Dolphin.ajax({
            url : thisPage.url.save,
            type : Dolphin.requestMethod.POST,
            data : Dolphin.json2string(data),
            pathData : {id : thisPage._id},
            onSuccess : function (reData) {
                Dolphin.alert(reData.message, {
                    callback : function () {
                        Dolphin.goUrl('/article/articleList');
                    }
                });
            }
        });
    });

    $('#fileupload').fileupload({
        url: thisPage.url.file.add+'?type=article',
        dataType: 'json',
        done: function (e, data) {
            $("#imageBody").attr("src", Dolphin.path.uploadPath+data.result.data.filePath).show();
            $("#coverImage").val(data.result.data._id);
        },
    });

};

page.formatterDate = function (val) {
    return Dolphin.date2string(new Date(Dolphin.string2date(val, "yyyy-MM-ddThh:mm:ss.").getTime() + 8 * 60 * 60 * 1000), "yyyy-MM-dd");
};

$(function () {
    Menu.select("Article");
    page.init();
});