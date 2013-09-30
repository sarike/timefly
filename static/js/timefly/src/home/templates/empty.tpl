{%if user.is_authenticated and user.username == owner.username%}
    <div class="shadow" style="padding:20px;">
    你还没有为该计划做任何事情，要加油呀！
    {%if not todo.todo_is_completed%}
    <a  href="javascript:void(0)" data-todoid="{{todo.id}}" data-toggle="modal" class="add-new-complete btn btn-info">添加进度</a>
    {%endif%}
    </div>

{%else%}
                            <div class="shadow" style="padding:20px;">
{{ owner.username}}还没有为该计划做任何努力，遗憾呀，难道他要荒废了吗！
    </div>
{%endif%}