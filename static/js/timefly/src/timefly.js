define(function(require) {
    var $ = require("$");
    var Backbone = require("backbone");
    require("bootstrap");
    require("form");
    require("./utils/utils");
    var Common = require("./common/common");

    $(function(){

//        $('#sidebar').affix(200);

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
