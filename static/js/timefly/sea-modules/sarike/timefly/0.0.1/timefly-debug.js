define("sarike/timefly/0.0.1/timefly-debug", [ "$-debug", "gallery/backbone/1.0.0/backbone-debug", "gallery/underscore/1.4.4/underscore-debug", "sarike/bootstrap/2.3.2/bootstrap-debug", "jquery-plugin/form/3.44.0/form-debug", "./common/common-debug", "./libs/libs-debug", "sarike/jquery-ui/1.10.3/jquery-ui-debug", "sarike/jquery-noty/2.1.0/jquery-noty-debug", "./common/base/base-debug", "./editor/editor-debug", "./editor/templates/editor-debug.tpl", "sarike/jquery-validate/1.11.1/jquery-validate-debug", "./common/base/templates/common_empty-debug.tpl", "./common/base/templates/common_content-debug.tpl", "./common/base/templates/add_edit_todo-debug.tpl", "./common/base/templates/common_header-debug.tpl", "./common/box/box-debug", "./common/box/templates/user_item-debug.tpl", "./common/box/templates/user_list_box-debug.tpl", "./common/box/templates/about_box-debug.tpl", "./common/box/templates/user_profile_box-debug.tpl", "./common/box/templates/side_nav_box-debug.tpl", "sarike/moment-timezone/0.0.3/moment-timezone-debug", "sarike/moment/2.4.0/moment-debug", "sarike/markdown/0.6.0/markdown-debug", "./index/index-debug", "./index/templates/todo_item-debug.tpl", "./index/templates/index_content-debug.tpl", "./home/home-debug", "./home/templates/setting_form-debug.tpl", "./home/templates/password_reset_form-debug.tpl", "./home/templates/add_complete_modal-debug.tpl", "./home/templates/todo_item-debug.tpl" ], function(require, exports) {
    var $ = require("$-debug");
    var Backbone = require("gallery/backbone/1.0.0/backbone-debug");
    require("sarike/bootstrap/2.3.2/bootstrap-debug");
    require("jquery-plugin/form/3.44.0/form-debug");
    var Common = require("./common/common-debug");
    exports.mm = require("sarike/moment-timezone/0.0.3/moment-timezone-debug");
    exports.md = require("sarike/markdown/0.6.0/markdown-debug");
    $(function() {
        //        $('#sidebar').affix(200);
        $.get("me", function(res) {
            var router = new Backbone.Router(), user = new Common.Models.BaseUser(res.data.user), context = {
                header: $("header"),
                sideBar: $("#sidebar"),
                content: $("#content"),
                footer: $("footer"),
                user: user,
                router: router
            };
            require("./index/index-debug").init(context);
            require("./home/home-debug").init(context);
            Backbone.history.start();
        });
    });
});

define("sarike/timefly/0.0.1/common/common-debug", [ "sarike/timefly/0.0.1/libs/libs-debug", "$-debug", "gallery/underscore/1.4.4/underscore-debug", "gallery/backbone/1.0.0/backbone-debug", "sarike/jquery-ui/1.10.3/jquery-ui-debug", "sarike/jquery-noty/2.1.0/jquery-noty-debug", "sarike/timefly/0.0.1/common/base/base-debug", "sarike/timefly/0.0.1/editor/editor-debug", "sarike/jquery-validate/1.11.1/jquery-validate-debug", "sarike/timefly/0.0.1/common/box/box-debug" ], function(require, exports, module) {
    var libs = require("sarike/timefly/0.0.1/libs/libs-debug");
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Base = require("sarike/timefly/0.0.1/common/base/base-debug");
    var Box = require("sarike/timefly/0.0.1/common/box/box-debug");
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
                content: options.content
            }));
            initSideBar(context, options.sideBarBoxes);
            initContent(context, options.content || new Base.Views.Content());
            initFooter(context, options.footer || new Base.Views.Footer());
        }
    };
});

/**
 * Created with PyCharm.
 * User: Administrator
 * Date: 13-9-13
 * Time: 下午8:04
 * To change this template use File | Settings | File Templates.
 */
