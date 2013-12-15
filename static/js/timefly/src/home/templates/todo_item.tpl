<div class="vote-btns">
    <div class="up-vote" title="看好你哟">
        <span class="icon-thumbs-up"></span>
        <span class="up-vote-count"><%= todo.todo_up_vote %></span>
    </div>
    <div class="down-vote" title="拉倒吧你">
        <span class="icon-thumbs-down"></span>
        <span class="down-vote-count"><%= todo.todo_down_vote %></span>
    </div>
</div>
<h2>
    <%=todo.todo_name %>
    <% if(user.is_authenticated && user.self_home){ %>
        <span class="pull-right todo-ops hide">
            <a href="javascript:void(0)"
               class="mark-complete"
               title="<% if(todo.todo_is_completed){ %>
                       撤销已完成状态
                      <% }else{ %>
                       设置为已完成
                      <% } %>">
                <i class=" icon-ok"></i>
            </a>
            <% if(todo.todo_erasable){ %>
                <a href="javascript:void(0)"
                   class="delete-todo"
                   title="删除该计划">
                    <i class=" icon-trash"></i>
                </a>
            <% } %>
            <a href="javascript:void(0)"
               class="change-visible"
               title="<% if(todo.todo_visible){ %>
                         设置为仅对自己可见
                      <% }else{ %>
                         设置为对所有人可见
                      <% } %>">
                <i class=" icon-eye-open"></i>
            </a>
            <% if(!todo.todo_is_completed){ %>
                <a href="javascript:void(0)"
                   class="add-new-complete"
                   title="添加新的进度">
                    <i class="icon-plus"></i>
                </a>
            <% } %>
        </span>
    <% } %>
</h2>
<div class="todo_meta shadow <% if(!todo.todo_visible){ %>todo_private<% } %>">
    <div class="todo_info">
        该计划开始于  <%=todo.todo_start %> ，计划在
         <%=todo.todo_end %>  完成！
    </div>
    <div class="todo_desc markdown"><%=tf.md.toHTML(todo.todo_description) %></div>
</div>

<div class="todo_complete">
    <div class="accordion" id="todo-completes<%=todo.todo_id %>">
    <% _.each(todo.achievement_list, function(ac, index, list){ %>
        <div class="accordion-group">
            <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse"
                    data-parent="#todo-completes<%=todo.todo_id %>" href="#collapse<%=ac.id %>">
                    在<%=tf.mm.utc2local(ac.created_date) %> 记录: <%=ac.ac_name %>
                </a>
            </div>
            <div id="collapse<%=ac.id %>" class="accordion-body collapse ">
                <div class="accordion-inner markdown"><%=tf.md.toHTML(ac.ac_description) %></div>
            </div>
        </div>
    <% }); %>
    </div>
</div>