<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <ul class="nav">
                <li class="active">
                    <a href="#" class=" clearfix">
                        <span><i class="nav-home"></i></span>
                        <span>主页</span>
                    </a>
                </li>
                <li>
                    <a href="./{{ current_user.username }}" class=" clearfix">
                        <span><i class="nav-me"></i></span>
                        <span>我</span>
                    </a>
                </li>
            </ul>

            <div class="pull-right">
                <ul class="nav">
                    <li>
                        <a href="#" class=" clearfix dropdown-toggle" data-toggle="dropdown">
									<span>
                                        UserName
									</span>
									<span>
										<i class="caret"></i>
									</span>
                        </a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="">
                            <li role="presentation">
                                <a role="menuitem" tabindex="-1" href="Setting/userinfo/">
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
                <form class="form-inline" action="../account/login" method="post">
                    <input type="text" name="email" class="input-medium" placeholder="Email">
                    <input type="password" name="password" class="input-medium" placeholder="Password">
                    <label class="checkbox">
                        <input type="checkbox"> 记住我
                    </label>
                    <button type="submit" class="btn btn-info">登录</button>
                    <button class="btn btn-info" type="button" onclick="javascript:location.href='account/reg'">注册
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>