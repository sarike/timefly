define("sarike/timefly/1.0.0/timefly-debug", [ "sarike/bootstrap/2.3.2/bootstrap-debug", "$-debug", "jquery-plugin/form/3.36.0/form-debug", "sarike/utils/1.0.0/utils-debug", "gallery/backbone/1.0.0/backbone-debug", "gallery/underscore/1.4.4/underscore-debug", "./index/index-debug", "sarike/libs/1.0.0/libs-debug", "sarike/common/1.0.0/common-debug", "./index/templates/todo_item-debug.tpl", "./index/templates/index_content-debug.tpl", "./home/home-debug", "./home/templates/setting_form-debug.tpl", "./home/templates/password_reset_form-debug.tpl", "./home/templates/todo_item-debug.tpl", "./home/templates/add_complete_modal-debug.tpl" ], function(require) {
    require("sarike/bootstrap/2.3.2/bootstrap-debug");
    require("jquery-plugin/form/3.36.0/form-debug");
    require("sarike/utils/1.0.0/utils-debug");
    var $ = require("$-debug");
    var Backbone = require("gallery/backbone/1.0.0/backbone-debug");
    $(function() {
        //        $('#sidebar').affix(200);
        $.get("me", function(res) {
            var router = new Backbone.Router(), user = new Backbone.Model(res.data.user), context = {
                header: $("header"),
                sideBar: $("#sidebar"),
                content: $("#content"),
                footer: $("footer"),
                user: user,
                router: router
            };
            context.user.on("login-event", function(data) {
                context.user = data.user;
            });
            require("./index/index-debug").init(context);
            require("./home/home-debug").init(context);
            Backbone.history.start();
        });
    });
});

/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-15
 * Time: 下午9:58
 * To change this template use File | Settings | File Templates.
 */
