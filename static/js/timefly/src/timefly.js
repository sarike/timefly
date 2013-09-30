define(function(require) {
    require("bootstrap");
    require("form");
    require("utils");
    var $ = require("$");
    var Backbone = require("backbone");

    $(function(){
        $.get("me", function(res){

            var router = new Backbone.Router(),
                user = new Backbone.Model(res.data.user),
                context = {
                    header: $("header"),
                    sideBar: $("#sidebar"),
                    content: $("#content"),
                    footer: $("footer"),
                    user: user,
                    router: router
                };

            context.user.on("login-event", function(data){
                context.user = data.user;
                console.info("login-event user: ");
                console.info(context.user);
            });
            require("./index/index").init(context);
            require("./home/home").init(context);

            Backbone.history.start();
        });
    });
});
