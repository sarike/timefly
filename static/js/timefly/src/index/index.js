/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-15
 * Time: 下午9:58
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports){
    var $ = require('$');
    var _ = require('underscore');
    var libs = require('../libs/libs');
    var Common = require('../common/common');
    var markdown = require('markdown');

    var PassionateUserCollection = Common.Collections.BaseCollection.extend({
        url: "account/passionate_users"
    });
    var LatestTodoCollection = Common.Collections.BaseCollection.extend({
        url: "todo/latest_todos"
    });

    var TodoItem = Common.Views.Item.extend({
        className: "media",
        template: _.template(require("./templates/todo_item.tpl")),
        render: function(){
            this.$el.html(this.template(_.extend(this.model.toJSON(), {markdown: markdown})));
            return this;
        }
    });

    var IndexContent = Common.Views.Content.extend({
        title: "最新计划",
        sub_title: "时光飞逝网友们最近发布的最新计划，一起来为他们加油吧",
        template: _.template(require("./templates/index_content.tpl")),
        itemContainer: ".media-list",
        ItemView: TodoItem
    });

    exports.init = function(context){
        context.router.route("", "index", function(){
            var sideBarBoxes = [
                    new Common.Box.UserBox({
                        collection: new PassionateUserCollection()
                    }),
                    new Common.Box.AboutBox()
                ],
                content = new IndexContent({
                    collection: new LatestTodoCollection()
                });

            context.user.set('self_home', false);
            context.user.set('at_index_page', true);

            Common.init(context, {
                sideBarBoxes: sideBarBoxes,
                content: content
            });
        });
    }
});