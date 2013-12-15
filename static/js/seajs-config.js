/**
 * Created with PyCharm.
 * User: Administrator
 * Date: 13-9-13
 * Time: 下午7:41
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
  // 别名配置
  alias: {
    "$": "jquery/jquery/1.10.1/jquery"
  },

  // 路径配置
//  paths: {
//    "gallery": "https://a.alipayobjects.com/gallery"
//  },

  // 变量配置
  vars: {
    "locale": "zh-cn"
  },

  // 映射配置
  map: [
      [ /^(.*\.(?:css|js|tpl))(.*)$/i, '$1?201312160006' ]
  ],

  // 预加载项
  preload: ["seajs/seajs-text/1.0.3/seajs-text"],

  // Sea.js 的基础路径
  //base: "http://example.com/path/to/base/",

  // 文件编码
  charset: "utf-8"
});

if(seajs.data.debug){
    seajs.config({
        alias:{
            "underscore": "gallery/underscore/1.4.4/underscore",
            "backbone": "gallery/backbone/1.0.0/backbone",
            "bootstrap": "sarike/bootstrap/2.3.2/bootstrap",
            "jquery-ui": "sarike/jquery-ui/1.10.3/jquery-ui",
            "jquery-validate": "sarike/jquery-validate/1.11.1/jquery-validate",
            "jquery-noty": "sarike/jquery-noty/2.1.0/jquery-noty",
            "form": "jquery-plugin/form/3.44.0/form",
            "markdown": "sarike/markdown/0.6.0/markdown",
            "moment-timezone": "sarike/moment-timezone/0.0.3/moment-timezone"
        }
    })
}