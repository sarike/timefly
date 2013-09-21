/**
 * Created with PyCharm.
 * User: Administrator
 * Date: 13-9-13
 * Time: 下午8:04
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $ = require("$");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var ui = require("jquery-ui");
    var noty = require("jquery-noty");

    /**
     * var dialog = new Dialog({
     *     content: content,
     *     config: { }
     * })
     */
    var Dialog = Backbone.View.extend({

        _getButton: function (text, click) {
            return {
                text: text,
                click: click
            };
        },

        defaultConfig: {
        },

        initialize: function () {
            var okButton = this._getButton("确定", $.proxy(this.ok, this));
            var cancelButton = this._getButton("取消", $.proxy(this.cancel, this));
            this.defaultConfig.buttons = [
                okButton,
                cancelButton
            ];
        },

        ok: function () {
            console.warn("This is the default okClick, maybe you shoud override ok Func!")
        },

        cancel: function () {
            this.close();
        },

        render: function () {
            this.$el.html(this.template(this.options));
            return this;
        },

        open: function (config) {
            this.render();
            this.$el.dialog(_.extend(this.defaultConfig, config));
        },

        close: function () {
            this.$el.dialog("close");
        }
    });

    var JQueryUI = {
        Dialog: Dialog
    };

    noty.NotyWithRes = function(res){
        noty({
            type: res.type,
            layout: res.layout,
            text: res.info
        })
    };

    module.exports = {
        JQueryUI: JQueryUI,
        Noty: noty
    };

});
