define(function(require) {
    require("bootstrap");
    require("form");
    require("utils");
    var $ = require("$");
    var Backbone = require("backbone");

    $(function(){
        $.get("me", function(res){

            var router = new Backbone.Router(),
                context = {
                    header: $("header"),
                    sideBar: $("#sidebar"),
                    content: $("#content"),
                    footer: $("footer"),
                    user: res.data.user,
                    router: router
                };
            require("./index/index").init(context);
            require("./home/home").init(context);

            Backbone.history.start();
        });
    });
});
