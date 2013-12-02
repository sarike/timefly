define(function(require) {
    var $ = require("$");
    var Backbone = require("backbone");
    require("bootstrap");
    require("form");
    require("./utils/utils");

    $(function(){

//        $('#sidebar').affix(200);

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
            });
            require("./index/index").init(context);
            require("./home/home").init(context);

            Backbone.history.start();
        });
    });
});