define("sarike/timefly/0.0.1/libs/libs-debug", [ "$-debug", "gallery/underscore/1.4.4/underscore-debug", "gallery/backbone/1.0.0/backbone-debug", "sarike/jquery-ui/1.10.3/jquery-ui-debug", "sarike/jquery-noty/2.1.0/jquery-noty-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Backbone = require("gallery/backbone/1.0.0/backbone-debug");
    var ui = require("sarike/jquery-ui/1.10.3/jquery-ui-debug");
    var noty = require("sarike/jquery-noty/2.1.0/jquery-noty-debug");
    /**
     * var dialog = new Dialog({
     *     content: content,
     *     config: { }
     * })
     */
    var Dialog = Backbone.View.extend({
        _getButton: function(text, click) {
            return {
                text: text,
                click: click
            };
        },
        defaultConfig: {
            show: true,
            resizable: true
        },
        tpl_data: {},
        initialize: function() {
            var okButton = this._getButton("确定", $.proxy(this.ok, this));
            var cancelButton = this._getButton("取消", $.proxy(this.cancel, this));
            this.defaultConfig.buttons = [ okButton, cancelButton ];
            this.extraInitialize();
        },
        extraInitialize: function() {},
        ok: function() {
            console.warn("This is the default okClick, maybe you shoud override ok Func!");
        },
        cancel: function() {
            this.close();
        },
        render: function() {
            this.$el.html(this.template(this.tpl_data));
            this.extraRender();
            return this;
        },
        extraRender: function() {},
        open: function(config) {
            this.render();
            this.$el.dialog(_.extend(this.defaultConfig, config));
        },
        close: function() {
            this.$el.dialog("destroy");
        }
    });
    $.datepicker.setDefaults({
        autoSize: true,
        showAnim: "slideDown",
        closeText: "关闭",
        prevText: "&#x3C;上月",
        nextText: "下月&#x3E;",
        currentText: "今天",
        monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
        monthNamesShort: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
        dayNames: [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ],
        dayNamesShort: [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ],
        dayNamesMin: [ "日", "一", "二", "三", "四", "五", "六" ],
        weekHeader: "周",
        dateFormat: "yy-mm-dd",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: "年"
    });
    var JQueryUI = {
        Dialog: Dialog
    };
    var Noty = {
        noty: function(type, info) {
            noty({
                type: type,
                layout: "center",
                text: info,
                timeout: 1e3
            });
        },
        NotyWithRes: function(res) {
            noty({
                type: res.type,
                layout: res.layout,
                text: res.info,
                timeout: 1e3
            });
        },
        Confirm: function(options) {
            var ok_button = {
                addClass: "btn btn-primary",
                text: "Ok",
                onClick: options.ok || function(noty) {
                    noty.close();
                }
            };
            var cancel_button = {
                addClass: "btn btn-danger",
                text: "Cancel",
                onClick: options.cancel || function(noty) {
                    noty.close();
                }
            };
            noty({
                type: options.type || "information",
                layout: options.layout || "center",
                text: options.text || "你确定吗？",
                buttons: [ ok_button, cancel_button ]
            });
        }
    };
    module.exports = {
        JQueryUI: JQueryUI,
        Noty: Noty
    };
});

