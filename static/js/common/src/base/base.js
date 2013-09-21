define(function(require, exports, module){
    var libs = require('libs');
    var $ = require('$')
    var _ = require('underscore');
    var Backbone = require('backbone');

    // Models
    var BaseModel = Backbone.Model.extend({});

    // Collections
    var BaseCollection = Backbone.Collection.extend({
        model: BaseModel,
        parse: function(res){
            return res.data.items;
        }
    });

    // Views
    var Item = Backbone.View.extend({
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var ItemsContainer = Backbone.View.extend({

        itemContainer: null,

        initialize: function(){
            if(this.collection){
                this.collection.bind("add", this.addItem, this)
            }else
                console.warn("No collection!")
            this.ItemView = this.ItemView || this.options.ItemView;
        },

        render: function(){
            this.$el.html(this.template());
            return this;
        },

        addItems: function(){
            console.info("add items")
            if(this.itemContainer)
                this.$(this.itemContainer).empty();
            else
                this.$el.empty();
            if(!this.ItemView) {
                console.warn("No ItemView!");
                return;
            }
            this.collection.each(function(model){
                this.addItem(model);
            }, this);
        },

        addItem: function(model){
            if(!this.ItemView) {
                console.warn("No ItemView!");
                return;
            }
            var itemView = new this.ItemView({model: model});
            itemView.$el.hide();
            if(this.itemContainer)
                this.$(this.itemContainer).prepend(itemView.render().el);
            else
                this.$el.prepend(itemView.render().el);
            itemView.$el.fadeIn();
        }
    });

    var Content = ItemsContainer.extend({
        className: "box",
        base_template: _.template(require("./templates/common_content.tpl")),

        render: function(){
            this.renderMainContent();
            this.renderSubContent();
            return this;
        },

        renderMainContent: function(){
            this.$el.html(this.base_template({
                title: this.title || this.options.title,
                sub_title: this.sub_title || this.options.sub_title
            }));
        },

        renderSubContent: function(){
            if(this.template)
                this.$el.append(this.template(this.options.data))
        }
    });

    var Header = Backbone.View.extend({
        template: _.template(require("./templates/common_header.tpl")),
        events: {
            "click .add-new-todo": "addNewTodo",
            "click #login-btn": "doLogin",
            "click #reg-btn": "doReg"
        },

        doLogin: function(){
            this.$("#login-form").ajaxSubmit($.proxy(function(res){
                if(res.response == 'ok'){
                    this.user = res.data.user;
                    this.render();
                }else{
                    libs.Noty.NotyWithRes(res);
                }
            }, this));
        },

        doReg: function(){

        },

        addNewTodo: function(){
            var addTodoModalTemplate = require("./templates/modals/add_todo_modal.tpl");
            var AddTodoModalView = libs.JQueryUI.Dialog.extend({
                template: _.template(addTodoModalTemplate),

                ok: function(){
                    this.$("#todo-form").ajaxSubmit($.proxy(function(res){
                        if(this.options.contentCollection){
                            this.options.contentCollection.add(res.data);
                        }
                        this.close();
                    }, this));
                }
            });
            var addTodoModal = new AddTodoModalView({
                contentCollection: this.options.contentCollection
            });
            addTodoModal.open({
                height: 410,
                width: 310,
                modal: true,
                title:"制定一个新的计划",
                resizable: false
            });
        },

        initialize: function(){
            if(!this.options.user)
                console.warn("you should pass a user obj when init header");
            else
                this.user = this.options.user
        },

        render: function(){
            this.$el.html(this.template({user: this.user}));
            return this;
        }
    });

    var Footer = Backbone.View.extend({

    });

    module.exports = {
        Models:{
            BaseModel: BaseModel
        },
        Collections: {
            BaseCollection: BaseCollection
        },
        Views: {
            Item: Item,
            ItemsContainer: ItemsContainer,
            Content: Content,
            Header: Header,
            Footer: Footer
        }
    }
});