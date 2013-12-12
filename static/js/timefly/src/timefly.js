define(function(require, exports) {
    var $ = require("$");
    var Backbone = require("backbone");
    require("bootstrap");
    require("form");
    var Common = require("./common/common");

    exports.mm = require('moment-timezone');
    exports.md = require('markdown');

    $(function(){

//        $('#sidebar').affix();

        $.get("me", function(res){

            var router = new Backbone.Router(),
                user = new Common.Models.BaseUser(res.data.user),
                context = {
                    header: $("header"),
                    sideBar: $("#sidebar"),
                    content: $("#content"),
                    footer: $("footer"),
                    user: user,
                    router: router
                };

            require("./index/index").init(context);
            require("./home/home").init(context);

            Backbone.history.start();
        });
    });
});
