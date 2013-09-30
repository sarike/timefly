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
            render: function(){
                this.$el.html(this.template({
                    todo: this.model.toJSON(),
                    user: context.user
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
            })
        });
    }
});