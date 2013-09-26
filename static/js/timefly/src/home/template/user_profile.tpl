<div id="user-profile">
        <div class="clearfix">
            <div id="avatar" class="pull-left">
                <img src="http://www.gravatar.com/avatar/<%=user.avatar_hash %>?d=identicon" class="img-rounded" alt="Avatar">
            </div>
            <div id="user-info" class="pull-left">
                <h2>
                    <%=user.nickname %>
                </h2>
                <ul>
                    <li>努力中 <span class="badge badge-info"><%=user.ing_count %></span></li>
                    <li>已完成 <span class="badge badge-success"><%=user.ed_count %></span></li>
                    <li>未完成 <span class="badge badge-important"><%=user.fail_count %></span></li>
                </ul>
            </div>
        </div>
        <div id="user-desc"><%=user.description %></div>
</div>