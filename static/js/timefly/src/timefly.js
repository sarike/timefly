define(function(require, exports, module) {
    require("bootstrap");
    require("form");
    require("utils");
    var $ = require("$");

    $(function(){
        $.get("me", function(res){
            var context = {
                header: $("header"),
                sideBar: $("#sidebar"),
                content: $("#content"),
                footer: $("footer"),
                user: res.data.user
            };
            require("./index/index").init(context);
        });
    });
});
