  <a class="pull-left" href="./#<%=user.username %>">
    <img class="media-object img-rounded"
         src="http://www.gravatar.com/avatar/<%=user.avatar_hash %>?d=identicon">
  </a>
  <div class="media-body" style="font-size:14px;line-height: 20px;">
    <h4 class="media-heading"><%=todo_name %></h4>
          <div class="todo_info">
              该计划由 <a href="./#<%=user.username %>"><%=user.nickname || user.username %></a>
                开始于 <%=todo_start %> ，
                计划在 <%=todo_end %> 完成！
          </div>
        <div class="markdown todo_desc">
            <%=tf.md.toHTML(todo_description) %>
        </div>
  </div>