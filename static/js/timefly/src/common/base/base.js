define(function (require, exports, module) {
    "use strict";
    var libs = require('../../libs/libs'),
        Editor = require('../../editor/editor'),
        $ = require('$'),
        _ = require('underscore'),
        Backbone = require('backbone');

    require("jquery-validate");

    // Models
    var BaseModel = Backbone.Model.extend({
        queryString:{}
    });

    var BaseUser = Backbone.Model.extend({
        initialize: function () {
            this.on('update-user-event', this.updateUser, this);
        },

        updateUser: function (data) {
            this.set(data);
        }
    });

    // Collections
    var BaseCollection = Backbone.Collection.extend({
        model: BaseModel,
        initialize: function(){
            this.queryString = {};
        },
        parse: function (res) {
            return res.data.items;
        }
    });

    // Views
    var Item = Backbone.View.extend({

        initialize: function () {
            this.model.bind('change', $.proxy(this.render, this));
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var EmptyView = Backbone.View.extend({
        template: _.template(require("./templates/common_empty.tpl")),

        render: function () {
            this.$el.html(this.template());
            this.$el.show();
            return this;
        },

        hide: function () {
            this.$el.hide();
        }
    });

    var ItemsContainer = Backbone.View.extend({

        itemContainer: null,
        emptyView: new EmptyView(),

        initialize: function () {
            if (this.collection) {
                this.collection.bind("add", this.addItem, this);
            } else {
                console.error("No collection!");
            }
            this.ItemView = this.ItemView || this.options.ItemView;
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        },

        refresh: function (data) {
            this.$el.empty();
            if (this.collection) {
                this.collection.fetch({
                    success: $.proxy(function (collection) {
                        if (collection.length === 0) {
                            this.renderEmpty();
                        }
                    }, this),
                    data: data || {}
                });
            }
        },

        reRender: function () {
            if (this.itemContainer) {
                this.itemContainer.empty();
            } else {
                this.$el.empty();
            }
            this.collection.each(this.addItem, this);
        },

        renderEmpty: function () {
            this.$el.html(this.emptyView.render().el);
        },

        addItem: function (model) {
            if (this.collection.length > 0) {
                this.emptyView.hide();
            }
            if (!this.ItemView) {
                console.warn("No ItemView!");
                return;
            }
            var itemView = new this.ItemView({model: model});
            itemView.$el.hide();
            if (this.itemContainer) {
                this.$(this.itemContainer).prepend(itemView.render().el);
            } else {
                this.$el.prepend(itemView.render().el);
            }
            itemView.$el.fadeIn();
        }
    });

    var PlainBox = Backbone.View.extend({
        className: ""
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

    var ObjectContent = ObjectBox.extend({

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
            if (this.template) {
                if(this.options.data){
                    this.$el.append(this.template(this.options.data));
                }else if(this.model){
                    var self = this;
                    this.model.fetch({
                        data: this.model.queryString,
                        success: function(model){
                            self.$el.append(self.template(model.toJSON()));
                        }
                    })
                }else{
                    this.$el.append(this.template());
                }
            }
        }
    });

    var Content = ArrayBox.extend({
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
            if (this.template) {
                this.$el.append(this.template(this.options.data));
            }
        },

        renderEmpty: function () {
            this.$el.append(this.emptyView.render().el);
        }
    });

    var TodoEditor = Editor.extend({
        text_area_name: 'todo_description',
        editor_label: '描述一下该计划打算要完成的事情'
    });

    var AddOrEditTodoView = Backbone.View.extend({
        template: _.template(require("./templates/add_edit_todo.tpl")),
        className: 'box',

        events: {
            "click button.submit": 'submitTodoForm',
            "click button.cancel": "cancel"
        },

        render: function () {
            this.$el.html(this.template());
            this.$('.editor-field').html(this.editor.render().el);
            this.initFormValidation();
            this.initDatePicker();
            return this;
        },

        submitTodoForm: function (e) {
            this.$("#add_todo_form").submit();
            delete this.options.header.addOrEditNewTodoView;
            e.preventDefault();
        },

        destroy: function () {
            this.$el.remove();
        },

        cancel: function () {
            this.$el.slideUp();
            return false;
        },

        initFormValidation: function () {
            var todo_form = this.$("#add_todo_form");
            var self = this;
            todo_form.validate({
                errorClass: "input-error",
                submitHandler: _.once(function (form) {
                    $(form).ajaxSubmit($.proxy(function (res) {
                        if (this.contentView.collection) {
                            this.contentView.collection.add(res.data);
                        }
                        self.destroy();
                    }, self));
                }),
                ignore: "input[type='checkbox']",
                errorPlacement: function (error, element) {
                },
                rules: {
                    todo_name: {
                        required: true,
                        maxlength: 128
                    },
                    todo_description: 'required',
                    todo_start: {
                        required: true,
                        date: true
                    },
                    todo_end: {
                        required: true,
                        date: true
                    }
                }
            });
        },

        initDatePicker: function () {
            var start_date = this.$("#id_todo_start"),
                end_date = this.$("#id_todo_end");

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
        },

        initialize: function () {
            this.editor = new TodoEditor();
            this.contentView = this.options.contentView;
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
                if (res.response === 'ok') {
                    res.data.user.self_home = res.data.user.username === this.user.get("other_home_owner");
                    res.data.user.at_index_page = !res.data.user.self_home;
                    this.user.trigger("update-user-event", res.data.user);
                    this.render();
                    if (res.data.user.self_home) {
                        this.contentView.reRender();
                    }
                } else {
                    libs.Noty.NotyWithRes(res);
                }
            }, this));
        },

        doReg: function () {

        },

        addNewTodo: function () {
            if (!this.addOrEditNewTodoView) {
                this.addOrEditNewTodoView = new AddOrEditTodoView({
                    contentView: this.contentView,
                    header: this
                });
                this.addOrEditNewTodoView.$el.hide();
                $("#content").prepend(this.addOrEditNewTodoView.render().el);
            }
            this.addOrEditNewTodoView.$el.slideToggle();
        },

        initialize: function () {
            this.user = this.options.user;
            this.contentView = this.options.content;
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
            BaseModel: BaseModel,
            BaseUser: BaseUser
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
            PlainBox: PlainBox,
            Content: Content,
            ObjectContent: ObjectContent,
            Header: Header,
            Footer: Footer
        }
    };
});