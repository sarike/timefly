/**
 * Created by Sarike on 13-12-6.
 */
define(function(require){
    var $ = require('$'),
        Backbone = require('backbone'),
        _ = require('underscore');

    var editorTemplate = require('./templates/editor.tpl');

    var EditorView = Backbone.View.extend({
        template: _.template(editorTemplate),

        className: 'md-editor',

        text_area_name: '',
        editor_label: '',

        events: {
            "click .op-preview": "preView",
            "click .op-edit": "edit"
        },

        preView: function(){
            this.$(".preview-content").html(window.tf.md.toHTML(this.getValue())).show();
            this.$(".op-edit").show();
            this.$(".op-preview").hide();
            this.$("#md-editor-content").hide();
        },

        edit: function(){
            this.$(".preview-content").empty().hide();
            this.$(".op-edit").hide();
            this.$(".op-preview").show();
            this.$("#md-editor-content").show();
        },

        render: function(){
            this.$el.html(this.template({
                text_area_name: this.text_area_name,
                editor_label: this.editor_label
            }));
            return this;
        },

        getValue: function(){
            return this.$('#md-editor-content').val();
        }
    });

    return EditorView
});