<div id="acModal">
    <div>
        <form id="ac-form" action="todo/add_ac" method="post">
            <input type="hidden" name="todo_id" value="<%=todo_id %>"/>
            <label for="id_ac_name">为你这一重大突破起一个响亮的名字</label>
            <input id="id_ac_name" maxlength="128" name="ac_name" type="text" class="input-block-level">
            <div class="editor-field">
            </div>
        </form>
    </div>
</div>