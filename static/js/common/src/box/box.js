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

    var UsersBox = Base.Views.ArrayBox.extend({
        template: _.template(require("./templates/user_list_box.tpl")),
        ItemView: UserItem,
        itemContainer: '.media-list'
    });

    var AboutBox = Base.Views.ObjectBox.extend({
        template: _.template(require("./templates/about_box.tpl"))
    });

    var UserProfileBox = Base.Views.ObjectBox.extend({
        template: _.template(require("./templates/user_profile_box.tpl"))
    });

    module.exports = {
        UserBox: UsersBox,
        AboutBox: AboutBox,
        UserProfileBox: UserProfileBox
    }
});