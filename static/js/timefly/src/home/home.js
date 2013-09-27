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

    var PassionateUserCollection = Common.Collections.BaseCollection.extend({
        url: "account/passionate_users"
    });
    var LatestTodoCollection = Common.Collections.BaseCollection.extend({
        url: "todo/latest_todos"
    });

//    var TodoItem = Common.Views.Item.extend({
//        className: "media",
//        template: _.template(require("./templates/todo_item.tpl")),
//        render: function(){
//            this.$el.html(this.template(this.model.toJSON()));
//            return this;
//        }
//    });
//
//    var IndexContent = Common.Views.Content.extend({
//        title: "最新计划",
//        sub_title: "时光飞逝网友们最近发布的最新计划，一起来为他们加油吧",
//        template: _.template(require("./templates/index_content.tpl")),
//        itemContainer: ".media-list",
//        ItemView: TodoItem
//    });

    exports.init = function(context){
//            content = new IndexContent({
//                collection: new LatestTodoCollection()
//            });
        context.router.route(":username", "home", function(username){
            $.get("/" + username, function(res){
                var owner = res.data.owner;

                var sideBarBoxes = [
                    new Common.Box.UserProfileBox({model: new Backbone.Model(owner)}),
                    new Common.Box.UserBox({
                        collection: new PassionateUserCollection()
                    }),
                    new Common.Box.AboutBox()
                ];

                context.user.self_home = context.user["username"] == owner["username"];

                Common.init(context, {
                    sideBarBoxes: sideBarBoxes
                })
            })
        });
    }
});