<div id="todoModal" class="">
    <div>
        <form id="todo-form" action="add_todo" method="post">
            <label for="id_todo_name">为你的新计划起一个响亮的名字</label>
            <input type="text" id="id_todo_name" name="todo_name"/>
            <label for="id_todo_description">描述一下该计划打算要完成的事情</label>
            <input type="text" id="id_todo_description" name="todo_description"/>
            <label for="id_todo_start">你打算什么时候开始这个计划？</label>
            <input type="text" id="id_todo_start" name="todo_start"/>
            <label for="id_todo_end">这个计划你预计会在什么时候完成呢？</label>
            <input type="text" id="id_todo_end" name="todo_end"/>
            <ul>
                <li class="checkbox"><input type="checkbox" name="todo_visibale"/>对所有人可见</li>
                <li class="checkbox"><input type="checkbox" name="todo_erasable"/> 不可删除</li>
            </ul>
        </form>
    </div>
</div>