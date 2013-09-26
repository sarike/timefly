  <a class="pull-left" href="http://<%=user.username %>">
    <img class="media-object img-rounded"
         src="http://www.gravatar.com/avatar/<%=user.avatar_hash %>?d=identicon">
  </a>
  <div class="media-body" style="font-size:14px;line-height: 20px;">
    <h4 class="media-heading"><%=todo_name %></h4>
        该计划由 <a href="./<%=user.username %>"><%=user.nickname || user.username %></a>
        开始于 <%=new Date(todo_start).format("yyyy-MM-dd") %> ，
        计划在 <%=new Date(todo_end).format("yyyy-MM-dd") %> 完成！
        <br>
        <%=todo_description %>
  </div>