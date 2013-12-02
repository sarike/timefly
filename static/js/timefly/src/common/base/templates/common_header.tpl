<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <ul class="nav">
                <li <% if(user.at_index_page){ %>class="active"<% } %>>
                    <a href="#" class=" clearfix">
                        <span><i class="nav-home"></i></span>
                        <span>主页</span>
                    </a>
                </li>
                <% if(!!user && user.is_authenticated){ %>
                <li <% if(user.self_home){ %>class="active"<% } %>>
                    <a href="#<%=user.username %>" class=" clearfix">
                        <span><i class="nav-me"></i></span>
                        <span>我</span>
                    </a>
                </li>
                <% } %>
            </ul>

            <div class="pull-right">
                <% if(!!user && user.is_authenticated){ %>
                <ul class="nav">
                    <li>
                        <a href="#" class=" clearfix dropdown-toggle" data-toggle="dropdown">
									<span>
                                        <%=user.nickname || user.username %>
									</span>
									<span>
										<i class="caret"></i>
									</span>
                        </a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="">
                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="#<%= user.username %>/setting">
                                    <i class="icon-user "></i> 个人资料
                                </a>
                            </li>
                            <li role="presentation" class="divider"></li>
                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="../account/logout">
                                    <i class="icon-off"></i> 退出登录</a></li>
                        </ul>
                    </li>
                </ul>
                <button title="制定新计划" class="add-new-todo btn btn-info">
                    <i class="nav-new-todo"></i><span></span>
                </button>
                <% }else{ %>
                <form id="login-form" class="form-inline" action="account/ajax_login" method="post">
                    <input type="text" name="email" class="input-medium" placeholder="Email">
                    <input type="password" name="password" class="input-medium" placeholder="Password">
                    <label class="checkbox">
                        <input type="checkbox" name="remember"> 记住我
                    </label>
                    <button type="button" id="login-btn" class="btn btn-info">登录</button>
                    <button class="btn btn-info" type="button" onclick="javascript:location.href='account/reg'">注册
                    </button>
                </form>
                <% } %>
            </div>
        </div>
    </div>
</div>