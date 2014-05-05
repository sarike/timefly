/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-26
 * Time: 下午20:09
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports) {
    "use strict";
    var $ = require('$'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        libs = require('../libs/libs'),
        Common = require('../common/common'),
        Editor = require('../editor/editor');

    var AcContentEditor = Editor.extend({
        text_area_name: 'ac_description',
        editor_label: '描述一下你这次又做了哪些努力'
    });

    var settingFormTemplate = require('./templates/setting_form.tpl'),
        passwordResetTemplate = require('./templates/password_reset_form.tpl');

    var MyFriendsCollection = Common.Collections.BaseCollection.extend({
        url: "account/my_friends"
    });

    var TodoModel = Common.Models.BaseModel.extend({
        url: "todo/get_todo"
    });

    var MyTodoCollection = Common.Collections.BaseCollection.extend({
        url: "todo/my_todos"
    });

    var AddNewAcModal = libs.JQueryUI.Dialog.extend({
        template: _.template(require("./templates/add_complete_modal.tpl")),

        ok: function () {
            this.$("#ac-form").submit();
        },

        extraInitialize: function () {
            this.todoView = this.options.todoView;
            _.extend(this.tpl_data, {
                todo_id: this.todoView.model.get('todo_id')
            });
        },

        extraRender: function () {
            this.$('.editor-field').html(this.options.editor.render().el);
            var ac_form = this.$("#ac-form");
            var self = this;
            ac_form.validate({
                errorClass: "error",
                submitHandler: _.once(function (form) {
                    $(form).ajaxSubmit($.proxy(function (res) {
                        this.close();
                        this.todoView.model.get('achievement_list').push(res.data);
                        this.todoView.render();
                    }, self));
                }),
                ignore: "input[type='checkbox']",
                errorPlacement: function (error, element) {
                    element.prev().hide();
                    element.prev().after(error);
                },
                success: function (label) {
                    label.prev().show();
                    label.remove();
                },
                rules: {
                    ac_name: {
                        required: true,
                        maxlength: 128
                    },
                    ac_description: 'required'
                },
                messages: {
                    ac_name: {
                        required: "不响亮不要紧，可不能不填哟",
                        maxlength: jQuery.format("够响亮了，不过不能多于{0}个字符")
                    },
                    ac_description: "你到底是完成了什么呢？"
                }
            });
        }
    });

    exports.init = function (context) {

        var editor = new AcContentEditor();

        var TodoItem = Common.Views.Item.extend({
            template: _.template(require("./templates/todo_item.tpl")),

            className: 'todo',

            events: {
                'click a.mark-complete': 'markComplete',
                'click a.delete-todo': 'deleteTodo',
                'click a.change-visible': 'changeVisible',
                'click a.add-new-complete': 'addNewComplete',
                'click .down-vote': 'downVote',
                'click .up-vote': 'upVote',
                'click .comment': 'openCommentList',
                'mouseover .todo-wrapper': 'toggleOps',
                'mouseout .todo-wrapper': 'toggleOps'
            },

            openCommentList: function(){
                if(!this.comments_opened){
                    if(this.comments_el){
                        this.$('.comment-list').slideDown();
                        this.comments_opened = true;
                    }else{
                        this.comments_el = $('<div/>');//该div不需要设置class="ds-thread"
                        this.comments_el.attr('data-thread-key', this.model.get('todo_id'))
                            .attr('data-url', 'http://www.timefly.cn/#sarike/todo/' + this.model.get('todo_id'))
                            .attr('data-author-key', this.model.get('user').user_id);//可选参数
                        DUOSHUO.EmbedThread(this.comments_el);
                        this.$('.comment-list').html(this.comments_el).slideDown();
                        this.comments_opened = true;
                    }
                }else{
                    this.$('.comment-list').slideUp();
                    this.comments_opened = false;
                }
            },

            toggleOps: function () {
                this.$(".todo-ops").toggle();
            },

            dealTodo: function (url, callback, notification) {
                var todo_id = this.model.get('todo_id');
                if (!notification) {
                    $.get(url, {todo_id: todo_id}, function (res) {
                        if (!!callback && typeof callback === 'function') {
                            callback(res.data);
                        }
                        libs.Noty.NotyWithRes(res);
                    });
                } else {
                    libs.Noty.Confirm({
                        text: notification,
                        ok: function (noty) {
                            noty.close();
                            $.get(url, {todo_id: todo_id}, function (res) {
                                if (!!callback && typeof callback === 'function') {
                                    callback(res.data);
                                }
                                libs.Noty.NotyWithRes(res);
                            });
                        }
                    });
                }
            },

            downVote: function () {
                this.dealTodo('/todo/down_vote', $.proxy(function (data) {
                    if (data) {
                        this.model.set('todo_down_vote', data);
                    }
                }, this));
            },

            upVote: function () {
                this.dealTodo('/todo/up_vote', $.proxy(function (data) {
                    if (data) {
                        this.model.set('todo_up_vote', data);
                    }
                }, this));
            },

            markComplete: function () {
                var notification = this.model.get('todo_is_completed') ? '确定要撤销已完成状态吗？' : '确定要标记为完成吗？';
                this.dealTodo('/todo/mark_complete', $.proxy(function (data) {
                    this.model.set('todo_is_completed', data.todo_is_completed);
                }, this), notification);
            },

            deleteTodo: function () {
                this.dealTodo('/todo/delete_todo', $.proxy(function (data) {
                    this.$el.fadeOut();
                }, this), '确定要删除吗？');
            },

            changeVisible: function () {
                var notification = this.model.get('todo_visible') ? '确定要设为私密计划吗？' : '确定要公开该计划吗？';
                this.dealTodo('/todo/change_visible', $.proxy(function (data) {
                    this.model.set('todo_visible', data.todo_visible);
                }, this), notification);
            },

            addNewComplete: function () {
                var addNewAcModal = new AddNewAcModal({
                    editor: editor,
                    todoView: this
                });
                addNewAcModal.open({
                    width: $(window).width() * 0.6,
                    modal: true,
                    title: "记录新的突破",
                    resizable: false
                });
            },

            render: function () {
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
            title: '个人描述',
            sub_title: '写下自己的奋斗宣言',
            template: _.template(settingFormTemplate),

            events: {
                'click #updateProfile': 'updateProfile'
            },

            updateProfile: function () {
                var desc = this.$('#id_description').val();
                $.post('/account/update_profile', {desc: desc}, function (res) {
                    libs.Noty.NotyWithRes(res);
                });
            }
        });

        var ResetPasswordContent = Common.Views.ObjectContent.extend({
            title: '密码重置',
            sub_title: '修改您的账号密码',
            template: _.template(passwordResetTemplate),
            events: {
                'click #resetPwd': 'resetPwd'
            },

            resetPwd: function () {
                var old_password = this.$('#id_old_password').val();
                var new_password = this.$('#id_new_password').val();
                var new_password_confirm = this.$('#id_new_password_confirm').val();
                $.post('/account/reset_password', {
                    old_password: old_password,
                    new_password: new_password,
                    new_password_confirm: new_password_confirm
                }, function (res) {
                    libs.Noty.NotyWithRes(res);
                });
            }
        });

        var HomeSideNavBox = Common.Box.SideNavBox.extend({
            side_nav_list: [
                {
                    id: 'doing',
                    caption: '正在努力的计划',
                    active: true
                },
                {
                    id: 'completed',
                    caption: '已经完成的计划'
                },
                {
                    id: 'failed',
                    caption: '半途而废的计划'
                }
            ],

            action: function (nav) {
                var nav_id = nav.data('id');
                this.options.content.refresh({flag: nav_id});
            }
        });

        var SettingSideNavBox = Common.Box.SideNavBox.extend({
            side_nav_list: [
                {
                    active: true,
                    id: 'profile',
                    caption: '个人资料'
                },
                {
                    id: 'pwd_reset',
                    caption: '密码设置'
                }
            ],

            action: function (nav) {
                var flag = nav.data('id'),
                    settingContent = this.options.content;
                if (flag === 'profile') {
                    context.content.html(settingContent.render().el);
                }
                if (flag === 'pwd_reset') {
                    context.content.html(new ResetPasswordContent().render().el);
                }
            }
        });

//        context.router.route(":username", "home", function(username){
//
//        });

        context.router.route(":username(/:position)", "home", function (username, position) {
            $.get("/" + username, function (res) {
                var owner = res.data.owner;
                var self_home = context.user.get("username") === owner.username;

                context.user.trigger('update-user-event', {
                    self_home: self_home,
                    at_index_page: false,
                    other_home_owner: owner.username
                });
                var content = null,
                    sideBarBoxes = null;

                if (!!position && position === 'setting') {
                    content = new SettingContent({
                        data: {
                            user: context.user.toJSON()
                        }
                    });

                    sideBarBoxes = [
                        new Common.Box.UserProfileBox({model: new Backbone.Model(owner)}),
                        new SettingSideNavBox({
                            content: content
                        }),
                        new Common.Box.AboutBox()
                    ];
                } else {

                    content = new HomeContent({
                        data: {
                            user: context.user
                        },
                        collection: new MyTodoCollection()
                    });

                    sideBarBoxes = [
                        new Common.Box.UserProfileBox({model: new Backbone.Model(owner)}),
                        new HomeSideNavBox({
                            content: content
                        }),
                        new Common.Box.UserBox({
                            collection: new MyFriendsCollection()
                        }),
                        new Common.Box.AboutBox()
                    ];
                }

                Common.init(context, {
                    sideBarBoxes: sideBarBoxes,
                    content: content
                });
                $(document).tooltip();
            });
        });

        context.router.route(":username/todo/:todo_id(/:ac_id)", "home_todo", function(username, todo_id, ac_id){
            $.get("/" + username, function (res) {
                var owner = res.data.owner;
                var self_home = context.user.get("username") === owner.username;

                context.user.trigger('update-user-event', {
                    self_home: self_home,
                    at_index_page: false,
                    other_home_owner: owner.username
                });
                var todoCollection = new MyTodoCollection();
                todoCollection.queryString = {
                    todo_id: todo_id,
                    ac_id: ac_id
                };
                var content = new HomeContent({
                    data: {
                        user: context.user
                    },
                    collection: todoCollection
                });

                var sideBarBoxes = [
                    new Common.Box.UserProfileBox({model: new Backbone.Model(owner)}),
                    new HomeSideNavBox({
                        content: content
                    }),
                    new Common.Box.UserBox({
                        collection: new MyFriendsCollection()
                    }),
                    new Common.Box.AboutBox()
                ];

                Common.init(context, {
                    sideBarBoxes: sideBarBoxes,
                    content: content
                });
                $(document).tooltip();
            });
        });
    };
});