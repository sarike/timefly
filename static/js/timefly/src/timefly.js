define(function (require, exports) {
    "use strict";
    require("bootstrap");
    require("form");
    var $ = require("$"),
        Backbone = require("backbone"),
        Common = require("./common/common");

    exports.mm = require('moment-timezone');
    exports.md = require('markdown');

    $.ajaxSetup({
        global: true,
        beforeSend: function () {
            $("#loading").fadeIn();
        },
        complete: function () {
            $("#loading").fadeOut();
        }
    });

    $(function () {

//        $('#sidebar').affix();

        $.get("me", function (res) {

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
