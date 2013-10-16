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

    require("jquery-validate");

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
            this.extraRender();
            return this;
        },

        extraRender: function () {
        },

        open: function (config) {
            this.render();
            this.$el.dialog(_.extend(this.defaultConfig, config));
        },

        close: function () {
            this.$el.dialog("destroy");
        }
    });

    $.datepicker.setDefaults({
        autoSize: true,
        showAnim: "slideDown",
        closeText: '关闭',
        prevText: '&#x3C;上月',
        nextText: '下月&#x3E;',
        currentText: '今天',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        weekHeader: '周',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'
    });

    var JQueryUI = {
        Dialog: Dialog
    };

    var Noty = {

        noty: function(type, info){
            noty({
                type: type,
                layout: 'center',
                text: info,
                timeout: 1000
            })
        },

        NotyWithRes: function (res) {
            noty({
                type: res.type,
                layout: res.layout,
                text: res.info,
                timeout: 1000
            })
        },

        Confirm: function (options) {
            var ok_button = {
                addClass: 'btn btn-primary',
                text: 'Ok',
                onClick: options.ok || function(noty){
                     noty.close();
                }
            };
            var cancel_button = {
                addClass: 'btn btn-danger',
                text: 'Cancel',
                onClick: options.cancel || function(noty){
                     noty.close();
                }
            };
            noty({
                type: options.type || 'information',
                layout: options.layout || 'center',
                text: options.text || '你确定吗？',
                buttons: [ok_button,cancel_button]
            });
        }
    };

    module.exports = {
        JQueryUI: JQueryUI,
        Noty: Noty
    };

});
