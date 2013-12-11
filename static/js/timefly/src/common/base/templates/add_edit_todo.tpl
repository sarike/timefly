<form id="add_todo_form" action="todo/add_todo" method="post" class="clearfix">
    <h2>
        <input type="text" placeholder="起一个响亮的名字" class="input-block-level"
               id="id_todo_name" name="todo_name"/>
        <span class="pull-right">
        </span>
    </h2>
    <div class="todo_info">
        该计划开始于 <input type="text" id="id_todo_start" name="todo_start"/> ，
        计划在 <input type="text" id="id_todo_end" name="todo_end"/>  完成！
    </div>
    <div class="todo_desc markdown">
        <div class="editor-field"></div>
    </div>
    <div>
        <label class="checkbox pull-left">
            <input type="checkbox" name="todo_visible" checked/>对所有人可见
        </label>
        <label class="checkbox pull-left margin-left20">
            <input type="checkbox" name="todo_erasable"checked/> 背水一战，绝不删除
        </label>
    </div>
    <div class="add-todo-ops">
        <span class="pull-right">
            <button class="btn btn-info submit">保存</button>
            <button class="btn cancel">取消</button>
        </span>
    </div>
</form>