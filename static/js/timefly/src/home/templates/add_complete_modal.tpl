<div id="acModal">
    <div>
        <form id="ac-form" action="todo/add_ac" method="post">
            <input type="hidden" name="todo_id" value="<%=todo_id %>"/>
            <label for="id_ac_name">为你这一重大突破起一个响亮的名字</label>
            <input id="id_ac_name" maxlength="20" name="ac_name" type="text" class="input-block-level">
            <label for="id_ac_description">描述一下你这次又做了哪些努力</label>
            <textarea cols="40" id="id_ac_description" name="ac_description" rows="10" class="input-block-level"></textarea>
        </form>
    </div>
</div>