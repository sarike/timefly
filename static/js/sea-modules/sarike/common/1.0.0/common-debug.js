define("sarike/common/1.0.0/common-debug", [ "sarike/libs/1.0.0/libs-debug", "$-debug", "gallery/underscore/1.4.4/underscore-debug", "./base/base-debug", "gallery/backbone/1.0.0/backbone-debug", "jquery-plugin/jquery-validate/1.11.1/jquery-validate-debug", "./base/templates/common_empty-debug.tpl", "./base/templates/common_content-debug.tpl", "./base/templates/common_header-debug.tpl", "./base/templates/add_todo_modal-debug.tpl", "./box/box-debug", "./box/templates/user_item-debug.tpl", "./box/templates/user_list_box-debug.tpl", "./box/templates/about_box-debug.tpl", "./box/templates/user_profile_box-debug.tpl", "./box/templates/side_nav_box-debug.tpl" ], function(require, exports, module) {
    var libs = require("sarike/libs/1.0.0/libs-debug");
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Base = require("./base/base-debug");
    var Box = require("./box/box-debug");
    var initSideBar = function(context, sidebarBoxes) {
        if (!sidebarBoxes) return;
        context.sideBar.empty();
        _.each(sidebarBoxes, function(box) {
            if (box.collection) {
                context.sideBar.append(box.render().el);
                box.collection.fetch({
                    success: function(collection) {
                        if (collection.length == 0) {
                            box.renderEmpty();
                        }
                    }
                });
            } else {
                context.sideBar.append(box.render().el);
            }
        }, this);
    };
    var initHeader = function(context, header) {
        context.header.html(header.render().el);
    };
    var initContent = function(context, content) {
        context.content.html(content.render().el);
        if (content.collection) content.collection.fetch({
            success: function(collection) {
                if (collection.length == 0) {
                    content.renderEmpty();
                }
            }
        });
    };
    var initFooter = function(context, footer) {
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

define("sarike/common/1.0.0/base/base-debug", [ "sarike/libs/1.0.0/libs-debug", "$-debug", "gallery/underscore/1.4.4/underscore-debug", "gallery/backbone/1.0.0/backbone-debug", "jquery-plugin/jquery-validate/1.11.1/jquery-validate-debug" ], function(require, exports, module) {
    var libs = require("sarike/libs/1.0.0/libs-debug");
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Backbone = require("gallery/backbone/1.0.0/backbone-debug");
    require("jquery-plugin/jquery-validate/1.11.1/jquery-validate-debug");
    // Models
    var BaseModel = Backbone.Model.extend({});
    // Collections
    var BaseCollection = Backbone.Collection.extend({
        model: BaseModel,
        parse: function(res) {
            return res.data.items;
        }
    });
    // Views
    var Item = Backbone.View.extend({
        initialize: function() {
            this.model.bind("change", $.proxy(this.render, this));
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var EmptyView = Backbone.View.extend({
        template: _.template(require("sarike/common/1.0.0/base/templates/common_empty-debug.tpl")),
        render: function() {
            this.$el.html(this.template());
            this.$el.show();
            return this;
        },
        hide: function() {
            this.$el.hide();
        }
    });
    var ItemsContainer = Backbone.View.extend({
        itemContainer: null,
        emptyView: new EmptyView(),
        initialize: function() {
            if (this.collection) {
                this.collection.bind("add", this.addItem, this);
            } else console.warn("No collection!");
            this.ItemView = this.ItemView || this.options.ItemView;
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        refresh: function(data) {
            this.$el.empty();
            if (this.collection) this.collection.fetch({
                success: $.proxy(function(collection) {
                    if (collection.length == 0) {
                        this.renderEmpty();
                    }
                }, this),
                data: data || {}
            });
        },
        renderEmpty: function() {
            this.$el.html(this.emptyView.render().el);
        },
        addItem: function(model) {
            if (this.collection.length > 0) {
                this.emptyView.hide();
            }
            if (!this.ItemView) {
                console.warn("No ItemView!");
                return;
            }
            var itemView = new this.ItemView({
                model: model
            });
            itemView.$el.hide();
            if (this.itemContainer) this.$(this.itemContainer).prepend(itemView.render().el); else this.$el.prepend(itemView.render().el);
            itemView.$el.fadeIn();
        }
    });
    var PlainBox = Backbone.View.extend({
        className: ""
    });
    var ObjectBox = Backbone.View.extend({
        className: "box",
        render: function() {
            this.$el.html(this.template(!this.model ? {} : this.model.toJSON()));
            return this;
        }
    });
    var ArrayBox = ItemsContainer.extend({
        className: "box"
    });
    var ObjectContent = ObjectBox.extend({
        has_title: true,
        base_template: _.template(require("sarike/common/1.0.0/base/templates/common_content-debug.tpl")),
        render: function() {
            this.renderMainContent();
            this.renderSubContent();
            return this;
        },
        renderMainContent: function() {
            this.$el.html(this.base_template({
                has_title: this.title,
                title: this.title || this.options.title,
                sub_title: this.sub_title || this.options.sub_title
            }));
        },
        renderSubContent: function() {
            if (this.template) this.$el.append(this.template(this.options.data));
        }
    });
    var Content = ArrayBox.extend({
        has_title: true,
        base_template: _.template(require("sarike/common/1.0.0/base/templates/common_content-debug.tpl")),
        render: function() {
            this.renderMainContent();
            this.renderSubContent();
            return this;
        },
        renderMainContent: function() {
            this.$el.html(this.base_template({
                has_title: this.title,
                title: this.title || this.options.title,
                sub_title: this.sub_title || this.options.sub_title
            }));
        },
        renderSubContent: function() {
            if (this.template) this.$el.append(this.template(this.options.data));
        },
        renderEmpty: function() {
            this.$el.append(this.emptyView.render().el);
        }
    });
    var Header = Backbone.View.extend({
        template: _.template(require("sarike/common/1.0.0/base/templates/common_header-debug.tpl")),
        events: {
            "click .add-new-todo": "addNewTodo",
            "click #login-btn": "doLogin",
            "click #reg-btn": "doReg"
        },
        doLogin: function() {
            this.$("#login-form").ajaxSubmit($.proxy(function(res) {
                if (res.response == "ok") {
                    var cur_user = new Backbone.Model(res.data.user);
                    cur_user.set("self_home", this.user.get("self_home"));
                    cur_user.set("at_index_page", this.user.get("at_index_page"));
                    this.user.trigger("login-event", {
                        user: cur_user
                    });
                    this.user = cur_user;
                    this.render();
                } else {
                    libs.Noty.NotyWithRes(res);
                }
            }, this));
        },
        doReg: function() {},
        addNewTodo: function() {
            var addTodoModalTemplate = require("sarike/common/1.0.0/base/templates/add_todo_modal-debug.tpl");
            var AddTodoModalView = libs.JQueryUI.Dialog.extend({
                template: _.template(addTodoModalTemplate),
                ok: function() {
                    this.$("#todo-form").submit();
                },
                extraRender: function() {
                    var start_date = this.$("#id_todo_start"), end_date = this.$("#id_todo_end"), todo_form = this.$("#todo-form");
                    start_date.datepicker({
                        defaultDate: "+1w",
                        minDate: "+0d",
                        changeYear: true,
                        onClose: function(selectedDate) {
                            end_date.datepicker("option", "minDate", selectedDate);
                        }
                    });
                    end_date.datepicker({
                        defaultDate: "+1w",
                        minDate: "+0d",
                        changeYear: true,
                        onClose: function(selectedDate) {
                            start_date.datepicker("option", "maxDate", selectedDate);
                        }
                    });
                    var self = this;
                    todo_form.validate({
                        errorClass: "error",
                        submitHandler: function(form) {
                            $(form).ajaxSubmit($.proxy(function(res) {
                                if (this.options.contentCollection) {
                                    this.options.contentCollection.add(res.data);
                                }
                                this.close();
                            }, self));
                        },
                        ignore: "input[type='checkbox']",
                        errorPlacement: function(error, element) {
                            element.prev().hide();
                            element.prev().after(error);
                        },
                        success: function(label) {
                            label.prev().show();
                            label.remove();
                        },
                        rules: {
                            todo_name: {
                                required: true,
                                maxlength: 20
                            },
                            todo_description: {
                                required: true,
                                maxlength: 100
                            },
                            todo_start: {
                                required: true,
                                date: true
                            },
                            todo_end: {
                                required: true,
                                date: true
                            }
                        },
                        messages: {
                            todo_name: {
                                required: "不响亮不要紧，可不能不填哟",
                                maxlength: jQuery.format("够响亮了，不过不能多于{0}个字符")
                            },
                            todo_description: {
                                required: "该计划到底想完成什么事情呢",
                                maxlength: jQuery.format("不过不能多于{0}个字符")
                            },
                            todo_start: {
                                required: "记得为该计划设定一个起始时间哟",
                                date: "我要的是日期，你输入的是火星文吗？"
                            },
                            todo_end: {
                                required: "记得为该计划设定一个结束时间哟",
                                date: "我要的是日期，你输入的是火星文吗？"
                            }
                        }
                    });
                }
            });
            var addTodoModal = new AddTodoModalView({
                contentCollection: this.options.contentCollection
            });
            addTodoModal.open({
                height: 480,
                width: 310,
                modal: true,
                title: "制定一个新的计划",
                resizable: false
            });
        },
        initialize: function() {
            if (!this.options.user) console.warn("you should pass a user obj when init header"); else this.user = this.options.user;
        },
        render: function() {
            this.$el.html(this.template({
                user: this.user.toJSON()
            }));
            return this;
        }
    });
    var Footer = Backbone.View.extend({});
    module.exports = {
        Models: {
            BaseModel: BaseModel
        },
        Collections: {
            BaseCollection: BaseCollection
        },
        Views: {
            Item: Item,
            ItemsContainer: ItemsContainer,
            EmptyView: EmptyView,
            ObjectBox: ObjectBox,
            ArrayBox: ArrayBox,
            PlainBox: PlainBox,
            Content: Content,
            ObjectContent: ObjectContent,
            Header: Header,
            Footer: Footer
        }
    };
});

define("sarike/common/1.0.0/base/templates/common_empty-debug.tpl", [], '<div class="box">啥玩意儿都木有……</div>');

define("sarike/common/1.0.0/base/templates/common_content-debug.tpl", [], '<div class="box-header">\n    <% if(has_title){ %>\n    <h2><%=title || "No Title" %></h2>\n    <p class="box-subheader"><%=sub_title || "No Sub_title" %></p>\n    <% } %>\n</div>');

define("sarike/common/1.0.0/base/templates/common_header-debug.tpl", [], '<div class="navbar navbar-fixed-top">\n    <div class="navbar-inner">\n        <div class="container">\n            <ul class="nav">\n                <li <% if(user.at_index_page){ %>class="active"<% } %>>\n                    <a href="#" class=" clearfix">\n                        <span><i class="nav-home"></i></span>\n                        <span>主页</span>\n                    </a>\n                </li>\n                <% if(!!user && user.is_authenticated){ %>\n                <li <% if(user.self_home){ %>class="active"<% } %>>\n                    <a href="#<%=user.username %>" class=" clearfix">\n                        <span><i class="nav-me"></i></span>\n                        <span>我</span>\n                    </a>\n                </li>\n                <% } %>\n            </ul>\n\n            <div class="pull-right">\n                <% if(!!user && user.is_authenticated){ %>\n                <ul class="nav">\n                    <li>\n                        <a href="#" class=" clearfix dropdown-toggle" data-toggle="dropdown">\n									<span>\n                                        <%=user.nickname || user.username %>\n									</span>\n									<span>\n										<i class="caret"></i>\n									</span>\n                        </a>\n                        <ul class="dropdown-menu" role="menu" aria-labelledby="">\n                            <li role="presentation">\n                                <a role="menuitem" tabindex="-1" href="#<%= user.username %>/setting">\n                                    <i class="icon-user "></i> 个人资料\n                                </a>\n                            </li>\n                            <li role="presentation" class="divider"></li>\n                            <li role="presentation">\n                                <a role="menuitem" tabindex="-1" href="../account/logout">\n                                    <i class="icon-off"></i> 退出登录</a></li>\n                        </ul>\n                    </li>\n                </ul>\n                <button title="制定新计划" class="add-new-todo btn btn-info">\n                    <i class="nav-new-todo"></i><span></span>\n                </button>\n                <% }else{ %>\n                <form id="login-form" class="form-inline" action="account/ajax_login" method="post">\n                    <input type="text" name="email" class="input-medium" placeholder="Email">\n                    <input type="password" name="password" class="input-medium" placeholder="Password">\n                    <label class="checkbox">\n                        <input type="checkbox" name="remember"> 记住我\n                    </label>\n                    <button type="button" id="login-btn" class="btn btn-info">登录</button>\n                    <button class="btn btn-info" type="button" onclick="javascript:location.href=\'account/reg\'">注册\n                    </button>\n                </form>\n                <% } %>\n            </div>\n        </div>\n    </div>\n</div>');

define("sarike/common/1.0.0/base/templates/add_todo_modal-debug.tpl", [], '<div id="todoModal" class="">\n    <div>\n        <form id="todo-form" action="todo/add_todo" method="post">\n            <label for="id_todo_name">为你的新计划起一个响亮的名字</label>\n            <input type="text" class="input-block-level" id="id_todo_name" name="todo_name"/>\n            <label for="id_todo_description">描述一下该计划打算要完成的事情</label>\n            <textarea rows="5" class="input-block-level" id="id_todo_description" name="todo_description"></textarea>\n            <label for="id_todo_start">你打算什么时候开始这个计划？</label>\n            <input type="text" class="input-block-level" id="id_todo_start" name="todo_start" value=""/>\n            <label for="id_todo_end">这个计划你预计会在什么时候完成呢？</label>\n            <input type="text" class="input-block-level" id="id_todo_end" name="todo_end" value=""/>\n            <ul>\n                <li class="checkbox"><input type="checkbox" name="todo_visible"/>对所有人可见</li>\n                <li class="checkbox"><input type="checkbox" name="todo_erasable"/> 不可删除</li>\n            </ul>\n        </form>\n    </div>\n</div>');

define("sarike/common/1.0.0/box/box-debug", [ "sarike/libs/1.0.0/libs-debug", "$-debug", "gallery/underscore/1.4.4/underscore-debug", "sarike/common/1.0.0/base/base-debug", "gallery/backbone/1.0.0/backbone-debug", "jquery-plugin/jquery-validate/1.11.1/jquery-validate-debug" ], function(require, exports, module) {
    var libs = require("sarike/libs/1.0.0/libs-debug");
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Base = require("sarike/common/1.0.0/base/base-debug");
    var UserItem = Base.Views.Item.extend({
        template: _.template(require("sarike/common/1.0.0/box/templates/user_item-debug.tpl")),
        tagName: "li",
        className: "media"
    });
    var UsersBox = Base.Views.ArrayBox.extend({
        template: _.template(require("sarike/common/1.0.0/box/templates/user_list_box-debug.tpl")),
        ItemView: UserItem,
        itemContainer: ".media-list"
    });
    var AboutBox = Base.Views.ObjectBox.extend({
        template: _.template(require("sarike/common/1.0.0/box/templates/about_box-debug.tpl"))
    });
    var UserProfileBox = Base.Views.ObjectBox.extend({
        template: _.template(require("sarike/common/1.0.0/box/templates/user_profile_box-debug.tpl"))
    });
    var SideNavBox = Base.Views.PlainBox.extend({
        template: _.template(require("sarike/common/1.0.0/box/templates/side_nav_box-debug.tpl")),
        events: {
            "click .nav-list>li": "clickNavItem"
        },
        clickNavItem: function(e) {
            var nav = $(e.currentTarget);
            this.$("li").removeClass("active");
            nav.addClass("active");
            this.action(nav);
        },
        action: function(nav) {},
        render: function() {
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
    };
});

define("sarike/common/1.0.0/box/templates/user_item-debug.tpl", [], '<a class="pull-left" href="./#<%=username %>"> <img\n        class="media-object img-rounded"\n        src="http://www.gravatar.com/avatar/<%=avatar_hash %>?d=identicon"\n        class="img-rounded" alt="Avatar">\n</a>\n\n<div class="media-body">\n    <h4 class="media-heading">\n        <a href="./#<%=username %>">\n            <%=nickname %>\n        </a>\n    </h4>\n    Description\n</div>');

define("sarike/common/1.0.0/box/templates/user_list_box-debug.tpl", [], '<div id="friend-list">\n    <h3>\n        活跃用户 <a href="#">查看全部</a>\n    </h3>\n    <ul class="media-list">\n    </ul>\n</div>');

define("sarike/common/1.0.0/box/templates/about_box-debug.tpl", [], '<span class="copyright">&copy; 2013</span> <a href="#">关于</a>');

define("sarike/common/1.0.0/box/templates/user_profile_box-debug.tpl", [], '<div id="user-profile">\n        <div class="clearfix">\n            <div id="avatar" class="pull-left">\n                <img src="http://www.gravatar.com/avatar/<%=avatar_hash %>?d=identicon" class="img-rounded" alt="Avatar">\n            </div>\n            <div id="user-info" class="pull-left">\n                <h2>\n                    <%=nickname %>\n                </h2>\n                <ul>\n                    <li>努力中 <span class="badge badge-info"><%=ing_count %></span></li>\n                    <li>已完成 <span class="badge badge-success"><%=ed_count %></span></li>\n                    <li>未完成 <span class="badge badge-important"><%=fail_count %></span></li>\n                </ul>\n            </div>\n        </div>\n        <div id="user-desc"><%=description %></div>\n</div>');

define("sarike/common/1.0.0/box/templates/side_nav_box-debug.tpl", [], '<div id="menu">\n    <ul class="nav nav-list">\n        <% _.each(side_nav_list, function(nav){ %>\n        <li data-id="<%=nav.id %>" <% if(nav.active){ %>class="active"<% } %>>\n            <a href="javascript: void(0)"><%=nav.caption %><i class="icon-chevron-right pull-right"></i></a>\n        </li>\n        <% });%>\n    </ul>\n</div>');
