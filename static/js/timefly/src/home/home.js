/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-26
 * Time: 下午20:09
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports){
    var libs = require('libs');
    var $ = require('$');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Common = require('common');

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

            dealTodo: function(url, callback){
                var todo_id = this.model.get('todo_id');
                $.get(url, {todo_id: todo_id}, function(res){
                    if(!!callback && typeof callback == 'function'){
                        callback(res.data);
                    }
                    libs.Noty.NotyWithRes(res);
                });
            },

            markComplete: function(){
                this.dealTodo('/todo/mark_complete', $.proxy(function(data){
                    this.model.set('todo_is_completed', data.todo_is_completed);
                }, this));
            },

            deleteTodo: function(){
                this.dealTodo('/todo/delete_todo',  $.proxy(function(data){
                    this.$el.fadeOut();
                }, this));
            },

            changeVisible: function(){
                this.dealTodo('/todo/change_visible', $.proxy(function(data){
                    this.model.set('todo_visible', data.todo_visible);
                }, this));
            },

            addNewComplete: function(){
                var AddNewAcModal = libs.JQueryUI.Dialog.extend({
                    template: _.template(require("./templates/add_complete_modal.tpl")),

                    ok: function () {
                        this.$("#ac-form").submit();
                    },

                    extraRender: function(){
                        var ac_form = $("#ac-form");
                        var self = this;
                        ac_form.validate({
							errorClass: "error",
                            submitHandler: function (form) {
                                $(form).ajaxSubmit($.proxy(function (res) {
                                    if (this.options.contentCollection) {
                                        this.options.contentCollection.add(res.data);
                                    }
                                    this.close();
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
								ac_description: {
									required:true,
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
                var addNewAcModal = new AddNewAcModal();
                addNewAcModal.open({
                    height: 335,
                    width: 300,
                    modal: true,
                    title:"记录新的突破",
                    resizable: false
                });
                this.dealTodo('/add_new_complete');
            },

            render: function(){
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

        context.router.route(":username", "home", function(username){
            $.get("/" + username, function(res){
                var owner = res.data.owner;
                var self_home = context.user.get("username") == owner["username"];

                context.user.set('self_home', self_home);
                context.user.set('at_index_page', false);

                var sideBarBoxes = [
                        new Common.Box.UserProfileBox({model: new Backbone.Model(owner)}),
                        new Common.Box.UserBox({
                            collection: new MyFriendsCollection()
                        }),
                        new Common.Box.AboutBox()
                    ],
                    content = new HomeContent({
                        data:{
                            user: context.user
                        },
                        collection: new MyTodosCollection()
                    });

                Common.init(context, {
                    sideBarBoxes: sideBarBoxes,
                    content: content
                });
                $(document).tooltip();
            })
        });
    }
});