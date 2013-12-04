/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-26
 * Time: 下午20:09
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports){
    var $ = require('$');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var libs = require('../libs/libs');
    var Common = require('../common/common');
    var markdown = require('markdown');

    var settingFormTemplate = require('./templates/setting_form.tpl'),
        passwordResetTemplate = require('./templates/password_reset_form.tpl');

    var MyFriendsCollection = Common.Collections.BaseCollection.extend({
        url: "account/my_friends"
    });

    var MyTodosCollection = Common.Collections.BaseCollection.extend({
        url: "todo/my_todos"
    });

    exports.init = function(context){

        var TodoItem = Common.Views.Item.extend({
            template: _.template(require("./templates/todo_item.tpl")),

            events: {
                'click a.mark-complete': 'markComplete',
                'click a.delete-todo': 'deleteTodo',
                'click a.change-visible': 'changeVisible',
                'click a.add-new-complete': 'addNewComplete'
            },

            dealTodo: function(url, callback, notification){
                var todo_id = this.model.get('todo_id');
                libs.Noty.Confirm({
                    text: notification,
                    ok: function(noty){
                        noty.close();
                        $.get(url, {todo_id: todo_id}, function(res){
                            if(!!callback && typeof callback == 'function'){
                                callback(res.data);
                            }
                            libs.Noty.NotyWithRes(res);
                        });
                    }
                });
            },

            markComplete: function(){
                var notification = this.model.get('todo_is_completed') ?
                    '确定要撤销已完成状态吗？' : '确定要标记为完成吗？';
                this.dealTodo('/todo/mark_complete', $.proxy(function(data){
                    this.model.set('todo_is_completed', data.todo_is_completed);
                }, this), notification);
            },

            deleteTodo: function(){
                this.dealTodo('/todo/delete_todo',  $.proxy(function(data){
                    this.$el.fadeOut();
                }, this), '确定要删除吗？');
            },

            changeVisible: function(){
                var notification = this.model.get('todo_visible') ?
                    '确定要设为私密计划吗？' : '确定要公开该计划吗？';
                this.dealTodo('/todo/change_visible', $.proxy(function(data){
                    this.model.set('todo_visible', data.todo_visible);
                }, this), notification);
            },

            addNewComplete: function(){
                var todo = this;
                var AddNewAcModal = libs.JQueryUI.Dialog.extend({
                    template: _.template(require("./templates/add_complete_modal.tpl")),

                    ok: function () {
                        this.$("#ac-form").submit();
                    },

                    extraRender: function(){
                        var ac_form = this.$("#ac-form");
                        var self = this;
                        ac_form.validate({
							errorClass: "error",
                            submitHandler: function (form) {
                                $(form).ajaxSubmit($.proxy(function (res) {
                                    this.close();
                                    todo.model.get('achievement_list').splice(0, 0, res.data);
                                    todo.render();
                                }, self));
                            },
							ignore: "input[type='checkbox']",
							errorPlacement: function(error, element) {
								element.prev().hide();
								element.prev().after(error);
							},
							success:function(label){
								label.prev().show();
								label.remove();
							},
							rules: {
								ac_name: {
									required:true,
									maxlength: 20
								},
								ac_description: 'required'
							},
							messages: {
								ac_name: {
									required: "不响亮不要紧，可不能不填哟",
									maxlength: jQuery.format("够响亮了，不过不能多于{0}个字符")
								},
								ac_description:  "你到底是完成了什么呢？"
							}
						});
                    }
                });
                var addNewAcModal = new AddNewAcModal({
                    contentCollection: this.options.collection,
                    todo_id: this.model.get('todo_id')
                });
                addNewAcModal.open({
                    height: 335,
                    width: 300,
                    modal: true,
                    title:"记录新的突破",
                    resizable: false
                });
            },

            render: function(){
                this.$el.html(this.template({
                    todo: this.model.toJSON(),
                    user: context.user.toJSON(),
                    markdown: markdown
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

            updateProfile: function(){
                var desc = this.$('#id_description').val();
                $.post('/account/update_profile', {desc: desc}, function(res){
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

            resetPwd: function(){
                var old_password = this.$('#id_old_password').val();
                var new_password = this.$('#id_new_password').val();
                var new_password_confirm = this.$('#id_new_password_confirm').val();
                $.post('/account/reset_password', {
                    old_password: old_password,
                    new_password: new_password,
                    new_password_confirm: new_password_confirm
                }, function(res){
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

            action: function(nav){
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

            action: function(nav){
                var flag = nav.data('id');
                var settingContent = this.options.content;
                if(flag == 'profile')
                    context.content.html(settingContent.render().el);
                if(flag == 'pwd_reset')
                    context.content.html(new ResetPasswordContent().render().el);
            }
        });

        context.router.route(":username(/:position)", "home", function(username, position){
            $.get("/" + username, function(res){
                var owner = res.data.owner;
                var self_home = context.user.get("username") == owner["username"];

                context.user.trigger('update-user-event', {
                    self_home: self_home,
                    at_index_page: false,
                    other_home_owner: owner["username"]
                });
                var content = null,
                    sideBarBoxes = null;

                if(!!position && position == 'setting'){
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
                }else{

                    content = new HomeContent({
                        data:{
                            user: context.user
                        },
                        collection: new MyTodosCollection()
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
            })
        });
    }
});