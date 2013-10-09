define(function (require, exports, module) {
    var libs = require('libs');
    var $ = require('$');
    var _ = require('underscore');
    var Backbone = require('backbone');

    // Models
    var BaseModel = Backbone.Model.extend({});

    // Collections
    var BaseCollection = Backbone.Collection.extend({
        model: BaseModel,
        parse: function (res) {
            return res.data.items;
        }
    });

    // Views
    var Item = Backbone.View.extend({

        initialize: function(){
            this.model.bind('change', $.proxy(this.render, this));
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var EmptyView = Backbone.View.extend({
        template: _.template(require("./templates/common_empty.tpl")),

        render: function(){
            this.$el.html(this.template());
            this.$el.show();
            return this;
        },

        hide: function(){
            this.$el.hide();
        }
    });

    var ItemsContainer = Backbone.View.extend({

        itemContainer: null,
        emptyView: new EmptyView(),

        initialize: function () {
            if (this.collection) {
                this.collection.bind("add", this.addItem, this);
            } else
                console.warn("No collection!");
            this.ItemView = this.ItemView || this.options.ItemView;
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        },

        renderEmpty: function(){
            this.$el.html(this.emptyView.render().el);
        },

        addItem: function (model) {
            if(this.collection.length > 0){
                this.emptyView.hide();
            }
            if (!this.ItemView) {
                console.warn("No ItemView!");
                return;
            }
            var itemView = new this.ItemView({model: model});
            itemView.$el.hide();
            if (this.itemContainer)
                this.$(this.itemContainer).prepend(itemView.render().el);
            else
                this.$el.prepend(itemView.render().el);
            itemView.$el.fadeIn();
        }
    });

    var ObjectBox = Backbone.View.extend({
        className: "box",

        render: function () {
            this.$el.html(this.template(!this.model ? {} : this.model.toJSON()));
            return this;
        }
    });

    var ArrayBox = ItemsContainer.extend({
        className: "box"
    });

    var Content = ItemsContainer.extend({
        className: "box",
        has_title: true,
        base_template: _.template(require("./templates/common_content.tpl")),

        render: function () {
            this.renderMainContent();
            this.renderSubContent();
            return this;
        },

        renderMainContent: function () {
            this.$el.html(this.base_template({
                has_title: this.title,
                title: this.title || this.options.title,
                sub_title: this.sub_title || this.options.sub_title
            }));
        },

        renderSubContent: function () {
            if (this.template)
                this.$el.append(this.template(this.options.data))
        },

        renderEmpty: function(){
            this.$el.append(this.emptyView.render().el);
        }
    });

    var Header = Backbone.View.extend({
        template: _.template(require("./templates/common_header.tpl")),
        events: {
            "click .add-new-todo": "addNewTodo",
            "click #login-btn": "doLogin",
            "click #reg-btn": "doReg"
        },

        doLogin: function () {
            this.$("#login-form").ajaxSubmit($.proxy(function (res) {
                if (res.response == 'ok') {
                    var cur_user = new Backbone.Model(res.data.user);
                    cur_user.set("self_home", this.user.get("self_home"));
                    cur_user.set("at_index_page", this.user.get("at_index_page"));
                    this.user.trigger("login-event", {user: cur_user});
                    this.user = cur_user;
                    this.render();
                } else {
                    libs.Noty.NotyWithRes(res);
                }
            }, this));
        },

        doReg: function () {

        },

        addNewTodo: function () {
            var addTodoModalTemplate = require("./templates/modals/add_todo_modal.tpl");
            var AddTodoModalView = libs.JQueryUI.Dialog.extend({
                template: _.template(addTodoModalTemplate),

                submitHandler: function (form) {
                    $(form).ajaxSubmit($.proxy(function (res) {
                        if (this.options.contentCollection) {
                            this.options.contentCollection.add(res.data);
                        }
                        this.close();
                    }, this));
                },

                ok: function () {
                    this.$("#todo-form").submit();
                },

                extraRender: function () {
                    var start_date = this.$("#id_todo_start"),
                        end_date = this.$("#id_todo_end"),
                        todo_form = this.$("#todo-form");

                    start_date.datepicker({
                        defaultDate: "+1w",
                        minDate: "+0d",
                        changeYear: true,
                        onClose: function (selectedDate) {
                            end_date.datepicker("option", "minDate", selectedDate);
                        }
                    });

                    end_date.datepicker({
                        defaultDate: "+1w",
                        minDate: "+0d",
                        changeYear: true,
                        onClose: function (selectedDate) {
                            start_date.datepicker("option", "maxDate", selectedDate);
                        }
                    });

                    var self = this;
                    todo_form.validate({
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
                        errorPlacement: function (error, element) {
                            element.prev().hide();
                            element.prev().after(error);
                        },
                        success: function (label) {
                            label.prev().show();
                            label.remove();
                        },
                        rules: {
                            todo_name: {
                                required: true,
                                maxlength: 20
                            },
                            todo_description: {
                                required: true,
                                maxlength: 100
                            },
                            todo_start: {
                                required: true,
                                date: true
                            },
                            todo_end: {
                                required: true,
                                date: true
                            }
                        },
                        messages: {
                            todo_name: {
                                required: "不响亮不要紧，可不能不填哟",
                                maxlength: jQuery.format("够响亮了，不过不能多于{0}个字符")
                            },
                            todo_description: {
                                required: "该计划到底想完成什么事情呢",
                                maxlength: jQuery.format("不过不能多于{0}个字符")
                            },
                            todo_start: {
                                required: "记得为该计划设定一个起始时间哟",
                                date: "我要的是日期，你输入的是火星文吗？"
                            },
                            todo_end: {
                                required: "记得为该计划设定一个结束时间哟",
                                date: "我要的是日期，你输入的是火星文吗？"
                            }
                        }
                    });
                }
            });
            var addTodoModal = new AddTodoModalView({
                contentCollection: this.options.contentCollection
            });
            addTodoModal.open({
                height: 410,
                width: 310,
                modal: true,
                title: "制定一个新的计划",
                resizable: false
            });
        },

        initialize: function () {
            if (!this.options.user)
                console.warn("you should pass a user obj when init header");
            else
                this.user = this.options.user
        },

        render: function () {
            this.$el.html(this.template({user: this.user.toJSON()}));
            return this;
        }
    });

    var Footer = Backbone.View.extend({

    });

    module.exports = {
        Models: {
            BaseModel: BaseModel
        },
        Collections: {
            BaseCollection: BaseCollection
        },
        Views: {
            Item: Item,
            ItemsContainer: ItemsContainer,
            EmptyView: EmptyView,
            ObjectBox: ObjectBox,
            ArrayBox: ArrayBox,
            Content: Content,
            Header: Header,
            Footer: Footer
        }
    }
});