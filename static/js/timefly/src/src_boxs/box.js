define(function(require, exports, module){
    var BootStrap = require('bootstrap');
    var libs = require('libs');
    var $ = require('$')
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Common = require('../src_common/common')
    require("form");

    var UserItem = Backbone.View.extend({
        template: _.template(require("./templates/user_item.tpl")),

        tagName: "li",
        className: "media",

        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var UsersBox = Backbone.View.extend({
        template: _.template(require("./templates/users_box.tpl")),

        itemView: UserItem,

        initialize: function(){
            this.collection.bind("reset", this.render());
        },

        events: {

        },

        render: function(){
            this.$el.html(this.template());
            this.addUsers();
            return this;
        },

        addUsers: function(){
            this.collection.each(function(model){
                this.addUser(model);
            }, this);
        },

        addUser: function(model){
            var userItem = new this.itemView({
                model: model
            });
            this.$(".media-list").append(userItem.render().el);
        }
    });

    module.exports = {
        UserBox: UsersBox
    }
});