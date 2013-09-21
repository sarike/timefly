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
    '$': 'jquery/jquery/1.10.1/jquery'
  },

  // 路径配置
//  paths: {
//    'gallery': 'https://a.alipayobjects.com/gallery'
//  },

  // 变量配置
  vars: {
    'locale': 'zh-cn'
  },

  // 映射配置
  map: [
  ],

  // 预加载项
  preload: ['seajs/seajs-text/1.0.2/seajs-text'],

  // 调试模式
  debug: true,

  // Sea.js 的基础路径
  //base: 'http://example.com/path/to/base/',

  // 文件编码
  charset: 'utf-8'
});

if(seajs.data.debug){
    seajs.config({
        alias:{
            underscore: 'gallery/underscore/1.4.4/underscore',
            backbone: 'gallery/backbone/1.0.0/backbone',
            bootstrap: 'gallery/bootstrap/3.0.0/bootstrap',
            "jquery-ui": "jquery-plugin/jquery-ui/1.10.3/jquery-ui",
            "jquery-noty": "jquery-plugin/jquery-noty/2.1.0/jquery.noty",
            "form": "jquery-plugin/form/3.36.0/form",
            libs: "/static/js/libs/libs/src/libs",
            utils: "/static/js/utils/src/utils",
            common: "/static/js/common/src/common"
        }
    })
}