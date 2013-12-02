define(function(require, exports, module){
    var libs = require('../libs/libs');
    var $ = require('$');
    var _ = require('underscore');
    var Base = require('./base/base');
    var Box = require('./box/box');

    var initSideBar = function(context, sidebarBoxes){
        if(!sidebarBoxes) return;
        context.sideBar.empty();
        _.each(sidebarBoxes, function(box){
            if(box.collection){
                context.sideBar.append(box.render().el);
                box.collection.fetch({
                    success: function(collection){
                        if(collection.length == 0){
                            box.renderEmpty();
                        }
                    }
                });
            }else{
                context.sideBar.append(box.render().el);
            }
        }, this)
    };

    var initHeader = function(context, header){
        context.header.html(header.render().el);
    };

    var initContent = function(context, content){
        context.content.html(content.render().el);
        if(content.collection)
            content.collection.fetch({
                success: function(collection){
                    if(collection.length == 0){
                        content.renderEmpty();
                    }
                }
            });
    };

    var initFooter = function(context, footer){
        context.footer.html(footer.render().el);
    };

    module.exports = {
        Models: Base.Models,
        Collections: Base.Collections,
        Views: Base.Views,
        Box: Box,
        init: function(context, options) {
            initHeader(context, options.header || new Base.Views.Header({
                user: context.user,
                contentCollection: options.content ? options.content.collection : null
            }));
            initSideBar(context, options.sideBarBoxes);
            initContent(context, options.content || new Base.Views.Content());
            initFooter(context, options.footer || new Base.Views.Footer());
        }
    };
});