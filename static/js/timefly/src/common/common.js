define(function (require, exports, module) {
    "use strict";
    var libs = require('../libs/libs'),
        $ = require('$'),
        _ = require('underscore'),
        Base = require('./base/base'),
        Box = require('./box/box');

    var initSideBar = function (context, sidebarBoxes) {
        if (!sidebarBoxes) {
            return;
        }
        context.sideBar.empty();
        _.each(sidebarBoxes, function (box) {
            if (box.collection) {
                context.sideBar.append(box.render().el);
                box.collection.fetch({
                    success: function (collection) {
                        if (collection.length === 0) {
                            box.renderEmpty();
                        }
                    }
                });
            } else {
                context.sideBar.append(box.render().el);
            }
        }, this);
    };

    var initHeader = function (context, header) {
        context.header.html(header.render().el);
    };

    var initContent = function (context, content) {
        if(content.model){
            content.model.fetch({
                data: content.model.queryString,
                success: function(){
                    context.content.html(content.render().el);
                }
            });
            return;
        }
        if (content.collection) {
            context.content.html(content.render().el);
            content.collection.fetch({
                data: content.collection.queryString,
                success: function (collection) {
                    if (collection.length === 0) {
                        content.renderEmpty();
                    }
                }
            });
        }
    };

    var initFooter = function (context, footer) {
        context.footer.html(footer.render().el);
    };

    module.exports = {
        Models: Base.Models,
        Collections: Base.Collections,
        Views: Base.Views,
        Box: Box,
        init: function (context, options) {
            initHeader(context, options.header || new Base.Views.Header({
                user: context.user,
                content: options.content
            }));
            initSideBar(context, options.sideBarBoxes);
            initContent(context, options.content || new Base.Views.Content());
            initFooter(context, options.footer || new Base.Views.Footer());
        }
    };
});