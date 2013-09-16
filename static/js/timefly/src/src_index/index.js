/**
 * Created with PyCharm.
 * User: Sarike
 * Date: 13-9-15
 * Time: 下午9:58
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){
    var BootStrap = require('bootstrap');
    var libs = require('libs');
    var $ = require('$')
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Common = require('../src_common/common');
    var Box = require('../src_boxs/box');
    require("form");

//    var indexSideBarTemplate = require("../templates/side_bars/");

    var PassionateCollection = Common.Collections.UserCollection.extend({
        url: "account/passionate_users"
    });

    var passionateCollection = new PassionateCollection();

    var IndexSideBar = Common.Views.SiderBar.extend({
        boxs: [
            new Box.UserBox({
                collection: passionateCollection
            })
        ]
    });

    var IndexContent = Common.View.Content.extend({
        template: _.template(require("./templates/index_content.tpl"))
    });

    exports.init = function(context){

        var Componentes = {
            sideBar: new IndexSideBar()
        };
        passionateCollection.fetch({
            success: function(){
            Common.init(context, Componentes);
        }
        });
    }
});