{%for todo in todo_list%}
    <div class="media">
      <a class="pull-left" href="http://{{request.host_url}}{{todo.user.username}}">
        <img class="media-object img-rounded"
             src="http://www.gravatar.com/avatar/{{todo.user.get_gravatar_hash()}}?d=identicon">
      </a>
      <div class="media-body" style="font-size:14px;line-height: 20px;">
        <h4 class="media-heading">{{todo.todo_name}}</h4>
        该计划由 <a href="./{{todo.user.username}}">{%if todo.user.nickname%}
                                                {{todo.user.nickname}}
                                            {%else%}
                                                {{todo.user.username}}
                                            {%endif%}
                                            </a> 开始于  {{todo.todo_start}} ，计划在
             {{todo.todo_end}}  完成！
             <br>
        {{todo.todo_description}}
      </div>
    </div>
{%endfor%}