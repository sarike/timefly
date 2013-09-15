define(function(require, exports, module) {
    var BootStrap = require('bootstrap');
    var libs = require('libs');
    var $ = require('$')
    var _ = require('underscore');
    var Backbone = require('backbone');
    require("form")

    var addTodoModalTemplate = require("./templates/modals/add_todo_modal.tpl");

    $(function(){
        var context = {
            header: $("header"),
            sideBar: $("#sidebar"),
            content: $("#content"),
            footer: $("footer")
        };
        require("./src_index/index").init(context);

        var AddTodoModalView = libs.JQueryUI.Dialog.extend({
            template: _.template(addTodoModalTemplate),

            ok: function(){
                console.info("ok")
                this.$("#todo-form").ajaxSubmit(function(){
                    console.info("form submited!")
                });
            }
        });

        $(".add-new-todo").click(function(){
            var addTodoModal = new AddTodoModalView();
            addTodoModal.open({
                height: 410,
                width: 310,
                modal: true,
                title:"制定一个新的计划",
                resizable: false,
                open: function( event, ui ) {
                    $(this).find("input[type=text],textarea").addClass("input-block-level");
                }
            });
        });
    });
});
