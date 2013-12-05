define("sarike/timefly/0.0.1/timefly",["$","gallery/backbone/1.0.0/backbone","gallery/underscore/1.4.4/underscore","sarike/bootstrap/2.3.2/bootstrap","jquery-plugin/form/3.44.0/form","./common/common","./libs/libs","sarike/jquery-ui/1.10.3/jquery-ui","sarike/jquery-noty/2.1.0/jquery-noty","./common/base/base","sarike/jquery-validate/1.11.1/jquery-validate","./common/base/templates/common_empty.tpl","./common/base/templates/common_content.tpl","./common/base/templates/common_header.tpl","./common/base/templates/add_todo_modal.tpl","./common/box/box","./common/box/templates/user_item.tpl","./common/box/templates/user_list_box.tpl","./common/box/templates/about_box.tpl","./common/box/templates/user_profile_box.tpl","./common/box/templates/side_nav_box.tpl","sarike/moment-timezone/0.0.3/moment-timezone","sarike/moment/2.4.0/moment","sarike/markdown/0.6.0/markdown","./index/index","./index/templates/todo_item.tpl","./index/templates/index_content.tpl","./home/home","./home/templates/setting_form.tpl","./home/templates/password_reset_form.tpl","./home/templates/todo_item.tpl","./home/templates/add_complete_modal.tpl"],function(a,b){var c=a("$"),d=a("gallery/backbone/1.0.0/backbone");a("sarike/bootstrap/2.3.2/bootstrap"),a("jquery-plugin/form/3.44.0/form");var e=a("./common/common");b.mm=a("sarike/moment-timezone/0.0.3/moment-timezone"),b.md=a("sarike/markdown/0.6.0/markdown"),c(function(){c.get("me",function(b){var f=new d.Router,g=new e.Models.BaseUser(b.data.user),h={header:c("header"),sideBar:c("#sidebar"),content:c("#content"),footer:c("footer"),user:g,router:f};a("./index/index").init(h),a("./home/home").init(h),d.history.start()})})}),define("sarike/timefly/0.0.1/common/common",["sarike/timefly/0.0.1/libs/libs","$","gallery/underscore/1.4.4/underscore","gallery/backbone/1.0.0/backbone","sarike/jquery-ui/1.10.3/jquery-ui","sarike/jquery-noty/2.1.0/jquery-noty","sarike/timefly/0.0.1/common/base/base","sarike/jquery-validate/1.11.1/jquery-validate","sarike/timefly/0.0.1/common/box/box"],function(a,b,c){a("sarike/timefly/0.0.1/libs/libs"),a("$");var d=a("gallery/underscore/1.4.4/underscore"),e=a("sarike/timefly/0.0.1/common/base/base"),f=a("sarike/timefly/0.0.1/common/box/box"),g=function(a,b){b&&(a.sideBar.empty(),d.each(b,function(b){b.collection?(a.sideBar.append(b.render().el),b.collection.fetch({success:function(a){0==a.length&&b.renderEmpty()}})):a.sideBar.append(b.render().el)},this))},h=function(a,b){a.header.html(b.render().el)},i=function(a,b){a.content.html(b.render().el),b.collection&&b.collection.fetch({success:function(a){0==a.length&&b.renderEmpty()}})},j=function(a,b){a.footer.html(b.render().el)};c.exports={Models:e.Models,Collections:e.Collections,Views:e.Views,Box:f,init:function(a,b){h(a,b.header||new e.Views.Header({user:a.user,content:b.content})),g(a,b.sideBarBoxes),i(a,b.content||new e.Views.Content),j(a,b.footer||new e.Views.Footer)}}}),define("sarike/timefly/0.0.1/libs/libs",["$","gallery/underscore/1.4.4/underscore","gallery/backbone/1.0.0/backbone","sarike/jquery-ui/1.10.3/jquery-ui","sarike/jquery-noty/2.1.0/jquery-noty"],function(a,b,c){var d=a("$"),e=a("gallery/underscore/1.4.4/underscore"),f=a("gallery/backbone/1.0.0/backbone");a("sarike/jquery-ui/1.10.3/jquery-ui");var g=a("sarike/jquery-noty/2.1.0/jquery-noty"),h=f.View.extend({_getButton:function(a,b){return{text:a,click:b}},defaultConfig:{},initialize:function(){var a=this._getButton("确定",d.proxy(this.ok,this)),b=this._getButton("取消",d.proxy(this.cancel,this));this.defaultConfig.buttons=[a,b]},ok:function(){console.warn("This is the default okClick, maybe you shoud override ok Func!")},cancel:function(){this.close()},render:function(){return this.$el.html(this.template(this.options)),this.extraRender(),this},extraRender:function(){},open:function(a){this.render(),this.$el.dialog(e.extend(this.defaultConfig,a))},close:function(){this.$el.dialog("destroy")}});d.datepicker.setDefaults({autoSize:!0,showAnim:"slideDown",closeText:"关闭",prevText:"&#x3C;上月",nextText:"下月&#x3E;",currentText:"今天",monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],monthNamesShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],dayNames:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],dayNamesShort:["周日","周一","周二","周三","周四","周五","周六"],dayNamesMin:["日","一","二","三","四","五","六"],weekHeader:"周",dateFormat:"yy-mm-dd",firstDay:1,isRTL:!1,showMonthAfterYear:!0,yearSuffix:"年"});var i={Dialog:h},j={noty:function(a,b){g({type:a,layout:"center",text:b,timeout:1e3})},NotyWithRes:function(a){g({type:a.type,layout:a.layout,text:a.info,timeout:1e3})},Confirm:function(a){var b={addClass:"btn btn-primary",text:"Ok",onClick:a.ok||function(a){a.close()}},c={addClass:"btn btn-danger",text:"Cancel",onClick:a.cancel||function(a){a.close()}};g({type:a.type||"information",layout:a.layout||"center",text:a.text||"你确定吗？",buttons:[b,c]})}};c.exports={JQueryUI:i,Noty:j}}),define("sarike/timefly/0.0.1/common/base/base",["sarike/timefly/0.0.1/libs/libs","$","gallery/underscore/1.4.4/underscore","gallery/backbone/1.0.0/backbone","sarike/jquery-ui/1.10.3/jquery-ui","sarike/jquery-noty/2.1.0/jquery-noty","sarike/jquery-validate/1.11.1/jquery-validate"],function(a,b,c){var d=a("sarike/timefly/0.0.1/libs/libs"),e=a("$"),f=a("gallery/underscore/1.4.4/underscore"),g=a("gallery/backbone/1.0.0/backbone");a("sarike/jquery-validate/1.11.1/jquery-validate");var h=g.Model.extend({}),i=g.Model.extend({initialize:function(){this.on("update-user-event",this.updateUser,this)},updateUser:function(a){this.set(a)}}),j=g.Collection.extend({model:h,parse:function(a){return a.data.items}}),k=g.View.extend({initialize:function(){this.model.bind("change",e.proxy(this.render,this))},render:function(){return this.$el.html(this.template(this.model.toJSON())),this}}),l=g.View.extend({template:f.template(a("sarike/timefly/0.0.1/common/base/templates/common_empty.tpl")),render:function(){return this.$el.html(this.template()),this.$el.show(),this},hide:function(){this.$el.hide()}}),m=g.View.extend({itemContainer:null,emptyView:new l,initialize:function(){this.collection?this.collection.bind("add",this.addItem,this):console.warn("No collection!"),this.ItemView=this.ItemView||this.options.ItemView},render:function(){return this.$el.html(this.template()),this},refresh:function(a){this.$el.empty(),this.collection&&this.collection.fetch({success:e.proxy(function(a){0==a.length&&this.renderEmpty()},this),data:a||{}})},reRender:function(){this.itemContainer?this.itemContainer.empty():this.$el.empty(),this.collection.each(this.addItem,this)},renderEmpty:function(){this.$el.html(this.emptyView.render().el)},addItem:function(a){if(this.collection.length>0&&this.emptyView.hide(),!this.ItemView)return console.warn("No ItemView!"),void 0;var b=new this.ItemView({model:a});b.$el.hide(),this.itemContainer?this.$(this.itemContainer).prepend(b.render().el):this.$el.prepend(b.render().el),b.$el.fadeIn()}}),n=g.View.extend({className:""}),o=g.View.extend({className:"box",render:function(){return this.$el.html(this.template(this.model?this.model.toJSON():{})),this}}),p=m.extend({className:"box"}),q=o.extend({has_title:!0,base_template:f.template(a("sarike/timefly/0.0.1/common/base/templates/common_content.tpl")),render:function(){return this.renderMainContent(),this.renderSubContent(),this},renderMainContent:function(){this.$el.html(this.base_template({has_title:this.title,title:this.title||this.options.title,sub_title:this.sub_title||this.options.sub_title}))},renderSubContent:function(){this.template&&this.$el.append(this.template(this.options.data))}}),r=p.extend({has_title:!0,base_template:f.template(a("sarike/timefly/0.0.1/common/base/templates/common_content.tpl")),render:function(){return this.renderMainContent(),this.renderSubContent(),this},renderMainContent:function(){this.$el.html(this.base_template({has_title:this.title,title:this.title||this.options.title,sub_title:this.sub_title||this.options.sub_title}))},renderSubContent:function(){this.template&&this.$el.append(this.template(this.options.data))},renderEmpty:function(){this.$el.append(this.emptyView.render().el)}}),s=g.View.extend({template:f.template(a("sarike/timefly/0.0.1/common/base/templates/common_header.tpl")),events:{"click .add-new-todo":"addNewTodo","click #login-btn":"doLogin","click #reg-btn":"doReg"},doLogin:function(){this.$("#login-form").ajaxSubmit(e.proxy(function(a){"ok"==a.response?(a.data.user.self_home=a.data.user.username==this.user.get("other_home_owner"),a.data.user.at_index_page=!a.data.user.self_home,this.user.trigger("update-user-event",a.data.user),this.render(),a.data.user.self_home&&this.options.content.reRender()):d.Noty.NotyWithRes(a)},this))},doReg:function(){},addNewTodo:function(){var b=a("sarike/timefly/0.0.1/common/base/templates/add_todo_modal.tpl"),c=d.JQueryUI.Dialog.extend({template:f.template(b),ok:function(){this.$("#todo-form").submit()},extraRender:function(){var a=this.$("#id_todo_start"),b=this.$("#id_todo_end"),c=this.$("#todo-form");a.datepicker({defaultDate:"+1w",minDate:"+0d",changeYear:!0,onClose:function(a){b.datepicker("option","minDate",a)}}),b.datepicker({defaultDate:"+1w",minDate:"+0d",changeYear:!0,onClose:function(b){a.datepicker("option","maxDate",b)}});var d=this;c.validate({errorClass:"error",submitHandler:function(a){e(a).ajaxSubmit(e.proxy(function(a){this.options.contentCollection&&this.options.contentCollection.add(a.data),this.close()},d))},ignore:"input[type='checkbox']",errorPlacement:function(a,b){b.prev().hide(),b.prev().after(a)},success:function(a){a.prev().show(),a.remove()},rules:{todo_name:{required:!0,maxlength:20},todo_description:"required",todo_start:{required:!0,date:!0},todo_end:{required:!0,date:!0}},messages:{todo_name:{required:"不响亮不要紧，可不能不填哟",maxlength:jQuery.format("够响亮了，不过不能多于{0}个字符")},todo_description:"该计划到底想完成什么事情呢",todo_start:{required:"记得为该计划设定一个起始时间哟",date:"我要的是日期，你输入的是火星文吗？"},todo_end:{required:"记得为该计划设定一个结束时间哟",date:"我要的是日期，你输入的是火星文吗？"}}})}}),g=new c({contentCollection:this.options.content.collection});g.open({height:480,width:310,modal:!0,title:"制定一个新的计划",resizable:!1})},initialize:function(){this.options.user?this.user=this.options.user:console.warn("you should pass a user obj when init header")},render:function(){return this.$el.html(this.template({user:this.user.toJSON()})),this}}),t=g.View.extend({});c.exports={Models:{BaseModel:h,BaseUser:i},Collections:{BaseCollection:j},Views:{Item:k,ItemsContainer:m,EmptyView:l,ObjectBox:o,ArrayBox:p,PlainBox:n,Content:r,ObjectContent:q,Header:s,Footer:t}}}),define("sarike/timefly/0.0.1/common/base/templates/common_empty.tpl",[],'<div class="box">啥玩意儿都木有……</div>'),define("sarike/timefly/0.0.1/common/base/templates/common_content.tpl",[],'<div class="box-header">\n    <% if(has_title){ %>\n    <h2><%=title || "No Title" %></h2>\n    <p class="box-subheader"><%=sub_title || "No Sub_title" %></p>\n    <% } %>\n</div>'),define("sarike/timefly/0.0.1/common/base/templates/common_header.tpl",[],'<div class="navbar navbar-fixed-top">\n    <div class="navbar-inner">\n        <div class="container">\n            <ul class="nav">\n                <li <% if(user.at_index_page){ %>class="active"<% } %>>\n                    <a href="#" class=" clearfix">\n                        <span><i class="nav-home"></i></span>\n                        <span>主页</span>\n                    </a>\n                </li>\n                <% if(!!user && user.is_authenticated){ %>\n                <li <% if(user.self_home){ %>class="active"<% } %>>\n                    <a href="#<%=user.username %>" class=" clearfix">\n                        <span><i class="nav-me"></i></span>\n                        <span>我</span>\n                    </a>\n                </li>\n                <% } %>\n            </ul>\n\n            <div class="pull-right">\n                <% if(!!user && user.is_authenticated){ %>\n                <ul class="nav">\n                    <li>\n                        <a href="#" class=" clearfix dropdown-toggle" data-toggle="dropdown">\n									<span>\n                                        <%=user.nickname || user.username %>\n									</span>\n									<span>\n										<i class="caret"></i>\n									</span>\n                        </a>\n                        <ul class="dropdown-menu" role="menu" aria-labelledby="">\n                            <li role="presentation">\n                                <a role="menuitem" tabindex="-1" href="#<%= user.username %>/setting">\n                                    <i class="icon-user "></i> 个人资料\n                                </a>\n                            </li>\n                            <li role="presentation" class="divider"></li>\n                            <li role="presentation">\n                                <a role="menuitem" tabindex="-1" href="../account/logout">\n                                    <i class="icon-off"></i> 退出登录</a></li>\n                        </ul>\n                    </li>\n                </ul>\n                <button title="制定新计划" class="add-new-todo btn btn-info">\n                    <i class="nav-new-todo"></i><span></span>\n                </button>\n                <% }else{ %>\n                <form id="login-form" class="form-inline" action="account/ajax_login" method="post">\n                    <input type="text" name="email" class="input-medium" placeholder="Email">\n                    <input type="password" name="password" class="input-medium" placeholder="Password">\n                    <label class="checkbox">\n                        <input type="checkbox" name="remember"> 记住我\n                    </label>\n                    <button type="button" id="login-btn" class="btn btn-info">登录</button>\n                    <button class="btn btn-info" type="button" onclick="javascript:location.href=\'account/reg\'">注册\n                    </button>\n                </form>\n                <% } %>\n            </div>\n        </div>\n    </div>\n</div>'),define("sarike/timefly/0.0.1/common/base/templates/add_todo_modal.tpl",[],'<div id="todoModal" class="">\n    <div>\n        <form id="todo-form" action="todo/add_todo" method="post">\n            <label for="id_todo_name">为你的新计划起一个响亮的名字</label>\n            <input type="text" class="input-block-level" id="id_todo_name" name="todo_name"/>\n            <label for="id_todo_description">描述一下该计划打算要完成的事情</label>\n            <textarea rows="5" class="input-block-level" id="id_todo_description" name="todo_description"></textarea>\n            <label for="id_todo_start">你打算什么时候开始这个计划？</label>\n            <input type="text" class="input-block-level" id="id_todo_start" name="todo_start" value=""/>\n            <label for="id_todo_end">这个计划你预计会在什么时候完成呢？</label>\n            <input type="text" class="input-block-level" id="id_todo_end" name="todo_end" value=""/>\n            <ul>\n                <li class="checkbox"><input type="checkbox" name="todo_visible" checked/>对所有人可见</li>\n                <li class="checkbox"><input type="checkbox" name="todo_erasable"/> 不可删除</li>\n            </ul>\n        </form>\n    </div>\n</div>'),define("sarike/timefly/0.0.1/common/box/box",["$","gallery/underscore/1.4.4/underscore","sarike/timefly/0.0.1/libs/libs","gallery/backbone/1.0.0/backbone","sarike/jquery-ui/1.10.3/jquery-ui","sarike/jquery-noty/2.1.0/jquery-noty","sarike/timefly/0.0.1/common/base/base","sarike/jquery-validate/1.11.1/jquery-validate"],function(a,b,c){var d=a("$"),e=a("gallery/underscore/1.4.4/underscore");a("sarike/timefly/0.0.1/libs/libs");var f=a("sarike/timefly/0.0.1/common/base/base"),g=f.Views.Item.extend({template:e.template(a("sarike/timefly/0.0.1/common/box/templates/user_item.tpl")),tagName:"li",className:"media"}),h=f.Views.ArrayBox.extend({template:e.template(a("sarike/timefly/0.0.1/common/box/templates/user_list_box.tpl")),ItemView:g,itemContainer:".media-list"}),i=f.Views.ObjectBox.extend({template:e.template(a("sarike/timefly/0.0.1/common/box/templates/about_box.tpl"))}),j=f.Views.ObjectBox.extend({template:e.template(a("sarike/timefly/0.0.1/common/box/templates/user_profile_box.tpl"))}),k=f.Views.PlainBox.extend({template:e.template(a("sarike/timefly/0.0.1/common/box/templates/side_nav_box.tpl")),events:{"click .nav-list>li":"clickNavItem"},clickNavItem:function(a){var b=d(a.currentTarget);this.$("li").removeClass("active"),b.addClass("active"),this.action(b)},action:function(){},render:function(){return this.$el.html(this.template({side_nav_list:this.side_nav_list||this.options.side_nav_list||[]})),this}});c.exports={UserBox:h,AboutBox:i,UserProfileBox:j,SideNavBox:k}}),define("sarike/timefly/0.0.1/common/box/templates/user_item.tpl",[],'<a class="pull-left" href="#<%=username %>"> <img\n        class="media-object img-rounded"\n        src="http://www.gravatar.com/avatar/<%=avatar_hash %>?d=identicon"\n        class="img-rounded" alt="Avatar">\n</a>\n\n<div class="media-body">\n    <h4 class="media-heading">\n        <a href="#<%=username %>">\n            <%=nickname %>\n        </a>\n    </h4>\n    <%=description || \'还没来得及说点什么呢\' %>\n</div>'),define("sarike/timefly/0.0.1/common/box/templates/user_list_box.tpl",[],'<div id="friend-list">\n    <h3>\n        活跃用户 <a href="#">查看全部</a>\n    </h3>\n    <ul class="media-list">\n    </ul>\n</div>'),define("sarike/timefly/0.0.1/common/box/templates/about_box.tpl",[],'<span class="copyright">&copy; 2013</span> <a href="#">关于</a>'),define("sarike/timefly/0.0.1/common/box/templates/user_profile_box.tpl",[],'<div id="user-profile">\n        <div class="clearfix">\n            <div id="avatar" class="pull-left">\n                <img src="http://www.gravatar.com/avatar/<%=avatar_hash %>?d=identicon" class="img-rounded" alt="Avatar">\n            </div>\n            <div id="user-info" class="pull-left">\n                <h2>\n                    <%=nickname %>\n                </h2>\n                <ul>\n                    <li>努力中 <span class="badge badge-info"><%=ing_count %></span></li>\n                    <li>已完成 <span class="badge badge-success"><%=ed_count %></span></li>\n                    <li>未完成 <span class="badge badge-important"><%=fail_count %></span></li>\n                </ul>\n            </div>\n        </div>\n        <div id="user-desc"><%=description %></div>\n</div>'),define("sarike/timefly/0.0.1/common/box/templates/side_nav_box.tpl",[],'<div id="menu">\n    <ul class="nav nav-list">\n        <% _.each(side_nav_list, function(nav){ %>\n        <li data-id="<%=nav.id %>" <% if(nav.active){ %>class="active"<% } %>>\n            <a href="javascript: void(0)"><%=nav.caption %><i class="icon-chevron-right pull-right"></i></a>\n        </li>\n        <% });%>\n    </ul>\n</div>'),define("sarike/timefly/0.0.1/index/index",["$","gallery/underscore/1.4.4/underscore","sarike/timefly/0.0.1/libs/libs","gallery/backbone/1.0.0/backbone","sarike/jquery-ui/1.10.3/jquery-ui","sarike/jquery-noty/2.1.0/jquery-noty","sarike/timefly/0.0.1/common/common","sarike/timefly/0.0.1/common/base/base","sarike/jquery-validate/1.11.1/jquery-validate","sarike/timefly/0.0.1/common/box/box"],function(a,b){a("$");var c=a("gallery/underscore/1.4.4/underscore");a("sarike/timefly/0.0.1/libs/libs");var d=a("sarike/timefly/0.0.1/common/common"),e=d.Collections.BaseCollection.extend({url:"account/passionate_users"}),f=d.Collections.BaseCollection.extend({url:"todo/latest_todos"}),g=d.Views.Item.extend({className:"media",template:c.template(a("sarike/timefly/0.0.1/index/templates/todo_item.tpl")),render:function(){return this.$el.html(this.template(this.model.toJSON())),this}}),h=d.Views.Content.extend({title:"最新计划",sub_title:"时光飞逝网友们最近发布的最新计划，一起来为他们加油吧",template:c.template(a("sarike/timefly/0.0.1/index/templates/index_content.tpl")),itemContainer:".media-list",ItemView:g});b.init=function(a){a.router.route("","index",function(){var b=[new d.Box.UserBox({collection:new e}),new d.Box.AboutBox],c=new h({collection:new f});a.user.set("self_home",!1),a.user.set("at_index_page",!0),d.init(a,{sideBarBoxes:b,content:c})})}}),define("sarike/timefly/0.0.1/index/templates/todo_item.tpl",[],'  <a class="pull-left" href="./#<%=user.username %>">\n    <img class="media-object img-rounded"\n         src="http://www.gravatar.com/avatar/<%=user.avatar_hash %>?d=identicon">\n  </a>\n  <div class="media-body" style="font-size:14px;line-height: 20px;">\n    <h4 class="media-heading"><%=todo_name %></h4>\n          <div class="todo_info">\n              该计划由 <a href="./#<%=user.username %>"><%=user.nickname || user.username %></a>\n                开始于 <%=todo_start %> ，\n                计划在 <%=todo_end %> 完成！\n          </div>\n        <div class="markdown todo_desc">\n            <%=tf.md.toHTML(todo_description) %>\n        </div>\n  </div>'),define("sarike/timefly/0.0.1/index/templates/index_content.tpl",[],'<ul class="media-list">\n</ul>'),define("sarike/timefly/0.0.1/home/home",["$","gallery/underscore/1.4.4/underscore","gallery/backbone/1.0.0/backbone","sarike/timefly/0.0.1/libs/libs","sarike/jquery-ui/1.10.3/jquery-ui","sarike/jquery-noty/2.1.0/jquery-noty","sarike/timefly/0.0.1/common/common","sarike/timefly/0.0.1/common/base/base","sarike/jquery-validate/1.11.1/jquery-validate","sarike/timefly/0.0.1/common/box/box"],function(a,b){var c=a("$"),d=a("gallery/underscore/1.4.4/underscore"),e=a("gallery/backbone/1.0.0/backbone"),f=a("sarike/timefly/0.0.1/libs/libs"),g=a("sarike/timefly/0.0.1/common/common"),h=a("sarike/timefly/0.0.1/home/templates/setting_form.tpl"),i=a("sarike/timefly/0.0.1/home/templates/password_reset_form.tpl"),j=g.Collections.BaseCollection.extend({url:"account/my_friends"}),k=g.Collections.BaseCollection.extend({url:"todo/my_todos"});b.init=function(b){var l=g.Views.Item.extend({template:d.template(a("sarike/timefly/0.0.1/home/templates/todo_item.tpl")),events:{"click a.mark-complete":"markComplete","click a.delete-todo":"deleteTodo","click a.change-visible":"changeVisible","click a.add-new-complete":"addNewComplete"},dealTodo:function(a,b,d){var e=this.model.get("todo_id");f.Noty.Confirm({text:d,ok:function(d){d.close(),c.get(a,{todo_id:e},function(a){b&&"function"==typeof b&&b(a.data),f.Noty.NotyWithRes(a)})}})},markComplete:function(){var a=this.model.get("todo_is_completed")?"确定要撤销已完成状态吗？":"确定要标记为完成吗？";this.dealTodo("/todo/mark_complete",c.proxy(function(a){this.model.set("todo_is_completed",a.todo_is_completed)},this),a)},deleteTodo:function(){this.dealTodo("/todo/delete_todo",c.proxy(function(){this.$el.fadeOut()},this),"确定要删除吗？")},changeVisible:function(){var a=this.model.get("todo_visible")?"确定要设为私密计划吗？":"确定要公开该计划吗？";this.dealTodo("/todo/change_visible",c.proxy(function(a){this.model.set("todo_visible",a.todo_visible)},this),a)},addNewComplete:function(){var b=this,e=f.JQueryUI.Dialog.extend({template:d.template(a("sarike/timefly/0.0.1/home/templates/add_complete_modal.tpl")),ok:function(){this.$("#ac-form").submit()},extraRender:function(){var a=this.$("#ac-form"),d=this;a.validate({errorClass:"error",submitHandler:function(a){c(a).ajaxSubmit(c.proxy(function(a){this.close(),b.model.get("achievement_list").push(a.data),b.render()},d))},ignore:"input[type='checkbox']",errorPlacement:function(a,b){b.prev().hide(),b.prev().after(a)},success:function(a){a.prev().show(),a.remove()},rules:{ac_name:{required:!0,maxlength:20},ac_description:"required"},messages:{ac_name:{required:"不响亮不要紧，可不能不填哟",maxlength:jQuery.format("够响亮了，不过不能多于{0}个字符")},ac_description:"你到底是完成了什么呢？"}})}}),g=new e({contentCollection:this.options.collection,todo_id:this.model.get("todo_id")});g.open({height:335,width:300,modal:!0,title:"记录新的突破",resizable:!1})},render:function(){return this.$el.html(this.template({todo:this.model.toJSON(),user:b.user.toJSON()})),this}}),m=g.Views.Content.extend({className:"",has_title:!1,ItemView:l}),n=g.Views.ObjectContent.extend({title:"个人描述",sub_title:"写下自己的奋斗宣言",template:d.template(h),events:{"click #updateProfile":"updateProfile"},updateProfile:function(){var a=this.$("#id_description").val();c.post("/account/update_profile",{desc:a},function(a){f.Noty.NotyWithRes(a)})}}),o=g.Views.ObjectContent.extend({title:"密码重置",sub_title:"修改您的账号密码",template:d.template(i),events:{"click #resetPwd":"resetPwd"},resetPwd:function(){var a=this.$("#id_old_password").val(),b=this.$("#id_new_password").val(),d=this.$("#id_new_password_confirm").val();c.post("/account/reset_password",{old_password:a,new_password:b,new_password_confirm:d},function(a){f.Noty.NotyWithRes(a)})}}),p=g.Box.SideNavBox.extend({side_nav_list:[{id:"doing",caption:"正在努力的计划",active:!0},{id:"completed",caption:"已经完成的计划"},{id:"failed",caption:"半途而废的计划"}],action:function(a){var b=a.data("id");this.options.content.refresh({flag:b})}}),q=g.Box.SideNavBox.extend({side_nav_list:[{active:!0,id:"profile",caption:"个人资料"},{id:"pwd_reset",caption:"密码设置"}],action:function(a){var c=a.data("id"),d=this.options.content;"profile"==c&&b.content.html(d.render().el),"pwd_reset"==c&&b.content.html((new o).render().el)}});b.router.route(":username(/:position)","home",function(a,d){c.get("/"+a,function(a){var f=a.data.owner,h=b.user.get("username")==f.username;b.user.trigger("update-user-event",{self_home:h,at_index_page:!1,other_home_owner:f.username});var i=null,l=null;d&&"setting"==d?(i=new n({data:{user:b.user.toJSON()}}),l=[new g.Box.UserProfileBox({model:new e.Model(f)}),new q({content:i}),new g.Box.AboutBox]):(i=new m({data:{user:b.user},collection:new k}),l=[new g.Box.UserProfileBox({model:new e.Model(f)}),new p({content:i}),new g.Box.UserBox({collection:new j}),new g.Box.AboutBox]),g.init(b,{sideBarBoxes:l,content:i}),c(document).tooltip()})})}}),define("sarike/timefly/0.0.1/home/templates/setting_form.tpl",[],'    <div class="control-group">\n        <div class="controls">\n            <textarea cols="40" class="input-block-level" id="id_description" rows="5"><%=user.description %></textarea>\n        </div>\n    </div>\n    <div class="control-group">\n        <div class="controls">\n            <button id="updateProfile" class="btn btn-info">保存更改</button>\n        </div>\n    </div>'),define("sarike/timefly/0.0.1/home/templates/password_reset_form.tpl",[],'<div class="form-horizontal text-left" method="post">\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">原始密码</label>\n            <div class="controls">\n                <input id="id_old_password" maxlength="30" name="old_password" size="30" type="password">\n                <span class="inline label label-important"></span>\n                <!-- <span class="help-block"><a href="#">你竟然把密码给忘记了？</a></span> -->\n            </div>\n        </div>\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">新密码</label>\n            <div class="controls">\n            <input id="id_new_password" maxlength="30" name="new_password" size="30" type="password">\n            <span class="inline label label-important"></span>\n            </div>\n        </div>\n        <div class="control-group">\n            <label class="control-label" for="inputEmail">确认密码</label>\n            <div class="controls">\n                <input id="id_new_password_confirm" maxlength="30" name="new_password_confirm" size="30" type="password">\n                <span class="inline label label-important"></span>\n            </div>\n        </div>\n        <div class="control-group">\n            <div class="controls">\n                <button id="resetPwd" class="btn btn-info">保存更改</button>\n            </div>\n        </div>\n    </div>'),define("sarike/timefly/0.0.1/home/templates/todo_item.tpl",[],'<div class="todo">\n    <h2>\n        <%=todo.todo_name %>\n        <% if(user.is_authenticated && user.self_home){ %>\n            <span class="pull-right">\n                <a href="javascript:void(0)"\n                   class="mark-complete"\n                   title="<% if(todo.todo_is_completed){ %>\n                           撤销已完成状态\n                          <% }else{ %>\n                           设置为已完成\n                          <% } %>">\n                    <i class=" icon-ok"></i>\n                </a>\n                <% if(todo.todo_erasable){ %>\n                    <a href="javascript:void(0)"\n                       class="delete-todo"\n                       title="删除该计划">\n                        <i class=" icon-trash"></i>\n                    </a>\n                <% } %>\n                <a href="javascript:void(0)"\n                   class="change-visible"\n                   title="<% if(todo.todo_visible){ %>\n                             设置为仅对自己可见\n                          <% }else{ %>\n                             设置为对所有人可见\n                          <% } %>">\n                    <i class=" icon-eye-open"></i>\n                </a>\n                <% if(!todo.todo_is_completed){ %>\n                    <a href="javascript:void(0)"\n                       class="add-new-complete"\n                       title="添加新的进度">\n                        <i class="icon-plus"></i>\n                    </a>\n                <% } %>\n            </span>\n        <% } %>\n    </h2>\n    <div class="todo_meta shadow <% if(!todo.todo_visible){ %>todo_private<% } %>">\n        <div class="todo_info">\n            该计划由 <a href="./#<%=todo.user.username%>"> <%=todo.user.nickname || todo.user.username %> </a>\n            开始于  <%=todo.todo_start %> ，计划在\n             <%=todo.todo_end %>  完成！\n        </div>\n        <div class="todo_desc markdown"><%=tf.md.toHTML(todo.todo_description) %></div>\n    </div>\n\n    <div class="todo_complete">\n        <div class="accordion" id="todo-completes<%=todo.todo_id %>">\n        <% _.each(todo.achievement_list, function(ac, index, list){ %>\n            <div class="accordion-group">\n                <div class="accordion-heading">\n                    <a class="accordion-toggle" data-toggle="collapse"\n                        data-parent="#todo-completes<%=todo.todo_id %>" href="#collapse<%=ac.id %>">\n                        在<%=tf.mm.utc2local(ac.created_date) %> 记录: <%=ac.ac_name %>\n                    </a>\n                </div>\n                <div id="collapse<%=ac.id %>" class="accordion-body <%if(index==list.length-1){ %>in<% } %> collapse ">\n                    <div class="accordion-inner markdown"><%=tf.md.toHTML(ac.ac_description) %></div>\n                </div>\n            </div>\n        <% }); %>\n        </div>\n    </div>\n</div>'),define("sarike/timefly/0.0.1/home/templates/add_complete_modal.tpl",[],'<div id="acModal">\n    <div>\n        <form id="ac-form" action="todo/add_ac" method="post">\n            <input type="hidden" name="todo_id" value="<%=todo_id %>"/>\n            <label for="id_ac_name">为你这一重大突破起一个响亮的名字</label>\n            <input id="id_ac_name" maxlength="20" name="ac_name" type="text" class="input-block-level">\n            <label for="id_ac_description">描述一下你这次又做了哪些努力</label>\n            <textarea cols="40" id="id_ac_description" name="ac_description" rows="5" class="input-block-level"></textarea>\n        </form>\n    </div>\n</div>');