define("sarike/timefly/1.0.0/index/index-debug", [ "sarike/libs/1.0.0/libs-debug", "$-debug", "gallery/underscore/1.4.4/underscore-debug", "sarike/common/1.0.0/common-debug" ], function(require, exports) {
    var libs = require("sarike/libs/1.0.0/libs-debug");
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Common = require("sarike/common/1.0.0/common-debug");
    var PassionateUserCollection = Common.Collections.BaseCollection.extend({
        url: "account/passionate_users"
    });
    var LatestTodoCollection = Common.Collections.BaseCollection.extend({
        url: "todo/latest_todos"
    });
    var TodoItem = Common.Views.Item.extend({
        className: "media",
        template: _.template(require("sarike/timefly/1.0.0/index/templates/todo_item-debug.tpl")),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var IndexContent = Common.Views.Content.extend({
        title: "最新计划",
        sub_title: "时光飞逝网友们最近发布的最新计划，一起来为他们加油吧",
        template: _.template(require("sarike/timefly/1.0.0/index/templates/index_content-debug.tpl")),
        itemContainer: ".media-list",
        ItemView: TodoItem
    });
    exports.init = function(context) {
        context.router.route("", "index", function() {
            var sideBarBoxes = [ new Common.Box.UserBox({
                collection: new PassionateUserCollection()
            }), new Common.Box.AboutBox() ], content = new IndexContent({
                collection: new LatestTodoCollection()
            });
            context.user.set("self_home", false);
            context.user.set("at_index_page", true);
            Common.init(context, {
                sideBarBoxes: sideBarBoxes,
                content: content
            });
        });
    };
});

define("sarike/timefly/1.0.0/index/templates/todo_item-debug.tpl", [], '  <a class="pull-left" href="./#<%=user.username %>">\n    <img class="media-object img-rounded"\n         src="http://www.gravatar.com/avatar/<%=user.avatar_hash %>?d=identicon">\n  </a>\n  <div class="media-body" style="font-size:14px;line-height: 20px;">\n    <h4 class="media-heading"><%=todo_name %></h4>\n        该计划由 <a href="./#<%=user.username %>"><%=user.nickname || user.username %></a>\n        开始于 <%=new Date(todo_start).format("yyyy-MM-dd") %> ，\n        计划在 <%=new Date(todo_end).format("yyyy-MM-dd") %> 完成！\n        <br>\n        <%=todo_description %>\n  </div>');

define("sarike/timefly/1.0.0/index/templates/index_content-debug.tpl", [], '<ul class="media-list">\n</ul>');

/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-26
 * Time: 下午20:09
 * To change this template use File | Settings | File Templates.
 */
define("sarike/timefly/1.0.0/home/home-debug", [ "sarike/libs/1.0.0/libs-debug", "$-debug", "gallery/underscore/1.4.4/underscore-debug", "gallery/backbone/1.0.0/backbone-debug", "sarike/common/1.0.0/common-debug" ], function(require, exports) {
    var libs = require("sarike/libs/1.0.0/libs-debug");
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Backbone = require("gallery/backbone/1.0.0/backbone-debug");
    var Common = require("sarike/common/1.0.0/common-debug");
    var settingFormTemplate = require("sarike/timefly/1.0.0/home/templates/setting_form-debug.tpl"), passwordResetTemplate = require("sarike/timefly/1.0.0/home/templates/password_reset_form-debug.tpl");
    var MyFriendsCollection = Common.Collections.BaseCollection.extend({
        url: "account/my_friends"
    });
    var MyTodosCollection = Common.Collections.BaseCollection.extend({
        url: "todo/my_todos"
    });
    exports.init = function(context) {
        var TodoItem = Common.Views.Item.extend({
            template: _.template(require("sarike/timefly/1.0.0/home/templates/todo_item-debug.tpl")),
            events: {
                "click a.mark-complete": "markComplete",
                "click a.delete-todo": "deleteTodo",
                "click a.change-visible": "changeVisible",
                "click a.add-new-complete": "addNewComplete"
            },
            dealTodo: function(url, callback, notification) {
                var todo_id = this.model.get("todo_id");
                libs.Noty.Confirm({
                    text: notification,
                    ok: function(noty) {
                        noty.close();
                        $.get(url, {
                            todo_id: todo_id
                        }, function(res) {
                            if (!!callback && typeof callback == "function") {
                                callback(res.data);
                            }
                            libs.Noty.NotyWithRes(res);
                        });
                    }
                });
            },
            markComplete: function() {
                var notification = this.model.get("todo_is_completed") ? "确定要撤销已完成状态吗？" : "确定要标记为完成吗？";
                this.dealTodo("/todo/mark_complete", $.proxy(function(data) {
                    this.model.set("todo_is_completed", data.todo_is_completed);
                }, this), notification);
            },
            deleteTodo: function() {
                this.dealTodo("/todo/delete_todo", $.proxy(function(data) {
                    this.$el.fadeOut();
                }, this), "确定要删除吗？");
            },
            changeVisible: function() {
                var notification = this.model.get("todo_visible") ? "确定要设为私密计划吗？" : "确定要公开该计划吗？";
                this.dealTodo("/todo/change_visible", $.proxy(function(data) {
                    this.model.set("todo_visible", data.todo_visible);
                }, this), notification);
            },
            addNewComplete: function() {
                var todo = this;
                var AddNewAcModal = libs.JQueryUI.Dialog.extend({
                    template: _.template(require("sarike/timefly/1.0.0/home/templates/add_complete_modal-debug.tpl")),
                    ok: function() {
                        this.$("#ac-form").submit();
                    },
                    extraRender: function() {
                        var ac_form = this.$("#ac-form");
                        var self = this;
                        ac_form.validate({
                            errorClass: "error",
                            submitHandler: function(form) {
                                $(form).ajaxSubmit($.proxy(function(res) {
                                    this.close();
                                    todo.model.get("achievement_list").splice(0, 0, res.data);
                                    todo.render();
                                }, self));
                            },
                            ignore: "input[type='checkbox']",
                            errorPlacement: function(error, element) {
                                element.prev().hide();
                                element.prev().after(error);
                            },
                            success: function(label) {
                                label.prev().show();
                                label.remove();
                            },
                            rules: {
                                ac_name: {
                                    required: true,
                                    maxlength: 20
                                },
                                ac_description: {
                                    required: true,
                                    maxlength: 100
                                }
                            },
                            messages: {
                                ac_name: {
                                    required: "不响亮不要紧，可不能不填哟",
                                    maxlength: jQuery.format("够响亮了，不过不能多于{0}个字符")
                                },
                                ac_description: {
                                    required: "你到底是完成了什么呢？",
                                    maxlength: jQuery.format("不过不能多于{0}个字符")
                                }
                            }
                        });
                    }
                });
                var addNewAcModal = new AddNewAcModal({
                    contentCollection: this.options.collection,
                    todo_id: this.model.get("todo_id")
                });
                addNewAcModal.open({
                    height: 335,
                    width: 300,
                    modal: true,
                    title: "记录新的突破",
                    resizable: false
                });
            },
            render: function() {
                this.$el.html(this.template({
                    todo: this.model.toJSON(),
                    user: context.user.toJSON()
                }));
                return this;
            }
        });
        var HomeContent = Common.Views.Content.extend({
            className: "",
            has_title: false,
            ItemView: TodoItem
        });
        var SettingContent = Common.Views.ObjectContent.extend({
            title: "个人描述",
            sub_title: "写下自己的奋斗宣言",
            template: _.template(settingFormTemplate),
            events: {
                "click #updateProfile": "updateProfile"
            },
            updateProfile: function() {
                var desc = this.$("#id_description").val();
                $.post("/account/update_profile", {
                    desc: desc
                }, function(res) {
                    libs.Noty.NotyWithRes(res);
                });
            }
        });
        var ResetPasswordContent = Common.Views.ObjectContent.extend({
            title: "密码重置",
            sub_title: "修改您的账号密码",
            template: _.template(passwordResetTemplate),
            events: {
                "click #resetPwd": "resetPwd"
            },
            resetPwd: function() {
                var old_password = this.$("#id_old_password").val();
                var new_password = this.$("#id_new_password").val();
                var new_password_confirm = this.$("#id_new_password_confirm").val();
                $.post("/account/reset_password", {
                    old_password: old_password,
                    new_password: new_password,
                    new_password_confirm: new_password_confirm
                }, function(res) {
                    libs.Noty.NotyWithRes(res);
                });
            }
        });
        var HomeSideNavBox = Common.Box.SideNavBox.extend({
            side_nav_list: [ {
                id: "doing",
                caption: "正在努力的计划",
                active: true
            }, {
                id: "completed",
                caption: "已经完成的计划"
            }, {
                id: "failed",
                caption: "半途而废的计划"
            } ],
            action: function(nav) {
                var nav_id = nav.data("id");
                this.options.content.refresh({
                    flag: nav_id
                });
            }
        });
        var SettingSideNavBox = Common.Box.SideNavBox.extend({
            side_nav_list: [ {
                active: true,
                id: "profile",
                caption: "个人资料"
            }, {
                id: "pwd_reset",
                caption: "密码设置"
            } ],
            action: function(nav) {
                var flag = nav.data("id");
                var settingContent = this.options.content;
                if (flag == "profile") context.content.html(settingContent.render().el);
                if (flag == "pwd_reset") context.content.html(new ResetPasswordContent().render().el);
            }
        });
        context.router.route(":username(/:position)", "home", function(username, position) {
            $.get("/" + username, function(res) {
                var owner = res.data.owner;
                var self_home = context.user.get("username") == owner["username"];
                context.user.set("self_home", self_home);
                context.user.set("at_index_page", false);
                var content = null, sideBarBoxes = null;
                if (!!position && position == "setting") {
                    console.info(context.user);
                    content = new SettingContent({
                        data: {
                            user: context.user.toJSON()
                        }
                    });
                    sideBarBoxes = [ new Common.Box.UserProfileBox({
                        model: new Backbone.Model(owner)
                    }), new SettingSideNavBox({
                        content: content
                    }), new Common.Box.AboutBox() ];
                } else {
                    content = new HomeContent({
                        data: {
                            user: context.user
                        },
                        collection: new MyTodosCollection()
                    });
                    sideBarBoxes = [ new Common.Box.UserProfileBox({
                        model: new Backbone.Model(owner)
                    }), new HomeSideNavBox({
                        content: content
                    }), new Common.Box.UserBox({
                        collection: new MyFriendsCollection()
                    }), new Common.Box.AboutBox() ];
                }
                Common.init(context, {
                    sideBarBoxes: sideBarBoxes,
                    content: content
                });
                $(document).tooltip();
            });
        });
    };
});

define("sarike/timefly/1.0.0/home/templates/setting_form-debug.tpl", [], '    <div class="control-group">\n        <div class="controls">\n            <textarea cols="40" class="input-block-level" id="id_description" rows="5"><%=user.description %></textarea>\n        </div>\n    </div>\n    <div class="control-group">\n        <div class="controls">\n            <button id="updateProfile" class="btn btn-info">保存更改</button>\n        </div>\n    </div>');

define("sarike/timefly/1.0.0/home/templates/password_reset_form-debug.tpl", [], '<div class="form-horizontal text-left" method="post">\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">原始密码</label>\n            <div class="controls">\n                <input id="id_old_password" maxlength="30" name="old_password" size="30" type="password">\n                <span class="inline label label-important"></span>\n                <!-- <span class="help-block"><a href="#">你竟然把密码给忘记了？</a></span> -->\n            </div>\n        </div>\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">新密码</label>\n            <div class="controls">\n            <input id="id_new_password" maxlength="30" name="new_password" size="30" type="password">\n            <span class="inline label label-important"></span>\n            </div>\n        </div>\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">确认密码</label>\n            <div class="controls">\n                <input id="id_new_password_confirm" maxlength="30" name="new_password_confirm" size="30" type="password">\n                <span class="inline label label-important"></span>\n            </div>\n        </div>\n        <div class="control-group">\n            <div class="controls">\n                <button id="resetPwd" class="btn btn-info">保存更改</button>\n            </div>\n        </div>\n    </div>');

define("sarike/timefly/1.0.0/home/templates/todo_item-debug.tpl", [], '<div class="todo">\n    <h2>\n        <%=todo.todo_name %>\n        <% if(user.is_authenticated && user.self_home){ %>\n            <span class="pull-right">\n                <a href="javascript:void(0)"\n                   class="mark-complete"\n                   title="<% if(todo.todo_is_completed){ %>\n                           撤销已完成状态\n                          <% }else{ %>\n                           设置为已完成\n                          <% } %>">\n                    <i class=" icon-ok"></i>\n                </a>\n                <% if(todo.todo_erasable){ %>\n                    <a href="javascript:void(0)"\n                       class="delete-todo"\n                       title="删除该计划">\n                        <i class=" icon-trash"></i>\n                    </a>\n                <% } %>\n                <a href="javascript:void(0)"\n                   class="change-visible"\n                   title="<% if(todo.todo_visible){ %>\n                             设置为仅对自己可见\n                          <% }else{ %>\n                             设置为对所有人可见\n                          <% } %>">\n                    <i class=" icon-eye-open"></i>\n                </a>\n                <% if(!todo.todo_is_completed){ %>\n                    <a href="javascript:void(0)"\n                       class="add-new-complete"\n                       title="添加新的进度">\n                        <i class="icon-plus"></i>\n                    </a>\n                <% } %>\n            </span>\n        <% } %>\n    </h2>\n    <div class="todo_meta shadow <% if(!todo.todo_visible){ %>todo_private<% } %>">\n        <div class="todo_info">\n            该计划由 <a href="./#<%=todo.user.username%>"> <%=todo.user.nickname || todo.user.username %> </a>\n            开始于  <%=todo.todo_start %> ，计划在\n             <%=todo.todo_end %>  完成！\n        </div>\n        <div class="todo_desc"><%=todo.todo_description %></div>\n    </div>\n\n    <div class="todo_complete">\n        <div class="accordion" id="todo-completes<%=todo.todo_id %>">\n        <% _.each(todo.achievement_list, function(ac, index){ %>\n            <div class="accordion-group">\n                <div class="accordion-heading">\n                    <a class="accordion-toggle" data-toggle="collapse"\n                        data-parent="#todo-completes<%=todo.todo_id %>" href="#collapse<%=ac.id %>">\n                        在 <%=ac.created_date %> <%=ac.ac_name %>\n                    </a>\n                </div>\n                <div id="collapse<%=ac.id %>" class="accordion-body <%if(index==0){ %>in<% } %> collapse ">\n                    <div class="accordion-inner"><%=ac.ac_description %></div>\n                </div>\n            </div>\n        <% }); %>\n        </div>\n    </div>\n</div>');

define("sarike/timefly/1.0.0/home/templates/add_complete_modal-debug.tpl", [], '<div id="acModal">\n    <div>\n        <form id="ac-form" action="todo/add_ac" method="post">\n            <input type="hidden" name="todo_id" value="<%=todo_id %>"/>\n            <label for="id_ac_name">为你这一重大突破起一个响亮的名字</label>\n            <input id="id_ac_name" maxlength="20" name="ac_name" type="text" class="input-block-level">\n            <label for="id_ac_description">描述一下你这次又做了哪些努力</label>\n            <textarea cols="40" id="id_ac_description" name="ac_description" rows="5" class="input-block-level"></textarea>\n        </form>\n    </div>\n</div>');
