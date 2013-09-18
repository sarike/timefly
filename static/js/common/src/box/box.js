define(function(require, exports, module){
    var libs = require('libs');
    var $ = require('$');
    var _ = require('underscore');
    var Base = require('../base/base');

    var UserItem = Base.Views.Item.extend({
        template: _.template(require("./templates/user_item.tpl")),
        tagName: "li",
        className: "media"
    });

    var UsersBox = Base.Views.ItemsContainer.extend({
        template: _.template(require("./templates/users_box.tpl")),
        ItemView: UserItem,
        itemContainer: '.media-list'
    });

    module.exports = {
        UserBox: UsersBox
    }
});