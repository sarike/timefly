define(function(require, exports, module){
    var $ = require('$');
    var _ = require('underscore');
    var libs = require('../../libs/libs');
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

    var SideNavBox = Base.Views.PlainBox.extend({
        template: _.template(require("./templates/side_nav_box.tpl")),

        events: {
            'click .nav-list>li': 'clickNavItem'
        },

        clickNavItem: function(e){
            var nav = $(e.currentTarget);
            this.$('li').removeClass('active');
            nav.addClass('active');
            this.action(nav)
        },

        action: function(nav){
        },

        render: function(){
            this.$el.html(this.template({
                side_nav_list: this.side_nav_list || this.options.side_nav_list || []
            }));
            return this;
        }
    });

    module.exports = {
        UserBox: UsersBox,
        AboutBox: AboutBox,
        UserProfileBox: UserProfileBox,
        SideNavBox: SideNavBox
    }
});