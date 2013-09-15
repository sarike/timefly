/**
 * Created with PyCharm.
 * User: Administrator
 * Date: 13-9-13
 * Time: 下午8:04
 * To change this template use File | Settings | File Templates.
 */
define("sarike/libs/1.0.0/libs-debug", [ "$-debug", "gallery/jquery-ui/1.10.3/jquery-ui-debug", "underscore-debug", "backbone-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var ui = require("gallery/jquery-ui/1.10.3/jquery-ui-debug");
    var _ = require("underscore-debug");
    var Backbone = require("backbone-debug");
    /**
     * var dialog = new Dialog({
     *     content: content,
     *     config: { }
     * })
     */
    var Dialog = Backbone.View.extend({
        render: function() {
            this.$el.html(this.template(this.options));
            return this;
        },
        open: function(config) {
            this.render();
            this.$el.dialog(config);
        }
    });
    var JQueryUI = {
        Dialog: Dialog
    };
    module.exports = {
        JQueryUI: JQueryUI
    };
});