define("sarike/timefly/0.0.1/common/base/base-debug", [ "sarike/timefly/0.0.1/libs/libs-debug", "$-debug", "gallery/underscore/1.4.4/underscore-debug", "gallery/backbone/1.0.0/backbone-debug", "sarike/jquery-ui/1.10.3/jquery-ui-debug", "sarike/jquery-noty/2.1.0/jquery-noty-debug", "sarike/timefly/0.0.1/editor/editor-debug", "sarike/jquery-validate/1.11.1/jquery-validate-debug" ], function(require, exports, module) {
    var libs = require("sarike/timefly/0.0.1/libs/libs-debug");
    var Editor = require("sarike/timefly/0.0.1/editor/editor-debug");
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var Backbone = require("gallery/backbone/1.0.0/backbone-debug");
    require("sarike/jquery-validate/1.11.1/jquery-validate-debug");
    // Models
    var BaseModel = Backbone.Model.extend({});
    var BaseUser = Backbone.Model.extend({
        initialize: function() {
            this.on("update-user-event", this.updateUser, this);
        },
        updateUser: function(data) {
            this.set(data);
        }
    });
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
        template: _.template(require("sarike/timefly/0.0.1/common/base/templates/common_empty-debug.tpl")),
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
        reRender: function() {
            if (this.itemContainer) {
                this.itemContainer.empty();
            } else {
                this.$el.empty();
            }
            this.collection.each(this.addItem, this);
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
        base_template: _.template(require("sarike/timefly/0.0.1/common/base/templates/common_content-debug.tpl")),
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
        base_template: _.template(require("sarike/timefly/0.0.1/common/base/templates/common_content-debug.tpl")),
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
    var TodoEditor = Editor.extend({
        text_area_name: "todo_description",
        editor_label: "描述一下该计划打算要完成的事情"
    });
    var AddOrEditTodoView = Backbone.View.extend({
        template: _.template(require("sarike/timefly/0.0.1/common/base/templates/add_edit_todo-debug.tpl")),
        className: "box",
        events: {
            "click button.submit": "submitTodoForm",
            "click button.cancel": "cancel"
        },
        render: function() {
            this.$el.html(this.template());
            this.$(".editor-field").html(this.editor.render().el);
            this.initFormValidation();
            this.initDatePicker();
            return this;
        },
        submitTodoForm: function(e) {
            this.$("#add_todo_form").submit();
            e.preventDefault();
        },
        destroy: function() {
            this.$el.remove();
        },
        cancel: function() {
            this.$el.slideUp();
            return false;
        },
        initFormValidation: function() {
            var todo_form = this.$("#add_todo_form");
            var self = this;
            todo_form.validate({
                errorClass: "input-error",
                submitHandler: function(form) {
                    $(form).ajaxSubmit($.proxy(function(res) {
                        if (this.contentView.collection) {
                            this.contentView.collection.add(res.data);
                        }
                        self.destroy();
                    }, self));
                },
                ignore: "input[type='checkbox']",
                errorPlacement: function(error, element) {},
                rules: {
                    todo_name: {
                        required: true,
                        maxlength: 20
                    },
                    todo_description: "required",
                    todo_start: {
                        required: true,
                        date: true
                    },
                    todo_end: {
                        required: true,
                        date: true
                    }
                }
            });
        },
        initDatePicker: function() {
            var start_date = this.$("#id_todo_start"), end_date = this.$("#id_todo_end");
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
        },
        initialize: function() {
            this.editor = new TodoEditor();
            this.contentView = this.options.contentView;
            console.info(this.contentView.collection);
        }
    });
    var Header = Backbone.View.extend({
        template: _.template(require("sarike/timefly/0.0.1/common/base/templates/common_header-debug.tpl")),
        events: {
            "click .add-new-todo": "addNewTodo",
            "click #login-btn": "doLogin",
            "click #reg-btn": "doReg"
        },
        doLogin: function() {
            this.$("#login-form").ajaxSubmit($.proxy(function(res) {
                if (res.response == "ok") {
                    res.data.user.self_home = res.data.user["username"] == this.user.get("other_home_owner");
                    res.data.user.at_index_page = !res.data.user.self_home;
                    this.user.trigger("update-user-event", res.data.user);
                    this.render();
                    if (res.data.user.self_home) {
                        this.contentView.reRender();
                    }
                } else {
                    libs.Noty.NotyWithRes(res);
                }
            }, this));
        },
        doReg: function() {},
        addNewTodo: function() {
            if (!this.addOrEditNewTodoView) {
                this.addOrEditNewTodoView = new AddOrEditTodoView({
                    contentView: this.contentView
                });
                this.addOrEditNewTodoView.$el.hide();
                $("#content").prepend(this.addOrEditNewTodoView.render().el);
            }
            this.addOrEditNewTodoView.$el.slideToggle();
        },
        initialize: function() {
            if (!this.options.user) console.warn("you should pass a user obj when init header"); else this.user = this.options.user;
            this.contentView = this.options.content;
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
            BaseModel: BaseModel,
            BaseUser: BaseUser
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

/**
 * Created by Sarike on 13-12-6.
 */
define("sarike/timefly/0.0.1/editor/editor-debug", [ "$-debug", "gallery/backbone/1.0.0/backbone-debug", "gallery/underscore/1.4.4/underscore-debug" ], function(require) {
    var $ = require("$-debug"), Backbone = require("gallery/backbone/1.0.0/backbone-debug"), _ = require("gallery/underscore/1.4.4/underscore-debug");
    var editorTemplate = require("sarike/timefly/0.0.1/editor/templates/editor-debug.tpl");
    var EditorView = Backbone.View.extend({
        template: _.template(editorTemplate),
        className: "md-editor",
        text_area_name: "",
        editor_label: "",
        events: {
            "click .op-preview": "preView",
            "click .op-edit": "edit"
        },
        preView: function() {
            this.$(".preview-content").html(window.tf.md.toHTML(this.getValue())).show();
            this.$(".op-edit").show();
            this.$(".op-preview").hide();
            this.$("#md-editor-content").hide();
        },
        edit: function() {
            this.$(".preview-content").empty().hide();
            this.$(".op-edit").hide();
            this.$(".op-preview").show();
            this.$("#md-editor-content").show();
        },
        render: function() {
            this.$el.html(this.template({
                text_area_name: this.text_area_name,
                editor_label: this.editor_label
            }));
            console.info(this.$("#md-editor-content").height());
            return this;
        },
        getValue: function() {
            return this.$("#md-editor-content").val();
        }
    });
    return EditorView;
});

define("sarike/timefly/0.0.1/editor/templates/editor-debug.tpl", [], '<div class="md-editor-ops">\n    <a class="op-preview" href="javascript:void(0);" title="预览">\n        <i class="icon-search"></i>\n    </a>\n    <a class="op-edit hide" href="javascript:void(0);" title="编辑">\n        <i class="icon-edit"></i>\n    </a>\n</div>\n<label for="md-editor-content"><%=editor_label %></label>\n<textarea cols="40" id="md-editor-content" rows="10" name="<%=text_area_name %>" class="input-block-level"></textarea>\n<div class="preview-content markdown hide"></div>');

define("sarike/timefly/0.0.1/common/base/templates/common_empty-debug.tpl", [], '<div class="box">啥玩意儿都木有……</div>');

define("sarike/timefly/0.0.1/common/base/templates/common_content-debug.tpl", [], '<div class="box-header">\n    <% if(has_title){ %>\n    <h2><%=title || "No Title" %></h2>\n    <p class="box-subheader"><%=sub_title || "No Sub_title" %></p>\n    <% } %>\n</div>');

define("sarike/timefly/0.0.1/common/base/templates/add_edit_todo-debug.tpl", [], '<form id="add_todo_form" action="todo/add_todo" method="post" class="clearfix">\n    <h2>\n        <input type="text" placeholder="起一个响亮的名字" class="input-block-level"\n               id="id_todo_name" name="todo_name"/>\n        <span class="pull-right">\n        </span>\n    </h2>\n    <div class="todo_info">\n        该计划开始于 <input type="text" id="id_todo_start" name="todo_start"/> ，\n        计划在 <input type="text" id="id_todo_end" name="todo_end"/>  完成！\n    </div>\n    <div class="todo_desc markdown">\n        <div class="editor-field"></div>\n    </div>\n    <div>\n        <label class="checkbox pull-left">\n            <input type="checkbox" name="todo_visible" checked/>对所有人可见\n        </label>\n        <label class="checkbox pull-left margin-left20">\n            <input type="checkbox" name="todo_erasable"checked/> 背水一战，绝不删除\n        </label>\n    </div>\n    <div class="add-todo-ops">\n        <span class="pull-right">\n            <button class="btn btn-info submit">保存</button>\n            <button class="btn cancel">取消</button>\n        </span>\n    </div>\n</form>');

define("sarike/timefly/0.0.1/common/base/templates/common_header-debug.tpl", [], '<div class="navbar navbar-fixed-top">\n    <div class="navbar-inner">\n        <div class="container">\n            <ul class="nav">\n                <li <% if(user.at_index_page){ %>class="active"<% } %>>\n                    <a href="#" class=" clearfix">\n                        <span><i class="nav-home"></i></span>\n                        <span>主页</span>\n                    </a>\n                </li>\n                <% if(!!user && user.is_authenticated){ %>\n                <li <% if(user.self_home){ %>class="active"<% } %>>\n                    <a href="#<%=user.username %>" class=" clearfix">\n                        <span><i class="nav-me"></i></span>\n                        <span>我</span>\n                    </a>\n                </li>\n                <% } %>\n            </ul>\n\n            <div class="pull-right">\n                <% if(!!user && user.is_authenticated){ %>\n                <ul class="nav">\n                    <li>\n                        <a href="#" class=" clearfix dropdown-toggle" data-toggle="dropdown">\n									<span>\n                                        <%=user.nickname || user.username %>\n									</span>\n									<span>\n										<i class="caret"></i>\n									</span>\n                        </a>\n                        <ul class="dropdown-menu" role="menu" aria-labelledby="">\n                            <li role="presentation">\n                                <a role="menuitem" tabindex="-1" href="#<%= user.username %>/setting">\n                                    <i class="icon-user "></i> 个人资料\n                                </a>\n                            </li>\n                            <li role="presentation" class="divider"></li>\n                            <li role="presentation">\n                                <a role="menuitem" tabindex="-1" href="../account/logout">\n                                    <i class="icon-off"></i> 退出登录</a></li>\n                        </ul>\n                    </li>\n                </ul>\n                <button title="制定新计划" class="add-new-todo btn btn-info">\n                    <i class="nav-new-todo"></i><span></span>\n                </button>\n                <% }else{ %>\n                <form id="login-form" class="form-inline" action="account/ajax_login" method="post">\n                    <input type="text" name="email" class="input-medium" placeholder="Email">\n                    <input type="password" name="password" class="input-medium" placeholder="Password">\n                    <label class="checkbox">\n                        <input type="checkbox" name="remember"> 记住我\n                    </label>\n                    <button type="button" id="login-btn" class="btn btn-info">登录</button>\n                    <button class="btn btn-info" type="button" onclick="javascript:location.href=\'account/reg\'">注册\n                    </button>\n                </form>\n                <% } %>\n            </div>\n        </div>\n    </div>\n</div>');

define("sarike/timefly/0.0.1/common/box/box-debug", [ "$-debug", "gallery/underscore/1.4.4/underscore-debug", "sarike/timefly/0.0.1/libs/libs-debug", "gallery/backbone/1.0.0/backbone-debug", "sarike/jquery-ui/1.10.3/jquery-ui-debug", "sarike/jquery-noty/2.1.0/jquery-noty-debug", "sarike/timefly/0.0.1/common/base/base-debug", "sarike/timefly/0.0.1/editor/editor-debug", "sarike/jquery-validate/1.11.1/jquery-validate-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var libs = require("sarike/timefly/0.0.1/libs/libs-debug");
    var Base = require("sarike/timefly/0.0.1/common/base/base-debug");
    var UserItem = Base.Views.Item.extend({
        template: _.template(require("sarike/timefly/0.0.1/common/box/templates/user_item-debug.tpl")),
        tagName: "li",
        className: "media"
    });
    var UsersBox = Base.Views.ArrayBox.extend({
        template: _.template(require("sarike/timefly/0.0.1/common/box/templates/user_list_box-debug.tpl")),
        ItemView: UserItem,
        itemContainer: ".media-list"
    });
    var AboutBox = Base.Views.ObjectBox.extend({
        template: _.template(require("sarike/timefly/0.0.1/common/box/templates/about_box-debug.tpl"))
    });
    var UserProfileBox = Base.Views.ObjectBox.extend({
        template: _.template(require("sarike/timefly/0.0.1/common/box/templates/user_profile_box-debug.tpl"))
    });
    var SideNavBox = Base.Views.PlainBox.extend({
        template: _.template(require("sarike/timefly/0.0.1/common/box/templates/side_nav_box-debug.tpl")),
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

define("sarike/timefly/0.0.1/common/box/templates/user_item-debug.tpl", [], '<a class="pull-left" href="#<%=username %>"> <img\n        class="media-object img-rounded"\n        src="http://www.gravatar.com/avatar/<%=avatar_hash %>?d=identicon"\n        class="img-rounded" alt="Avatar">\n</a>\n\n<div class="media-body">\n    <h4 class="media-heading">\n        <a href="#<%=username %>">\n            <%=nickname %>\n        </a>\n    </h4>\n    <%=description || \'还没来得及说点什么呢\' %>\n</div>');

define("sarike/timefly/0.0.1/common/box/templates/user_list_box-debug.tpl", [], '<div id="friend-list">\n    <h3>\n        活跃用户 <a href="#">查看全部</a>\n    </h3>\n    <ul class="media-list">\n    </ul>\n</div>');

define("sarike/timefly/0.0.1/common/box/templates/about_box-debug.tpl", [], '<span class="copyright">&copy; 2013</span>\n<a href="#">关于</a>\n<% if(!seajs.data.debug){ %>\n<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id=\'cnzz_stat_icon_5077336\'%3E%3C/span%3E%3Cscript src=\'" + cnzz_protocol + "s25.cnzz.com/stat.php%3Fid%3D5077336\' type=\'text/javascript\'%3E%3C/script%3E"));</script>\n<% } %>');

define("sarike/timefly/0.0.1/common/box/templates/user_profile_box-debug.tpl", [], '<div id="user-profile">\n        <div class="clearfix">\n            <div id="avatar" class="pull-left">\n                <img src="http://www.gravatar.com/avatar/<%=avatar_hash %>?d=identicon" class="img-rounded" alt="Avatar">\n            </div>\n            <div id="user-info" class="pull-left">\n                <h2>\n                    <%=nickname %>\n                </h2>\n                <ul>\n                    <li>努力中 <span class="badge badge-info"><%=ing_count %></span></li>\n                    <li>已完成 <span class="badge badge-success"><%=ed_count %></span></li>\n                    <li>未完成 <span class="badge badge-important"><%=fail_count %></span></li>\n                </ul>\n            </div>\n        </div>\n        <div id="user-desc"><%=description %></div>\n</div>');

define("sarike/timefly/0.0.1/common/box/templates/side_nav_box-debug.tpl", [], '<div id="menu">\n    <ul class="nav nav-list">\n        <% _.each(side_nav_list, function(nav){ %>\n        <li data-id="<%=nav.id %>" <% if(nav.active){ %>class="active"<% } %>>\n            <a href="javascript: void(0)"><%=nav.caption %><i class="icon-chevron-right pull-right"></i></a>\n        </li>\n        <% });%>\n    </ul>\n</div>');

/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-15
 * Time: 下午9:58
 * To change this template use File | Settings | File Templates.
 */
define("sarike/timefly/0.0.1/index/index-debug", [ "$-debug", "gallery/underscore/1.4.4/underscore-debug", "sarike/timefly/0.0.1/libs/libs-debug", "gallery/backbone/1.0.0/backbone-debug", "sarike/jquery-ui/1.10.3/jquery-ui-debug", "sarike/jquery-noty/2.1.0/jquery-noty-debug", "sarike/timefly/0.0.1/common/common-debug", "sarike/timefly/0.0.1/common/base/base-debug", "sarike/timefly/0.0.1/editor/editor-debug", "sarike/jquery-validate/1.11.1/jquery-validate-debug", "sarike/timefly/0.0.1/common/box/box-debug" ], function(require, exports) {
    var $ = require("$-debug");
    var _ = require("gallery/underscore/1.4.4/underscore-debug");
    var libs = require("sarike/timefly/0.0.1/libs/libs-debug");
    var Common = require("sarike/timefly/0.0.1/common/common-debug");
    var PassionateUserCollection = Common.Collections.BaseCollection.extend({
        url: "account/passionate_users"
    });
    var LatestTodoCollection = Common.Collections.BaseCollection.extend({
        url: "todo/latest_todos"
    });
    var TodoItem = Common.Views.Item.extend({
        className: "media",
        template: _.template(require("sarike/timefly/0.0.1/index/templates/todo_item-debug.tpl")),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var IndexContent = Common.Views.Content.extend({
        title: "最新计划",
        sub_title: "时光飞逝网友们最近发布的最新计划，一起来为他们加油吧",
        template: _.template(require("sarike/timefly/0.0.1/index/templates/index_content-debug.tpl")),
        itemContainer: ".media-list",
        ItemView: TodoItem
    });
    exports.init = function(context) {
        context.router.route("", "index", function() {
            var sideBarBoxes = [ new Common.Box.UserBox({
                collection: new PassionateUserCollection()
            }), new Common.Box.AboutBox() ], content = new IndexContent({
                collection: new LatestTodoCollection()
            });
            context.user.set("self_home", false);
            context.user.set("at_index_page", true);
            Common.init(context, {
                sideBarBoxes: sideBarBoxes,
                content: content
            });
        });
    };
});

define("sarike/timefly/0.0.1/index/templates/todo_item-debug.tpl", [], '  <a class="pull-left" href="./#<%=user.username %>">\n    <img class="media-object img-rounded"\n         src="http://www.gravatar.com/avatar/<%=user.avatar_hash %>?d=identicon">\n  </a>\n  <div class="media-body" style="font-size:14px;line-height: 20px;">\n    <h4 class="media-heading"><%=todo_name %></h4>\n          <div class="todo_info">\n              该计划由 <a href="./#<%=user.username %>"><%=user.nickname || user.username %></a>\n                开始于 <%=todo_start %> ，\n                计划在 <%=todo_end %> 完成！\n          </div>\n        <div class="markdown todo_desc">\n            <%=tf.md.toHTML(todo_description) %>\n        </div>\n  </div>');

define("sarike/timefly/0.0.1/index/templates/index_content-debug.tpl", [], '<ul class="media-list">\n</ul>');

/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-26
 * Time: 下午20:09
 * To change this template use File | Settings | File Templates.
 */
define("sarike/timefly/0.0.1/home/home-debug", [ "$-debug", "gallery/underscore/1.4.4/underscore-debug", "gallery/backbone/1.0.0/backbone-debug", "sarike/timefly/0.0.1/libs/libs-debug", "sarike/jquery-ui/1.10.3/jquery-ui-debug", "sarike/jquery-noty/2.1.0/jquery-noty-debug", "sarike/timefly/0.0.1/common/common-debug", "sarike/timefly/0.0.1/common/base/base-debug", "sarike/timefly/0.0.1/editor/editor-debug", "sarike/jquery-validate/1.11.1/jquery-validate-debug", "sarike/timefly/0.0.1/common/box/box-debug" ], function(require, exports) {
    var $ = require("$-debug"), _ = require("gallery/underscore/1.4.4/underscore-debug"), Backbone = require("gallery/backbone/1.0.0/backbone-debug"), libs = require("sarike/timefly/0.0.1/libs/libs-debug"), Common = require("sarike/timefly/0.0.1/common/common-debug"), Editor = require("sarike/timefly/0.0.1/editor/editor-debug");
    var AcContentEditor = Editor.extend({
        text_area_name: "ac_description",
        editor_label: "描述一下你这次又做了哪些努力"
    });
    var settingFormTemplate = require("sarike/timefly/0.0.1/home/templates/setting_form-debug.tpl"), passwordResetTemplate = require("sarike/timefly/0.0.1/home/templates/password_reset_form-debug.tpl");
    var MyFriendsCollection = Common.Collections.BaseCollection.extend({
        url: "account/my_friends"
    });
    var MyTodosCollection = Common.Collections.BaseCollection.extend({
        url: "todo/my_todos"
    });
    var AddNewAcModal = libs.JQueryUI.Dialog.extend({
        template: _.template(require("sarike/timefly/0.0.1/home/templates/add_complete_modal-debug.tpl")),
        ok: function() {
            this.$("#ac-form").submit();
        },
        extraInitialize: function() {
            this.todoView = this.options.todoView;
            _.extend(this.tpl_data, {
                todo_id: this.todoView.model.get("todo_id")
            });
        },
        extraRender: function() {
            this.$(".editor-field").html(this.options.editor.render().el);
            var ac_form = this.$("#ac-form");
            var self = this;
            ac_form.validate({
                errorClass: "error",
                submitHandler: function(form) {
                    $(form).ajaxSubmit($.proxy(function(res) {
                        this.close();
                        this.todoView.model.get("achievement_list").push(res.data);
                        this.todoView.render();
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
                    ac_name: {
                        required: true,
                        maxlength: 20
                    },
                    ac_description: "required"
                },
                messages: {
                    ac_name: {
                        required: "不响亮不要紧，可不能不填哟",
                        maxlength: jQuery.format("够响亮了，不过不能多于{0}个字符")
                    },
                    ac_description: "你到底是完成了什么呢？"
                }
            });
        }
    });
    exports.init = function(context) {
        var editor = new AcContentEditor();
        var TodoItem = Common.Views.Item.extend({
            template: _.template(require("sarike/timefly/0.0.1/home/templates/todo_item-debug.tpl")),
            className: "todo",
            events: {
                "click a.mark-complete": "markComplete",
                "click a.delete-todo": "deleteTodo",
                "click a.change-visible": "changeVisible",
                "click a.add-new-complete": "addNewComplete"
            },
            toggleOps: function() {
                this.$(".todo-ops").toggle();
            },
            dealTodo: function(url, callback, notification) {
                var todo_id = this.model.get("todo_id");
                libs.Noty.Confirm({
                    text: notification,
                    ok: function(noty) {
                        noty.close();
                        $.get(url, {
                            todo_id: todo_id
                        }, function(res) {
                            if (!!callback && typeof callback == "function") {
                                callback(res.data);
                            }
                            libs.Noty.NotyWithRes(res);
                        });
                    }
                });
            },
            markComplete: function() {
                var notification = this.model.get("todo_is_completed") ? "确定要撤销已完成状态吗？" : "确定要标记为完成吗？";
                this.dealTodo("/todo/mark_complete", $.proxy(function(data) {
                    this.model.set("todo_is_completed", data.todo_is_completed);
                }, this), notification);
            },
            deleteTodo: function() {
                this.dealTodo("/todo/delete_todo", $.proxy(function(data) {
                    this.$el.fadeOut();
                }, this), "确定要删除吗？");
            },
            changeVisible: function() {
                var notification = this.model.get("todo_visible") ? "确定要设为私密计划吗？" : "确定要公开该计划吗？";
                this.dealTodo("/todo/change_visible", $.proxy(function(data) {
                    this.model.set("todo_visible", data.todo_visible);
                }, this), notification);
            },
            addNewComplete: function() {
                var addNewAcModal = new AddNewAcModal({
                    editor: editor,
                    todoView: this
                });
                addNewAcModal.open({
                    width: $(window).width() * .6,
                    modal: true,
                    title: "记录新的突破",
                    resizable: false
                });
            },
            render: function() {
                this.$el.html(this.template({
                    todo: this.model.toJSON(),
                    user: context.user.toJSON()
                }));
                this.$el.mouseover($.proxy(function() {
                    this.toggleOps();
                }, this)).mouseout($.proxy(function() {
                    this.toggleOps();
                }, this));
                return this;
            }
        });
        var HomeContent = Common.Views.Content.extend({
            className: "",
            has_title: false,
            ItemView: TodoItem
        });
        var SettingContent = Common.Views.ObjectContent.extend({
            title: "个人描述",
            sub_title: "写下自己的奋斗宣言",
            template: _.template(settingFormTemplate),
            events: {
                "click #updateProfile": "updateProfile"
            },
            updateProfile: function() {
                var desc = this.$("#id_description").val();
                $.post("/account/update_profile", {
                    desc: desc
                }, function(res) {
                    libs.Noty.NotyWithRes(res);
                });
            }
        });
        var ResetPasswordContent = Common.Views.ObjectContent.extend({
            title: "密码重置",
            sub_title: "修改您的账号密码",
            template: _.template(passwordResetTemplate),
            events: {
                "click #resetPwd": "resetPwd"
            },
            resetPwd: function() {
                var old_password = this.$("#id_old_password").val();
                var new_password = this.$("#id_new_password").val();
                var new_password_confirm = this.$("#id_new_password_confirm").val();
                $.post("/account/reset_password", {
                    old_password: old_password,
                    new_password: new_password,
                    new_password_confirm: new_password_confirm
                }, function(res) {
                    libs.Noty.NotyWithRes(res);
                });
            }
        });
        var HomeSideNavBox = Common.Box.SideNavBox.extend({
            side_nav_list: [ {
                id: "doing",
                caption: "正在努力的计划",
                active: true
            }, {
                id: "completed",
                caption: "已经完成的计划"
            }, {
                id: "failed",
                caption: "半途而废的计划"
            } ],
            action: function(nav) {
                var nav_id = nav.data("id");
                this.options.content.refresh({
                    flag: nav_id
                });
            }
        });
        var SettingSideNavBox = Common.Box.SideNavBox.extend({
            side_nav_list: [ {
                active: true,
                id: "profile",
                caption: "个人资料"
            }, {
                id: "pwd_reset",
                caption: "密码设置"
            } ],
            action: function(nav) {
                var flag = nav.data("id");
                var settingContent = this.options.content;
                if (flag == "profile") context.content.html(settingContent.render().el);
                if (flag == "pwd_reset") context.content.html(new ResetPasswordContent().render().el);
            }
        });
        context.router.route(":username(/:position)", "home", function(username, position) {
            $.get("/" + username, function(res) {
                var owner = res.data.owner;
                var self_home = context.user.get("username") == owner["username"];
                context.user.trigger("update-user-event", {
                    self_home: self_home,
                    at_index_page: false,
                    other_home_owner: owner["username"]
                });
                var content = null, sideBarBoxes = null;
                if (!!position && position == "setting") {
                    content = new SettingContent({
                        data: {
                            user: context.user.toJSON()
                        }
                    });
                    sideBarBoxes = [ new Common.Box.UserProfileBox({
                        model: new Backbone.Model(owner)
                    }), new SettingSideNavBox({
                        content: content
                    }), new Common.Box.AboutBox() ];
                } else {
                    content = new HomeContent({
                        data: {
                            user: context.user
                        },
                        collection: new MyTodosCollection()
                    });
                    sideBarBoxes = [ new Common.Box.UserProfileBox({
                        model: new Backbone.Model(owner)
                    }), new HomeSideNavBox({
                        content: content
                    }), new Common.Box.UserBox({
                        collection: new MyFriendsCollection()
                    }), new Common.Box.AboutBox() ];
                }
                Common.init(context, {
                    sideBarBoxes: sideBarBoxes,
                    content: content
                });
                $(document).tooltip();
            });
        });
    };
});

define("sarike/timefly/0.0.1/home/templates/setting_form-debug.tpl", [], '    <div class="control-group">\n        <div class="controls">\n            <textarea cols="40" class="input-block-level" id="id_description" rows="5"><%=user.description %></textarea>\n        </div>\n    </div>\n    <div class="control-group">\n        <div class="controls">\n            <button id="updateProfile" class="btn btn-info">保存更改</button>\n        </div>\n    </div>');

define("sarike/timefly/0.0.1/home/templates/password_reset_form-debug.tpl", [], '<div class="form-horizontal text-left" method="post">\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">原始密码</label>\n            <div class="controls">\n                <input id="id_old_password" maxlength="30" name="old_password" size="30" type="password">\n                <span class="inline label label-important"></span>\n                <!-- <span class="help-block"><a href="#">你竟然把密码给忘记了？</a></span> -->\n            </div>\n        </div>\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">新密码</label>\n            <div class="controls">\n            <input id="id_new_password" maxlength="30" name="new_password" size="30" type="password">\n            <span class="inline label label-important"></span>\n            </div>\n        </div>\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">确认密码</label>\n            <div class="controls">\n                <input id="id_new_password_confirm" maxlength="30" name="new_password_confirm" size="30" type="password">\n                <span class="inline label label-important"></span>\n            </div>\n        </div>\n        <div class="control-group">\n            <div class="controls">\n                <button id="resetPwd" class="btn btn-info">保存更改</button>\n            </div>\n        </div>\n    </div>');

define("sarike/timefly/0.0.1/home/templates/add_complete_modal-debug.tpl", [], '<div id="acModal">\n    <div>\n        <form id="ac-form" action="todo/add_ac" method="post">\n            <input type="hidden" name="todo_id" value="<%=todo_id %>"/>\n            <label for="id_ac_name">为你这一重大突破起一个响亮的名字</label>\n            <input id="id_ac_name" maxlength="20" name="ac_name" type="text" class="input-block-level">\n            <div class="editor-field">\n            </div>\n        </form>\n    </div>\n</div>');

define("sarike/timefly/0.0.1/home/templates/todo_item-debug.tpl", [], '<h2>\n    <%=todo.todo_name %>\n    <% if(user.is_authenticated && user.self_home){ %>\n        <span class="pull-right todo-ops hide">\n            <a href="javascript:void(0)"\n               class="mark-complete"\n               title="<% if(todo.todo_is_completed){ %>\n                       撤销已完成状态\n                      <% }else{ %>\n                       设置为已完成\n                      <% } %>">\n                <i class=" icon-ok"></i>\n            </a>\n            <% if(todo.todo_erasable){ %>\n                <a href="javascript:void(0)"\n                   class="delete-todo"\n                   title="删除该计划">\n                    <i class=" icon-trash"></i>\n                </a>\n            <% } %>\n            <a href="javascript:void(0)"\n               class="change-visible"\n               title="<% if(todo.todo_visible){ %>\n                         设置为仅对自己可见\n                      <% }else{ %>\n                         设置为对所有人可见\n                      <% } %>">\n                <i class=" icon-eye-open"></i>\n            </a>\n            <% if(!todo.todo_is_completed){ %>\n                <a href="javascript:void(0)"\n                   class="add-new-complete"\n                   title="添加新的进度">\n                    <i class="icon-plus"></i>\n                </a>\n            <% } %>\n        </span>\n    <% } %>\n</h2>\n<div class="todo_meta shadow <% if(!todo.todo_visible){ %>todo_private<% } %>">\n    <div class="todo_info">\n        该计划开始于  <%=todo.todo_start %> ，计划在\n         <%=todo.todo_end %>  完成！\n    </div>\n    <div class="todo_desc markdown"><%=tf.md.toHTML(todo.todo_description) %></div>\n</div>\n\n<div class="todo_complete">\n    <div class="accordion" id="todo-completes<%=todo.todo_id %>">\n    <% _.each(todo.achievement_list, function(ac, index, list){ %>\n        <div class="accordion-group">\n            <div class="accordion-heading">\n                <a class="accordion-toggle" data-toggle="collapse"\n                    data-parent="#todo-completes<%=todo.todo_id %>" href="#collapse<%=ac.id %>">\n                    在<%=tf.mm.utc2local(ac.created_date) %> 记录: <%=ac.ac_name %>\n                </a>\n            </div>\n            <div id="collapse<%=ac.id %>" class="accordion-body collapse ">\n                <div class="accordion-inner markdown"><%=tf.md.toHTML(ac.ac_description) %></div>\n            </div>\n        </div>\n    <% }); %>\n    </div>\n</div>');
